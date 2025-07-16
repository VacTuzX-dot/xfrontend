"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SignInPage() {
  const [fadeIn, setFadeIn] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on mount
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      alert("Signed in!");
    }, 1000);
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center ">
      <div
        className={`card shadow-lg p-4 rounded-4 border-0 animate__animated ${
          fadeIn ? "animate__fadeInDown" : ""
        }`}
        style={{
          maxWidth: "400px",
          width: "100%",
         
        }}
      >
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
            alt="Sign In"
            style={{ width: 56, marginBottom: 12, opacity: 0.85 }}
            className="animate__animated animate__bounce"
          />
          <h2 className="fw-bold mb-1" style={{ color: "#6366f1" }}>
            Welcome Back!
          </h2>
          <p className="text-muted mb-0">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className={`form-control shadow-sm ${
                errors.email ? "is-invalid" : ""
              }`}
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              disabled={submitting}
              required
              autoFocus
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          <div className="mb-3">
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
              required
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2"
            disabled={submitting}
            style={{
              background: "linear-gradient(90deg, #6366f1 60%, #818cf8 100%)",
              border: "none",
              boxShadow: "0 2px 8px rgba(99,102,241,0.15)",
            }}
          >
            {submitting ? (
              <span>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <div className="text-center mt-3">
          <span className="text-muted">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="fw-semibold"
              style={{ color: "#6366f1" }}
            >
              Sign up
            </a>
          </span>
        </div>
      </div>
      {/* Animate.css CDN for quick animation */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
    </div>
  );
}
