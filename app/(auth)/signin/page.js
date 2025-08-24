"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

// Optimized animations with proper easing
const animations = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  },
  stagger: {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  scale: {
    hidden: { scale: 0.98, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  },
};

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const inputStyles = `
  .form-control::placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
  }
  .form-control::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
  }
  .form-control::-moz-placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
  }
  .form-control:-ms-input-placeholder {
    color: rgba(255, 255, 255, 0.7) !important;
  }
`;
  const handleForgotPassword = () => {
    Swal.fire({
      title: "ลืมรหัสผ่าน?",
      text: "กรุณาติดต่อผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่าน",
      icon: "info",
      confirmButtonText: "ตกลง",
    });
  };

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();

      if (!username.trim() || !password.trim()) {
        Swal.fire({
          title: "กรุณากรอกข้อมูล",
          text: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
          icon: "warning",
          confirmButtonText: "ตกลง",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      setLoading(true);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const res = await fetch(
          "https://backend-nextjs-virid.vercel.app/api/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        const data = await res.json();

        if (data.token) {
          // Optimistically update UI
          localStorage.setItem("token", data.token);

          // Show success message and redirect
          await Swal.fire({
            title: "เข้าสู่ระบบสำเร็จ!",
            text: `ยินดีต้อนรับ ${username}`,
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            backdrop: `
            rgba(0,123,255,0.1)
            center top
            no-repeat
          `,
          });

          router.push("/admin/users");
        } else {
          Swal.fire({
            title: "เข้าสู่ระบบล้มเหลว",
            text: data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
            icon: "error",
            confirmButtonText: "ตกลง",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        if (error.name === "AbortError") {
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "การเชื่อมต่อล้มเหลว กรุณาลองใหม่อีกครั้ง",
            icon: "error",
            confirmButtonText: "ตกลง",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: error.message || "ไม่สามารถเข้าสู่ระบบได้",
            icon: "error",
            confirmButtonText: "ตกลง",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [username, password, router]
  );

  return (
    <AnimatePresence>
      <div className="position-relative min-vh-100">
        <style dangerouslySetInnerHTML={{ __html: inputStyles }} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
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
            loading="eager"
            fetchPriority="high"
          />
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(5px)" }}
            transition={{ duration: 1 }}
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)",
            }}
          />
        </motion.div>
        <div
          className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
          style={{ position: "relative", zIndex: 1 }}
        >
          <div className="row w-100 justify-content-center">
            <div className="col-md-6 col-lg-4 col-xl-3">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={animations.fadeIn}
                className="rounded-3"
                style={{
                  background: "rgba(0,0,0,0.7)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  padding: "0",
                }}
              >
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
                      <label
                        htmlFor="username"
                        className="form-label text-light"
                      >
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
                          id="username"
                          value={username}
                          placeholder="Username"
                          onChange={(e) => setUsername(e.target.value)}
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#fff",
                          }}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                      <label
                        htmlFor="password"
                        className="form-label text-light"
                      >
                        <i className="bi bi-lock me-1"></i>
                        รหัสผ่าน
                      </label>
                      <div className="input-group ">
                        <span
                          className="input-group-text"
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            borderRight: "none",
                            color: "#fff",
                          }}
                        >
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control "
                          id="password"
                          value={password}
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#fff",
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#fff",
                          }}
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
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
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
                        <div className="col-12">
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
                    <div
                      className="card mt-3 border-0"
                      style={{ background: "rgba(255,255,255,0.1)" }}
                    >
                      <div className="card-body text-center py-2">
                        <small className="text-light">
                          <i className="bi bi-info-circle me-1"></i>
                          ยังไม่มีบัญชี?{" "}
                          <a
                            href="/signup"
                            className="text-decoration-none text-primary"
                          >
                            สมัครสมาชิก
                          </a>{" "}
                          ได้เลย
                        </small>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
