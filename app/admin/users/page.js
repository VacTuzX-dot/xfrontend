"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

export default function Page() {
  const API = "/api/users";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [flashIds, setFlashIds] = useState([]); // แถวที่จะทำไฮไลต์หลัง encrypt
  const [selectedIds, setSelectedIds] = useState([]); // สำหรับเลือกหลาย user
  const [selectAll, setSelectAll] = useState(false);
  const router = useRouter();

  const prevItemsRef = useRef([]);

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const s = q.toLowerCase();
    return items.filter(
      (x) =>
        (x.firstname || "").toLowerCase().includes(s) ||
        (x.fullname || "").toLowerCase().includes(s) ||
        (x.lastname || "").toLowerCase().includes(s) ||
        (x.username || "").toLowerCase().includes(s) ||
        (x.address || "").toLowerCase().includes(s) ||
        (x.sex || "").toLowerCase().includes(s)
    );
  }, [items, q]);

  // จัดการเลือก user ทีละคน
  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // จัดการเลือกทั้งหมด
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(filtered.map((item) => item.id));
      setSelectAll(true);
    }
  };

  // อัปเดต selectAll ถ้า filtered หรือ selectedIds เปลี่ยน
  useEffect(() => {
    if (filtered.length === 0) {
      setSelectAll(false);
    } else {
      setSelectAll(
        filtered.length > 0 &&
          filtered.every((item) => selectedIds.includes(item.id))
      );
    }
  }, [filtered, selectedIds]);

  // ลบผู้ใช้หลายคน
  async function handleDeleteSelected() {
    if (selectedIds.length === 0) return;
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: `ลบผู้ใช้ที่เลือกทั้งหมด?`,
      html: `คุณแน่ใจหรือไม่ว่าจะลบ <b>${selectedIds.length}</b> รายการ?`,
      showCancelButton: true,
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
    });
    if (!isConfirmed) return;
    let ok = 0,
      fail = 0;
    for (const id of selectedIds) {
      try {
        const res = await fetch(`${API}/${id}`, {
          method: "DELETE",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Delete failed");
        ok++;
      } catch (err) {
        fail++;
      }
    }
    await getUsers(false);
    setSelectedIds([]);
    Swal.fire({
      icon: fail ? "warning" : "success",
      title: fail ? "สำเร็จบางส่วน" : "สำเร็จ",
      html: `ลบสำเร็จ: <b>${ok}</b> รายการ<br/>ล้มเหลว: <b>${fail}</b> รายการ`,
    });
  }

  async function getUsers(showSpinner = true) {
    try {
      if (showSpinner) setLoading(true);
      const res = await fetch(API);
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];

      // ตรวจว่ามี user ไหนที่เพิ่งถูกแฮช (จาก plaintext → hashed) จะเน้นสีให้แป๊บหนึ่ง
      const prev = prevItemsRef.current;
      const justHashedIds = [];
      for (const cur of arr) {
        const old = prev.find((p) => p.id === cur.id);
        if (old && old.password && cur.password) {
          const wasPlain = !isHashed(old.password);
          const nowHashed = isHashed(cur.password);
          if (wasPlain && nowHashed) justHashedIds.push(cur.id);
        }
      }
      setFlashIds(justHashedIds);
      prevItemsRef.current = arr;
      setItems(arr);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "โหลดข้อมูลไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/signin";
      return;
    }
    getUsers(true);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => getUsers(false), 15000); // 15s
    return () => clearInterval(interval);
  }, []);

  const isHashed = (pwd) => typeof pwd === "string" && pwd.startsWith("$2"); // bcrypt marker

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime())) return d;
      return dt.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return d;
    }
  };

  async function handleDelete(id) {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "ลบผู้ใช้?",
      text: `คุณแน่ใจหรือไม่ว่าจะลบผู้ใช้ #${id}`,
      showCancelButton: true,
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
    });
    if (!isConfirmed) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Delete failed");
      await getUsers(false);
      Swal.fire("สำเร็จ", "ลบผู้ใช้เรียบร้อย", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "ลบไม่สำเร็จ", "error");
    }
  }

  async function handleEncryptAll() {
    const targets = items.filter((u) => u.password && !isHashed(u.password));
    if (targets.length === 0) {
      Swal.fire("เรียบร้อย", "ทุกบัญชีแฮชรหัสผ่านอยู่แล้ว", "info");
      return;
    }

    const { isConfirmed } = await Swal.fire({
      icon: "question",
      title: "เข้ารหัสรหัสผ่านทั้งหมด?",
      html: `มี <b>${targets.length}</b> บัญชีที่ยังเป็น plaintext<br/>ระบบจะเข้ารหัสด้วย bcrypt (saltRounds=10) และอัปเดตทีละรายการ`,
      showCancelButton: true,
      confirmButtonText: "เริ่มเข้ารหัส",
      cancelButtonText: "ยกเลิก",
    });
    if (!isConfirmed) return;

    Swal.fire({
      title: "กำลังเข้ารหัส...",
      html: '<div class="progress" style="height:10px;"><div id="encBar" class="progress-bar progress-bar-striped progress-bar-animated" style="width: 0%"></div></div>',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const saltRounds = 10;
      let ok = 0,
        fail = 0;

      for (let i = 0; i < targets.length; i++) {
        const u = targets[i];
        try {
          const hashed = bcrypt.hashSync(String(u.password), saltRounds);
          const body = {
            id: u.id,
            firstname: u.firstname ?? "",
            fullname: u.fullname ?? "",
            lastname: u.lastname ?? "",
            username: u.username ?? "",
            password: hashed,
            address: u.address ?? "",
            sex: u.sex ?? "",
            birthday: u.birthday ?? "",
          };

          const res = await fetch(API, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(body),
          });
          if (!res.ok) throw new Error("PUT failed");
          ok++;
        } catch (e) {
          console.error(e);
          fail++;
        }

        // อัปเดต progress bar
        const pct = Math.round(((i + 1) / targets.length) * 100);
        const bar = document.getElementById("encBar");
        if (bar) bar.style.width = `${pct}%`;
      }

      await getUsers(false);
      Swal.fire({
        icon: fail ? "warning" : "success",
        title: fail ? "สำเร็จบางส่วน" : "สำเร็จ",
        html: `เข้ารหัสสำเร็จ: <b>${ok}</b> รายการ<br/>ล้มเหลว: <b>${fail}</b> รายการ`,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "เกิดข้อผิดพลาดระหว่างเข้ารหัส", "error");
    }
  }

  function showHashFull(hash) {
    Swal.fire({
      title: "Password Hash (bcrypt)",
      html: `<code style="word-break:break-all;display:block;padding:8px;background:#f8f9fa;border-radius:6px">${hash}</code>`,
      showCancelButton: true,
      confirmButtonText: "คัดลอก",
      cancelButtonText: "ปิด",
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await navigator.clipboard.writeText(hash);
          Swal.fire("คัดลอกแล้ว", "คัดลอก hash ไปคลิปบอร์ดแล้ว", "success");
        } catch {
          Swal.fire("Error", "คัดลอกไม่สำเร็จ", "error");
        }
      }
    });
  }

  const renderHash = (pwd) => {
    if (!pwd) return "-";
    if (isHashed(pwd)) {
      const short = `${pwd.slice(0, 18)}…${pwd.slice(-6)}`;
      return (
        <span className="d-inline-flex align-items-center gap-2">
          <code title={pwd} className="text-success">
            {short}
          </code>
          <button
            type="button"
            className="btn btn-sm btn-outline-success btn-hash"
            onClick={() => showHashFull(pwd)}
          >
            ดูเต็ม / คัดลอก
          </button>
        </span>
      );
    }
    // plaintext → แสดงเตือน + ปุ่มเข้ารหัสเฉพาะราย
    return (
      <span className="d-inline-flex align-items-center gap-2">
        <code className="text-danger">plaintext</code>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          onClick={() => encryptOne(pwd)}
          title="เข้ารหัสรหัสผ่านนี้ทันที"
        >
          เข้ารหัส
        </button>
      </span>
    );
  };

  async function encryptOneRow(row) {
    const saltRounds = 10;
    const hashed = bcrypt.hashSync(String(row.password), saltRounds);
    const body = {
      id: row.id,
      firstname: row.firstname ?? "",
      fullname: row.fullname ?? "",
      lastname: row.lastname ?? "",
      username: row.username ?? "",
      password: hashed,
      address: row.address ?? "",
      sex: row.sex ?? "",
      birthday: row.birthday ?? "",
    };
    const res = await fetch(API, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("PUT failed");
  }

  async function encryptOne(plaintextPwd) {
    // ฟังก์ชันนี้ใช้กับกรณีไม่มี row; เราจะไม่ใช้โดยตรง
    Swal.fire("Info", "เลือกเข้ารหัสจากปุ่มในแถวแทน", "info");
  }

  async function handleEncryptOneRow(row) {
    const { isConfirmed } = await Swal.fire({
      icon: "question",
      title: `เข้ารหัสผู้ใช้ #${row.id}?`,
      showCancelButton: true,
      confirmButtonText: "เข้ารหัส",
      cancelButtonText: "ยกเลิก",
    });
    if (!isConfirmed) return;
    try {
      Swal.showLoading();
      await encryptOneRow(row);
      await getUsers(false);
      Swal.fire("สำเร็จ", "เข้ารหัสเรียบร้อย", "success");
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "เข้ารหัสไม่สำเร็จ", "error");
    }
  }

  if (loading) {
    return (
      <div className="text-center">
        <h1>Loading...</h1>
      </div>
    ); // หรือ return null เพื่อไม่ให้ render อะไร
  }

  return (
    <>
      <style jsx>{`
        /* การ์ดเฟดเข้า */
        .card-appear {
          animation: fadeInUp 500ms ease both;
        }
        /* แถวสไลด์ขึ้นแบบ stagger */
        .row-anim {
          animation: slideUp 420ms cubic-bezier(0.2, 0.6, 0.2, 1) both;
          will-change: transform, opacity;
        }
        /* ไฮไลต์เมื่อเพิ่งถูกแฮช */
        .flash {
          animation: flashBg 1500ms ease 1;
        }
        /* ปุ่ม hash hover วาร์ปนิด ๆ */
        .btn-hash {
          transition: transform 160ms ease;
        }
        .btn-hash:hover {
          transform: translateY(-1px);
        }
        /* skeleton ระหว่างโหลด */
        .skeleton {
          height: 14px;
          border-radius: 6px;
          background: linear-gradient(90deg, #eee 25%, #f6f6f6 37%, #eee 63%);
          background-size: 400% 100%;
          animation: shimmer 1.3s ease infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: 0 0;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 8px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate3d(0, 10px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes flashBg {
          0% {
            background-color: #e7f7ee;
          }
          100% {
            background-color: transparent;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .card-appear,
          .row-anim,
          .flash {
            animation: none !important;
          }
        }
      `}</style>

      <div className="container my-4">
        <div className="card shadow-sm border-0 card-appear">
          <div className="card-header d-flex flex-wrap align-items-center gap-2">
            <h5 className="m-0">Users List</h5>
            <div className="ms-auto d-flex gap-2">
              <input
                className="form-control"
                placeholder="ค้นหา ชื่อ/สกุล/ผู้ใช้/ที่อยู่/เพศ..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ minWidth: 300 }}
              />
              {selectedIds.length > 0 && (
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteSelected}
                >
                  <i className="bi bi-trash3" /> ลบผู้ใช้ที่เลือก (
                  {selectedIds.length})
                </button>
              )}
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setRefreshing(true);
                  getUsers(true);
                }}
                disabled={refreshing || loading}
              >
                {refreshing || loading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <i className="bi bi-arrow-clockwise" />
                )}{" "}
                Refresh
              </button>
              <button className="btn btn-primary" onClick={handleEncryptAll}>
                <i className="bi bi-shield-lock" /> Encrypt all plaintext
                passwords
              </button>
            </div>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="p-4">
                {/* skeleton table */}
                <div className="skeleton mb-3" />
                <div className="skeleton mb-3" />
                <div className="skeleton mb-3" />
                <div className="skeleton mb-3" />
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover table-striped align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th className="text-center" style={{ width: 40 }}>
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          aria-label="เลือกทั้งหมด"
                        />
                      </th>
                      <th className="text-center" style={{ width: 70 }}>
                        #
                      </th>
                      <th>Titlename</th>
                      <th>Firstname</th>
                      <th>Lastname</th>
                      <th>Username</th>
                      <th>Password (hashed/plain)</th>
                      <th>Address</th>
                      <th>Sex</th>
                      <th>Birthday</th>
                      <th className="text-center" style={{ width: 120 }}>
                        Edit
                      </th>
                      <th className="text-center" style={{ width: 120 }}>
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, idx) => {
                      const rowClass =
                        "row-anim " +
                        (flashIds.includes(item.id) ? "flash" : "");
                      return (
                        <tr
                          key={item.id}
                          className={rowClass}
                          style={{ animationDelay: `${idx * 40}ms` }}
                        >
                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(item.id)}
                              onChange={() => handleSelectRow(item.id)}
                              aria-label={`เลือกผู้ใช้ ${item.id}`}
                            />
                          </td>
                          <td className="text-center">{item.id}</td>
                          <td>{item.firstname}</td>
                          <td>{item.fullname}</td>
                          <td>{item.lastname}</td>
                          <td className="fw-semibold">{item.username}</td>
                          <td>
                            {isHashed(item.password) ? (
                              renderHash(item.password)
                            ) : (
                              <span className="d-inline-flex align-items-center gap-2">
                                <code className="text-danger">plaintext</code>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleEncryptOneRow(item)}
                                >
                                  เข้ารหัสทันที
                                </button>
                              </span>
                            )}
                          </td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: 260 }}
                          >
                            {item.address || "-"}
                          </td>
                          <td>
                            {item.sex ? (
                              <span className="badge bg-secondary-subtle text-dark">
                                {item.sex}
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>{formatDate(item.birthday)}</td>
                          <td className="text-center">
                            <Link
                              href={`/admin/users/edit/${item.id}`}
                              className="btn btn-sm btn-warning"
                            >
                              <i className="bi bi-pencil-square" /> Edit
                            </Link>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-danger"
                              type="button"
                              onClick={() => handleDelete(item.id)}
                            >
                              <i className="bi bi-trash3" /> Del
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {!filtered.length && (
                      <tr>
                        <td
                          colSpan={11}
                          className="text-center py-4 text-muted"
                        >
                          ไม่พบข้อมูลที่ตรงกับ “{q}”
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card-footer small text-muted d-flex flex-wrap align-items-center gap-2">
            <span>
              รวมทั้งหมด: {items.length} รายการ • แสดง: {filtered.length} รายการ
              {selectedIds.length > 0 &&
                ` • เลือกแล้ว: ${selectedIds.length} รายการ`}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
