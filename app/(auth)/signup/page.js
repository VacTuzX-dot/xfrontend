"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstname: "",
    fullname: "",
    lastname: "",
    address: "",
    sex: "",
    birthday: "",
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      Swal.fire("Error", "กรุณากรอกชื่อผู้ใช้", "error");
      return false;
    }
    if (!formData.password.trim()) {
      Swal.fire("Error", "กรุณากรอกรหัสผ่าน", "error");
      return false;
    }
    if (formData.password.length < 6) {
      Swal.fire("Error", "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", "error");
      return false;
    }
    if (!formData.firstname) {
      Swal.fire("Error", "กรุณาเลือกคำนำหน้าชื่อ", "error");
      return false;
    }
    if (!formData.fullname.trim()) {
      Swal.fire("Error", "กรุณากรอกชื่อ", "error");
      return false;
    }
    if (!formData.lastname.trim()) {
      Swal.fire("Error", "กรุณากรอกนามสกุล", "error");
      return false;
    }
    if (!formData.address.trim()) {
      Swal.fire("Error", "กรุณากรอกที่อยู่", "error");
      return false;
    }
    if (!formData.sex) {
      Swal.fire("Error", "กรุณาเลือกเพศ", "error");
      return false;
    }
    if (!formData.birthday) {
      Swal.fire("Error", "กรุณาเลือกวันเกิด", "error");
      return false;
    }
    if (!formData.acceptTerms) {
      Swal.fire("Error", "กรุณายอมรับเงื่อนไขการใช้งาน", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        await Swal.fire({
          fullname: "สำเร็จ!",
          text: "ลงทะเบียนเรียบร้อยแล้ว",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        router.push("/signin");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        fullname: "ข้อผิดพลาด!",
        text: error.message || "เกิดข้อผิดพลาดในการลงทะเบียน",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="position-relative min-vh-100">
      {/* Background Image */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          zIndex: -1,
          backgroundColor: "#0a0a0a",
        }}
      >
        <img
          src="/images/bg.png"
          alt="Background"
          className="w-100 h-100"
          style={{
            objectFit: "cover",
            opacity: 0.6,
          }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)",
            backdropFilter: "blur(5px)",
            opacity: 0.2,
          }}
        />
      </div>
      <div
        className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="row w-100 justify-content-center">
          <div className="col-md-8 col-lg-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="rounded-3"
              style={{
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                opacity: 0.3,
              }}
            >
              <div className="text-center py-4 border-bottom border-light border-opacity-10">
                <motion.h3
                  className="mb-0 text-light"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <i className="bi bi-person-plus me-2"></i>
                  ลงทะเบียน
                </motion.h3>
              </div>
              <div className="p-4 text-light">
                <form onSubmit={handleSubmit}>
                  {/* Username and Password Row */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="username" className="form-label">
                        <i className="bi bi-person me-1"></i>
                        ชื่อผู้ใช้ *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="กรอกชื่อผู้ใช้"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="password" className="form-label">
                        <i className="bi bi-lock me-1"></i>
                        รหัสผ่าน *
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="กรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                        required
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-3">
                    <label htmlFor="firstname" className="form-label">
                      <i className="bi bi-person-badge me-1"></i>
                      คำนำหน้าชื่อ *
                    </label>
                    <select
                      className="form-select"
                      id="firstname"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">เลือกคำนำหน้าชื่อ</option>
                      <option value="นาย">นาย</option>
                      <option value="นาง">นาง</option>
                      <option value="นางสาว">นางสาว</option>
                    </select>
                  </div>

                  {/* First Name and Last Name Row */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="fullname" className="form-label">
                        <i className="bi bi-person me-1"></i>
                        ชื่อ *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullname"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleInputChange}
                        placeholder="กรอกชื่อ"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="lastName" className="form-label">
                        <i className="bi bi-person me-1"></i>
                        นามสกุล *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastname"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleInputChange}
                        placeholder="กรอกนามสกุล"
                        required
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      <i className="bi bi-geo-alt me-1"></i>
                      ที่อยู่ *
                    </label>
                    <textarea
                      className="form-control"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="กรอกที่อยู่"
                      rows="2"
                      required
                    ></textarea>
                  </div>

                  {/* Gender and Birth Date Row */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        <i className="bi bi-gender-ambiguous me-1"></i>
                        เพศ *
                      </label>
                      <div className="d-flex gap-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="sex"
                            id="male"
                            value="ชาย"
                            checked={formData.sex === "ชาย"}
                            onChange={handleInputChange}
                            required
                          />
                          <label className="form-check-label" htmlFor="male">
                            ชาย
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="sex"
                            id="female"
                            value="หญิง"
                            checked={formData.sex === "หญิง"}
                            onChange={handleInputChange}
                            required
                          />
                          <label className="form-check-label" htmlFor="female">
                            หญิง
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="birthDate" className="form-label">
                        <i className="bi bi-calendar me-1 "></i>
                        วันเกิด *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="birthday"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        required
                      />
                      <style jsx>{`
                        #birthday::-webkit-calendar-picker-indicator {
                          filter: invert(1);
                        }
                        #birthday {
                          color-scheme: dark;
                        }
                      `}</style>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="acceptTerms"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        required
                      />
                      <label className="form-check-label" htmlFor="acceptTerms">
                        ฉันยอมรับ{" "}
                        <a href="#" className="text-decoration-none">
                          เงื่อนไขการใช้งาน
                        </a>{" "}
                        และ{" "}
                        <a href="#" className="text-decoration-none">
                          นโยบายความเป็นส่วนตัว
                        </a>{" "}
                        *
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          กำลังลงทะเบียน...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          ลงทะเบียน
                        </>
                      )}
                    </button>
                  </div>

                  {/* Login Link */}
                  <div className="text-center mt-3">
                    <p className="mb-0">
                      มีบัญชีอยู่แล้ว?{" "}
                      <a href="/signin" className="text-decoration-none">
                        เข้าสู่ระบบ
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}
