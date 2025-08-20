"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";

export default function Page() {
  const router = useRouter();
  const { id } = useParams();

  // form states
  const [firstname, setFirstname] = useState("");
  const [fullname, setFullname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [sex, setSex] = useState("");
  const [birthday, setBirthday] = useState("");

  // password UX: ไม่โชว์ของเดิม; กรอกเฉพาะ "รหัสผ่านใหม่"
  const [newPassword, setNewPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  // meta states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // เก็บค่า user ที่ดึงมา (รวมถึง password เดิม แต่ไม่โชว์ใน UI)
  const [originalUser, setOriginalUser] = useState(null);

  const API_BASE = "https://backend-nextjs-virid.vercel.app/api/users";

  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const user = Array.isArray(data) ? data[0] : data;

        if (!user) {
          await Swal.fire("ไม่พบผู้ใช้", "ID นี้ไม่มีข้อมูล", "warning");
          router.push("/admin/users");
          return;
        }

        setOriginalUser(user); // มี password เดิมเก็บไว้ในหน่วยความจำเท่านั้น
        setFirstname(user.firstname || "");
        setFullname(user.fullname || "");
        setLastname(user.lastname || "");
        setUsername(user.username || "");
        setAddress(user.address || "");
        setSex(user.sex || "");
        setBirthday(user.birthday || "");
        setNewPassword(""); // ช่องกรอกรหัสใหม่เริ่มว่างเสมอ
      } catch (e) {
        console.error(e);
        Swal.fire("Error", "โหลดข้อมูลไม่สำเร็จ", "error");
      } finally {
        setLoading(false);
      }
    }
    getUser();
  }, [id]);

  // ตรวจว่าข้อความดูเหมือน bcrypt อยู่แล้วไหม (กันกรณีวางแฮชมา)
  const looksHashed = (s) => typeof s === "string" && s.startsWith("$2");

  const pwdStrength = useMemo(() => {
    const p = newPassword || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; // 0..5
  }, [newPassword]);

  const strengthLabel = ["อ่อนมาก", "อ่อน", "พอใช้", "ดี", "แข็งแรง", "โหดมาก"][
    pwdStrength
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!originalUser) return;

    // confirm ก่อนเซฟ
    const { isConfirmed } = await Swal.fire({
      title: "ยืนยันการบันทึก?",
      icon: "question",
      html: `
        ระบบจะอัปเดตข้อมูลผู้ใช้ #${originalUser.id}${
        newPassword
          ? "<br/><b>และแฮชรหัสผ่านใหม่ด้วย bcrypt</b>"
          : "<br/><i>รหัสผ่านเดิมจะถูกคงไว้ (ไม่ได้แฮชใหม่)</i>"
      }
      `,
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
    });
    if (!isConfirmed) return;

    try {
      setSaving(true);

      let passwordToSend = originalUser.password || "";
      if (newPassword.trim()) {
        // ถ้าผู้ใช้กรอกใหม่:
        if (looksHashed(newPassword.trim())) {
          // วางแฮชมาแล้วก็ส่งต่อได้เลย (ไม่แฮชซ้ำ)
          passwordToSend = newPassword.trim();
        } else {
          // แฮชใหม่
          const saltRounds = 10;
          passwordToSend = bcrypt.hashSync(newPassword.trim(), saltRounds);
        }
      } // ไม่กรอกใหม่ => ใช้ของเดิม

      const body = {
        id: originalUser.id,
        firstname,
        fullname,
        lastname,
        username,
        password: passwordToSend,
        address,
        sex,
        birthday,
      };

      const res = await fetch(API_BASE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Update failed");
      await Swal.fire({
        icon: "success",
        title: "ปรับปรุงข้อมูลเรียบร้อย",
        timer: 1600,
        showConfirmButton: false,
      });
      router.push("/admin/users");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "เกิดข้อผิดพลาดระหว่างบันทึก", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 d-flex justify-content-center">
        <div className="spinner-border me-2" role="status" />
        <span>กำลังโหลดข้อมูล…</span>
      </div>
    );
  }

  return (
    <div className="container my-4" style={{ maxWidth: 720 }}>
      <div className="card shadow-sm border-0">
        <div className="card-header d-flex align-items-center">
          <h5 className="m-0">แก้ไขข้อมูลสมาชิก #{originalUser?.id}</h5>
          <div className="ms-auto small text-muted">
            (ไม่ต้องกรอกรหัสผ่าน หากไม่ต้องการเปลี่ยน)
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">คำนำหน้า</label>
                <select
                  className="form-select"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                >
                  <option value="">เลือกคำนำหน้า</option>
                  <option value="นาย">นาย</option>
                  <option value="นาง">นาง</option>
                  <option value="นางสาว">นางสาว</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">ชื่อ</label>
                <input
                  type="text"
                  className="form-control"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">นามสกุล</label>
                <input
                  type="text"
                  className="form-control"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  รหัสผ่านใหม่ <span className="text-muted">(ไม่บังคับ)</span>
                </label>
                <div className="input-group">
                  <input
                    type={showPwd ? "text" : "password"}
                    className="form-control"
                    placeholder="ปล่อยว่างเพื่อคงรหัสเดิม"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary text-danger"
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                  >
                    {showPwd ? "ซ่อน" : "แสดง"}
                  </button>
                </div>
                {/* password strength meter */}
                {newPassword && (
                  <div className="form-text">
                    ความแข็งแรงรหัสผ่าน: <b>{strengthLabel}</b>
                  </div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label">ที่อยู่</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">เพศ</label>
                <select
                  className="form-select"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  required
                >
                  <option value="">เลือกเพศ</option>
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">วันเกิด</label>
                <input
                  type="date"
                  className="form-control"
                  value={birthday || ""}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card-footer d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => router.push("/admin/users")}
              disabled={saving}
            >
              ย้อนกลับ
            </button>
            <button
              type="submit"
              className="btn btn-primary ms-auto"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  กำลังบันทึก…
                </>
              ) : (
                "บันทึกการเปลี่ยนแปลง"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="text-muted small mt-3">
        * ระบบจะ <b>แฮชรหัสผ่านด้วย bcrypt</b>{" "}
        ก่อนส่งไปยังเซิร์ฟเวอร์เสมอเมื่อกรอกรหัสใหม่
      </div>
    </div>
  );
}
