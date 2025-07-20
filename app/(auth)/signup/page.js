"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import Notiflix from "notiflix";

// Form field configuration
const fields = [
  { name: "firstName", label: "First Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text" },
  { name: "username", label: "Username", type: "text" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirmPassword", label: "Confirm Password", type: "password" },
];

const validateForm = (data) => {
  const errors = {};
  if (!data.prefix) errors.prefix = "Please select a title.";
  if (!data.firstName) errors.firstName = "First name is required.";
  if (!data.lastName) errors.lastName = "Last name is required.";
  if (!data.username) errors.username = "Username is required.";
  if (!data.password || data.password.length < 6)
    errors.password = "Password must be at least 6 characters.";
  if (data.confirmPassword !== data.password)
    errors.confirmPassword = "Passwords do not match.";
  if (!data.gender) errors.gender = "Please select your gender.";
  if (!data.birthdate) errors.birthdate = "Please select your birthdate.";
  if (!data.address) errors.address = "Address is required.";
  if (!data.accepted) errors.accepted = "You must accept the terms.";
  return errors;
};

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    prefix: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
    birthdate: "",
    address: "",
    accepted: false,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      setTimeout(() => {
        Notiflix.Report.success(
          "Login Successful",
          "You have successfully signed in.",
          "OK",
          () => (window.location.href = "/")
        );
      }, 1500);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <motion.div
        className="card p-5 shadow border-0 w-100"
        style={{ maxWidth: 600 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-center fw-bold mb-4">Create Your Account</h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Prefix */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Title *</label>
            <select
              name="prefix"
              value={formData.prefix}
              onChange={handleChange}
              className={`form-select ${errors.prefix ? "is-invalid" : ""}`}
            >
              <option value="">-- Select --</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Ms.">Ms.</option>
            </select>
            {errors.prefix && (
              <div className="invalid-feedback">{errors.prefix}</div>
            )}
          </div>

          {/* Form fields */}
          <div className="row g-3">
            {fields.map((field) => (
              <div className="col-md-6" key={field.name}>
                <label className="form-label fw-semibold">
                  {field.label} *
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={`form-control ${
                    errors[field.name] ? "is-invalid" : ""
                  }`}
                />
                {errors[field.name] && (
                  <div className="invalid-feedback">{errors[field.name]}</div>
                )}
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="mb-3 mt-4">
            <label className="form-label fw-semibold">Address *</label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              placeholder="Enter your full address"
            />
            {errors.address && (
              <div className="invalid-feedback">{errors.address}</div>
            )}
          </div>

          {/* Gender */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Gender *</label>
            <div>
              {["Male", "Female", "Other"].map((g) => (
                <div className="form-check form-check-inline" key={g}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">{g}</label>
                </div>
              ))}
              {errors.gender && (
                <div className="text-danger small mt-1">{errors.gender}</div>
              )}
            </div>
          </div>

          {/* Birthdate */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Birthdate *</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className={`form-control ${errors.birthdate ? "is-invalid" : ""}`}
            />
            {errors.birthdate && (
              <div className="invalid-feedback">{errors.birthdate}</div>
            )}
          </div>

          {/* Terms */}
          <div className="form-check mb-4">
            <input
              type="checkbox"
              name="accepted"
              checked={formData.accepted}
              onChange={handleChange}
              className={`form-check-input ${
                errors.accepted ? "is-invalid" : ""
              }`}
              id="termsCheckbox"
            />
            <label htmlFor="termsCheckbox" className="form-check-label">
              I agree to the Terms and Conditions *
            </label>
            {errors.accepted && (
              <div className="text-danger small">{errors.accepted}</div>
            )}
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={submitted}
          >
            {submitted ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
