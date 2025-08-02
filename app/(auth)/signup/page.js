"use client";
import React, { useState, useCallback, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

// Form configuration
const FORM_FIELDS = [
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "lastName", label: "Last Name", type: "text", required: true },
  { name: "username", label: "Username", type: "text", required: true },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    minLength: 6,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    required: true,
  },
];

const PREFIX_OPTIONS = ["Mr", "Mrs", "Ms"];
const GENDER_OPTIONS = ["Male", "Female", "Other"];

// Optimized validation
const validateField = (name, value, formData) => {
  switch (name) {
    case "prefix":
      return !value ? "Please select a title." : "";
    case "firstName":
    case "lastName":
    case "username":
    case "address":
      return !value
        ? `${name.replace(/([A-Z])/g, " $1").toLowerCase()} is required.`
        : "";
    case "password":
      return !value || value.length < 6
        ? "Password must be at least 6 characters."
        : "";
    case "confirmPassword":
      return value !== formData.password ? "Passwords do not match." : "";
    case "gender":
      return !value ? "Please select your gender." : "";
    case "birthdate":
      return !value ? "Please select your birthdate." : "";
    case "accepted":
      return !value ? "You must accept the terms." : "";
    default:
      return "";
  }
};

// Format date helper
const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${parseInt(year) + 543}`;
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

  // Optimized change handler with validation
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setFormData((prev) => ({ ...prev, [name]: newValue }));

      // Real-time validation
      if (errors[name]) {
        const error = validateField(name, newValue, {
          ...formData,
          [name]: newValue,
        });
        setErrors((prev) => ({ ...prev, [name]: error || undefined }));
      }
    },
    [errors, formData]
  );

  // Memoized validation
  const validationErrors = useMemo(() => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key], formData);
      if (error) errors[key] = error;
    });
    return errors;
  }, [formData]);

  // Optimized submit handler
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length === 0) {
        setSubmitted(true);

        const payload = {
          id: Date.now(),
          firstname: formData.prefix,
          fullname: `${formData.firstName} ${formData.lastName}`,
          lastname: formData.lastName,
          username: formData.username,
          password: formData.password,
          address: formData.address,
          sex: formData.gender.toLowerCase(),
          birthday: formatDate(formData.birthdate),
        };

        try {
          const response = await fetch(
            "http://itdev.cmtc.ac.th:3000/api/users",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          if (!response.ok) throw new Error("Signup failed. Please try again.");

          Swal.fire({
            title: "Signup Successful",
            text: "Your account has been created.",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            window.location.href = "/signin";
          });
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            confirmButtonText: "OK",
          });
          setSubmitted(false);
        }
      }
    },
    [formData, validationErrors]
  );

  // Memoized form components
  const FormField = React.memo(({ field, value, error, onChange }) => (
    <div className="col-md-6">
      <label className="form-label fw-semibold text-dark">
        <i className={`bi bi-${getFieldIcon(field.name)} me-2`}></i>
        {field.label} *
      </label>
      <input
        type={field.type}
        name={field.name}
        value={value}
        onChange={onChange}
        className={`form-control ${error ? "is-invalid" : ""}`}
        style={{ borderRadius: '8px' }}
        placeholder={`Enter your ${field.label.toLowerCase()}`}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  ));

  // Helper function for field icons
  const getFieldIcon = (fieldName) => {
    const iconMap = {
      firstName: 'person',
      lastName: 'person',
      username: 'person-circle',
      password: 'lock',
      confirmPassword: 'lock-fill'
    };
    return iconMap[fieldName] || 'pencil';
  };

  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <motion.div
              className="card shadow-sm border-0"
              style={{ 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="card-body p-4 p-md-5"></div>
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">Create Your Account</h2>
                  <p className="text-muted">Join us today and get started</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Title */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-person-badge me-2"></i>Title *
                    </label>
                    <select
                      name="prefix"
                      value={formData.prefix}
                      onChange={handleChange}
                      className={`form-select ${errors.prefix ? "is-invalid" : ""}`}
                      style={{ borderRadius: '8px' }}
                    >
                      <option value="">-- Select Title --</option>
                      {PREFIX_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.prefix && (
                      <div className="invalid-feedback">{errors.prefix}</div>
                    )}
                  </div>

                  {/* Form fields */}
                  <div className="row g-3 mb-3">
                    {FORM_FIELDS.map((field) => (
                      <FormField
                        key={field.name}
                        field={field}
                        value={formData[field.name]}
                        error={errors[field.name]}
                        onChange={handleChange}
                      />
                    ))}
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-geo-alt me-2"></i>Address *
                    </label>
                    <textarea
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      className={`form-control ${errors.address ? "is-invalid" : ""}`}
                      style={{ borderRadius: '8px', resize: 'vertical' }}
                      placeholder="Enter your full address"
                    />
                    {errors.address && (
                      <div className="invalid-feedback">{errors.address}</div>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-gender-ambiguous me-2"></i>Gender *
                    </label>
                    <div className="d-flex gap-4 mt-2">
                      {GENDER_OPTIONS.map((gender) => (
                        <div className="form-check" key={gender}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={handleChange}
                            id={`gender-${gender}`}
                          />
                          <label className="form-check-label" htmlFor={`gender-${gender}`}>
                            {gender}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.gender && (
                      <div className="text-danger small mt-1">{errors.gender}</div>
                    )}
                  </div>

                  {/* Birthdate */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">
                      <i className="bi bi-calendar-date me-2"></i>Birthdate *
                    </label>
                    <input
                      type="date"
                      name="birthdate"
                      value={formData.birthdate}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.birthdate ? "is-invalid" : ""
                      }`}
                      style={{ borderRadius: '8px' }}
                    />
                    {errors.birthdate && (
                      <div className="invalid-feedback">{errors.birthdate}</div>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="form-check mb-4 p-3 bg-light rounded" style={{ borderRadius: '8px' }}>
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
                      <i className="bi bi-shield-check me-2"></i>
                      I agree to the <a href="#" className="text-primary">Terms and Conditions</a> *
                    </label>
                    {errors.accepted && (
                      <div className="text-danger small mt-1">{errors.accepted}</div>
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
    </>
  );
}
