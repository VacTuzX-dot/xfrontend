"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion, AnimatePresence } from "framer-motion";

const fields = [
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "lastName", label: "Last Name", type: "text", required: true },
  { name: "username", label: "Username", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone Number", type: "tel", required: false },
  { name: "password", label: "Password", type: "password", required: true },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    required: true,
  },
];

const validateForm = (formData) => {
  const errors = {};

  // First Name
  if (!formData.firstName.trim()) {
    errors.firstName = "First name is required";
  }

  // Last Name
  if (!formData.lastName.trim()) {
    errors.lastName = "Last name is required";
  }

  // Username
  if (!formData.username.trim()) {
    errors.username = "Username is required";
  } else if (formData.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  // Email
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
    errors.email = "Invalid email address";
  }

  // Phone (optional, but validate if present)
  if (formData.phone && !/^\+?\d{7,15}$/.test(formData.phone)) {
    errors.phone = "Invalid phone number";
  }

  // Password
  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // Confirm Password
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        // Redirect or show success message here
      }, 1500);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center ">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="card shadow-lg p-4 border-0"
        style={{ maxWidth: "480px", width: "100%" }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-4 fw-bold"
        >
          Create Your Account
        </motion.h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3 mb-3">
            {fields.slice(0, 2).map((field, idx) => (
              <div className="col-md-6" key={field.name}>
                <label className="form-label">
                  {field.label}
                  {field.required && (
                    <span className="text-danger ms-1">*</span>
                  )}
                  {!field.required && (
                    <span className="text-muted ms-1">(optional)</span>
                  )}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  className={`form-control ${
                    errors[field.name] ? "is-invalid" : ""
                  }`}
                  placeholder={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                />
                <AnimatePresence>
                  {errors[field.name] && (
                    <motion.div
                      className="invalid-feedback"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      {errors[field.name]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
          {fields.slice(2).map((field) => (
            <div className="mb-3" key={field.name}>
              <label className="form-label">
                {field.label}
                {field.required && <span className="text-danger ms-1">*</span>}
                {!field.required && (
                  <span className="text-muted ms-1">(optional)</span>
                )}
              </label>
              <input
                type={field.type}
                name={field.name}
                className={`form-control ${
                  errors[field.name] ? "is-invalid" : ""
                }`}
                placeholder={
                  field.required ? field.label : `${field.label} (optional)`
                }
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
              />
              <AnimatePresence>
                {errors[field.name] && (
                  <motion.div
                    className="invalid-feedback"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                  >
                    {errors[field.name]}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary w-100 fw-bold"
            type="submit"
            disabled={submitted}
          >
            {submitted ? (
              <span>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing Up...
              </span>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-4"
        >
          <p className="text-muted mb-1">Already have an account?</p>
          <a href="/signin" className="text-decoration-none fw-semibold">
            Sign In
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
