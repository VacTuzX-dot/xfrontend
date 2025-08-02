"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import bcrypt from "bcryptjs";

export default function LoginPage() {
  const [fadeIn, setFadeIn] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.username) newErrors.username = "Username is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    setErrors({ ...errors, [name]: undefined });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      // ดึง users ทั้งหมด
      const res = await fetch("http://itdev.cmtc.ac.th:3000/api/users");
      const users = await res.json();

      // หาผู้ใช้ที่ตรง username
      const user = users.find((u) => u.username === form.username);
      if (!user) throw new Error("Username or password is incorrect");

      // 🔐 เปรียบเทียบ password แบบ hash
      const passwordMatch = await bcrypt.compare(form.password, user.password);
      if (!passwordMatch) throw new Error("Username or password is incorrect");

      // ✅ Login สำเร็จ
      Swal.fire({
        title: "Login Successful",
        text: `Welcome To Our Website ${user.fullname || user.username}!`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.href = "/about";
      });
    } catch (err) {
      const result = await Swal.fire({
        title: "Login Failed",
        text: `${err.message || "Login error occurred"}`,
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Try Again",
        cancelButtonText: "Cancel",
      });

      setSubmitting(false);

      if (!result.isConfirmed) {
        Swal.fire({
          text: "You can try again later.",
          icon: "info",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div
        className={`card shadow-lg p-4 rounded-4 border-0 animate__animated ${
          fadeIn ? "animate__fadeInDown" : ""
        }`}
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
            alt="Login"
            style={{ width: 56, marginBottom: 12, opacity: 0.85 }}
            className="animate__animated animate__bounce"
          />
          <h2 className="fw-bold mb-1 text-primary">Welcome Back!</h2>
          <p className="text-muted mb-0">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className={`form-control shadow-sm ${
                errors.username ? "is-invalid" : ""
              }`}
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              disabled={submitting}
              autoFocus
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-2">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className={`form-control shadow-sm ${
                errors.password ? "is-invalid" : ""
              }`}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              disabled={submitting}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                className="form-check-input"
                checked={form.remember}
                onChange={handleChange}
              />
              <label htmlFor="remember" className="form-check-label">
                Remember me
              </label>
            </div>
            <a
              href="/forgot-password"
              className="text-decoration-none text-primary small fw-semibold"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2"
            disabled={submitting}
            style={{
              background: "linear-gradient(90deg, #6366f1 60%, #818cf8 100%)",
              border: "none",
              boxShadow: "0 2px 8px rgba(99,102,241,0.2)",
            }}
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-4">
          <span className="text-muted">
            Don’t have an account?{" "}
            <a href="/signup" className="fw-semibold text-primary">
              Register here
            </a>
          </span>
        </div>
      </div>

      {/* Animate.css CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
    </div>
  );
}
