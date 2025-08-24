"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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

    const searchTerms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (searchTerms.length === 0) return items;

    const searchableFields = [
      "firstname",
      "fullname",
      "lastname",
      "username",
      "address",
      "sex",
    ];

    return items.filter((item) => {
      // Create a single searchable string from all fields
      const itemText = searchableFields
        .map((field) => item[field] || "")
        .join(" ")
        .toLowerCase();

      // Item matches if it contains all search terms
      return searchTerms.every((term) => itemText.includes(term));
    });
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

  // Optimized batch delete
  async function handleDeleteSelected() {
    if (selectedIds.length === 0) return;
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: `Delete Selected Users?`,
      html: `Are you sure you want to delete <b>${selectedIds.length}</b> items?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });
    if (!isConfirmed) return;

    const batchSize = 10; // Process 10 deletions at a time
    let ok = 0,
      fail = 0;

    // Show loading state
    Swal.fire({
      title: "Deleting...",
      html: `Progress: 0/${selectedIds.length}`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Process deletions in batches
    for (let i = 0; i < selectedIds.length; i += batchSize) {
      const batch = selectedIds.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map((id) =>
          fetch(`${API}/${id}`, {
            method: "DELETE",
            headers: { Accept: "application/json" },
          })
        )
      );

      // Count successes and failures
      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value.ok) ok++;
        else fail++;
      });

      // Update progress
      Swal.update({
        html: `Progress: ${Math.min(i + batchSize, selectedIds.length)}/${
          selectedIds.length
        }`,
      });
    }

    // Optimistically update the UI
    setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);

    // Refresh data in background
    getUsers(false);

    Swal.fire({
      icon: fail ? "warning" : "success",
      title: fail ? "Partially Completed" : "Success",
      html: `Successfully deleted: <b>${ok}</b> items<br/>Failed: <b>${fail}</b> items`,
    });
  }

  const getUsers = useCallback(async (showSpinner = true) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      if (showSpinner) setLoading(true);

      const res = await fetch(API, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];

      // Check for newly hashed passwords
      const prev = prevItemsRef.current;
      const justHashedIds = arr.reduce((ids, cur) => {
        const old = prev.find((p) => p.id === cur.id);
        if (old?.password && cur.password) {
          const wasPlain = !isHashed(old.password);
          const nowHashed = isHashed(cur.password);
          if (wasPlain && nowHashed) ids.push(cur.id);
        }
        return ids;
      }, []);

      setFlashIds(justHashedIds);
      prevItemsRef.current = arr;
      setItems((prev) => {
        // Only update if data actually changed
        if (JSON.stringify(prev) === JSON.stringify(arr)) return prev;
        return arr;
      });
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Request timed out");
      } else {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load data",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
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
      title: "Delete User?",
      text: `Are you sure you want to delete user #${id}?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });
    if (!isConfirmed) return;

    try {
      // Optimistically update UI
      setItems((prev) => prev.filter((item) => item.id !== id));

      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error("Delete failed");

      // Silently refresh data in background
      getUsers(false);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      // Restore the item if delete failed
      getUsers(false);
      Swal.fire("Error", "Delete failed", "error");
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
        /* Layout and Responsive Design */
        .container {
          min-height: calc(100vh - 2rem);
          display: flex;
          flex-direction: column;
        }

        .card {
          flex: 1;
          margin-bottom: auto;
        }

        /* Enhanced Animations */
        .card-appear {
          animation: fadeInUp 600ms cubic-bezier(0.21, 1.02, 0.73, 1) both;
        }

        .row-anim {
          animation: slideUp 500ms cubic-bezier(0.2, 0.6, 0.2, 1) both;
          will-change: transform, opacity;
          transition: background-color 0.3s ease;
        }

        .row-anim:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }

        .flash {
          animation: flashBg 2000ms cubic-bezier(0.4, 0, 0.2, 1) 1;
        }

        /* Enhanced Button Styles */
        .btn-hash {
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-hash:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Improved Loading Skeleton */
        .skeleton {
          height: 14px;
          border-radius: 6px;
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #f8f8f8 37%,
            #f0f0f0 63%
          );
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
        }

        /* Responsive Table */
        @media (max-width: 768px) {
          .table-responsive {
            margin: 0 -1rem;
          }

          .btn {
            padding: 0.375rem 0.5rem;
          }

          .form-control {
            min-width: 200px !important;
          }
        }

        /* Enhanced Animations */
        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 16px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate3d(0, 12px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes flashBg {
          0% {
            background-color: rgba(25, 135, 84, 0.1);
          }
          50% {
            background-color: rgba(25, 135, 84, 0.05);
          }
          100% {
            background-color: transparent;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .card-appear,
          .row-anim,
          .flash,
          .btn-hash {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="container my-4">
        <div className="card shadow border-0 card-appear">
          <div className="card-header bg-white d-flex flex-wrap align-items-center gap-3 py-3">
            <h5 className="m-0 text-primary fw-bold">Users List</h5>
            <div className="ms-auto d-flex flex-wrap gap-2">
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
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr className="bg-primary bg-opacity-10 text-dark">
                      <th className="text-center py-3" style={{ width: 40 }}>
                        <input
                          type="checkbox"
                          className="form-check-input"
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

          <div className="card-footer bg-light border-top-0 small text-muted d-flex flex-wrap align-items-center gap-2 py-3">
            <span className="ms-2">
              <i className="bi bi-info-circle me-1"></i>
              Total: {items.length} items • Showing: {filtered.length} items
              {selectedIds.length > 0 &&
                ` • Selected: ${selectedIds.length} items`}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
