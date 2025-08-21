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

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          action: "login",
        }),
      });

      if (response.ok) {
        await response.json();

        // Store user data if remember me is checked
        if (formData.rememberMe) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: formData.username,
              rememberMe: true,
            })
          );
        } else {
          sessionStorage.setItem(
            "user",
            JSON.stringify({
              username: formData.username,
              rememberMe: false,
            })
          );
        }

        await Swal.fire({
          title: "เข้าสู่ระบบสำเร็จ!",
          text: `ยินดีต้อนรับ ${formData.username}`,
          icon: "success",
          confirmButtonText: "ตกลง",
          timer: 2000,
          timerProgressBar: true,
        });

        router.push("/");
      } else if (response.status === 404) {
        await Swal.fire({
          title: "ไม่พบผู้ใช้!",
          text: "กรุณาสมัครสมาชิกก่อนเข้าสู่ระบบ",
          icon: "warning",
          confirmButtonText: "ไปสมัครสมาชิก",
        });
        router.push("/signup");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        title: "เข้าสู่ระบบไม่สำเร็จ!",
        text: error.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Swal.fire({
      title: "ลืมรหัสผ่าน?",
      text: "กรุณาติดต่อผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่าน",
      icon: "info",
      confirmButtonText: "ตกลง",
    });
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "https://backend-nextjs-virid.vercel.app/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    const data = await res.json();
    console.log(username);

    if (data.token) {
      localStorage.setItem("token", data.token);
      await Swal.fire({
        title: "เข้าสู่ระบบสำเร็จ!",
        text: `ยินดีต้อนรับ ${username}`,
        icon: "success",
        confirmButtonText: "ตกลง",
        timer: 2000,
        timerProgressBar: true,
      });
      window.location.href = "/admin/users";
    } else {
      // Show error if username or password is incorrect
      Swal.fire({
        title: "เข้าสู่ระบบไม่สำเร็จ!",
        text: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
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
          }}
        />
      </div>

      <div
        className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className="row w-100 justify-content-center">
          <div className="col-md-6 col-lg-4 col-xl-3">
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
              }}
            />
            <div className="text-center py-4 border-bottom border-light border-opacity-10">
              <motion.h3
                className="mb-0 text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                เข้าสู่ระบบ
              </motion.h3>
            </div>
            <div className="p-4">
              <form onSubmit={handleLogin}>
                {/* Username */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label text-light">
                    <i className="bi bi-person me-1"></i>
                    ชื่อผู้ใช้
                  </label>
                  <div className="input-group">
                    <span
                      className="input-group-text"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRight: "none",
                        color: "#fff",
                      }}
                    >
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="formGroupExampleInput"
                      defaultValue={username}
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label text-light">
                    <i className="bi bi-lock me-1 "></i>
                    รหัสผ่าน
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="formGroupExampleInput2"
                      defaultValue={password}
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`bi ${
                          showPassword ? "bi-eye-slash" : "bi-eye"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <label
                      className="form-check-label text-light"
                      htmlFor="rememberMe"
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      จำฉันไว้
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-grid mb-3">
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
                        กำลังเข้าสู่ระบบ...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        เข้าสู่ระบบ
                      </>
                    )}
                  </button>
                </div>

                {/* Links */}
                <div className="text-center">
                  <div className="row">
                    <div className="col-6">
                      <a
                        href="/signup"
                        className="text-decoration-none text-primary"
                      >
                        <i className="bi bi-person-plus me-1"></i>
                        สมัครสมาชิก
                      </a>
                    </div>
                    <div className="col-6">
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none text-primary p-0"
                        onClick={handleForgotPassword}
                      >
                        <i className="bi bi-question-circle me-1"></i>
                        ลืมรหัสผ่าน
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card mt-3 border-0 ">
                  <div className="card-body text-center py-2">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      ยังไม่มีบัญชี?{" "}
                      <a href="/signup" className="text-decoration-none">
                        สมัครสมาชิก
                      </a>{" "}
                      ได้เลย
                    </small>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
