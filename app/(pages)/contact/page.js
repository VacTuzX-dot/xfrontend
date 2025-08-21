"use client";
import { useState, useCallback, useMemo } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const isEmailValid = useMemo(() => {
    return EMAIL_REGEX.test(form.email);
  }, [form.email]);

  // Memoize form validation (explicit booleans)
  const isFormValid = useMemo(() => {
    return (
      Boolean(form.email) && isEmailValid && form.message.trim().length > 0
    );
  }, [form.email, isEmailValid, form.message]);

  // Memoize change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear any previous errors
    setSent(false);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      // Submit the form when pressing Ctrl/Cmd + Enter
      e.currentTarget.form?.requestSubmit();
    }
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      if (!isFormValid) {
        setError("Please fill in all required fields correctly.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const subject = encodeURIComponent("Contact via website");
        const body = encodeURIComponent(
          `Name: ${form.name || "-"}\nEmail: ${form.email}\n\n${form.message}`
        );

        // Using a more reliable way to handle mailto links
        const mailtoLink = document.createElement("a");
        mailtoLink.href = `mailto:taweesaknumma@gmail.com?subject=${subject}&body=${body}`;
        mailtoLink.click();
        setSent(true);

        // Reset form after successful submission
        setForm({ name: "", email: "", message: "" });
      } catch (err) {
        console.error("Contact form error:", err);
        setError("Failed to send message. Please try again.");
        setSent(false);
      } finally {
        setLoading(false);
      }
    },
    [form, loading, isFormValid]
  );

  return (
    <div className="position-relative min-vh-100">
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          zIndex: -99,
          transform: "translate3d(0,0,0)",
          backfaceVisibility: "hidden",
        }}
      >
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src="/images/bg.png"
            alt="Background"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </motion.div>
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)",
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
          }}
        />
      </div>
      <Container className="py-5 position-relative">
        <div className="contact-card mx-auto p-4 p-md-5 rounded-4 shadow-lg">
          <motion.h2
            className="mb-4 text-center fw-semibold"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Contact Us
          </motion.h2>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="alert alert-danger mb-3"
                role="alert"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {sent && !error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="alert alert-success mb-3"
                role="status"
                aria-live="polite"
              >
                Your message is ready in your email client. You can edit and
                send it now.
              </motion.div>
            )}
          </AnimatePresence>

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your name (optional)"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                autoComplete="name"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s ease",
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Your email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
                isInvalid={form.email.length > 0 && !isEmailValid}
                autoComplete="email"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s ease",
                }}
              />
              {form.email && !isEmailValid && (
                <Form.Text className="text-danger small">
                  Please enter a valid email address
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-dark">Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Your message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                disabled={loading}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  transition: "all 0.2s ease",
                }}
              />
            </Form.Group>

            <motion.div
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <Button
                type="submit"
                variant="dark"
                disabled={loading || !isFormValid}
                className="w-100 position-relative btn-gradient"
              >
                {loading ? (
                  <span className="d-flex align-items-center justify-content-center">
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    />
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </Button>
            </motion.div>
          </Form>

          <div className="mt-4">
            <div
              style={{
                position: "relative",
                height: "300px",
                transform: "translate3d(0,0,0)",
                backfaceVisibility: "hidden",
                willChange: "transform",
              }}
              className="rounded shadow overflow-hidden map-wrap"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.4953151955156!2d98.98856357540366!3d18.77606698236774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3b331f2eb293%3A0x91851cae07abc620!2z4LiqLuC4reC4tOC5gOC4peC5h-C4geC4l-C4o-C4reC4meC4tOC4geC4quC5jA!5e0!3m2!1sen!2sth!4v1752639767781!5m2!1sen!2sth"
                loading="lazy"
                className="w-100 h-100"
                style={{
                  border: 0,
                  transform: "translate3d(0,0,0)",
                  backfaceVisibility: "hidden",
                }}
                allowFullScreen={true}
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
            </div>
          </div>
        </div>
      </Container>
      <style jsx>{`
        .contact-card {
          max-width: 720px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(0, 0, 0, 0.7);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        :global(.form-control) {
          transition: box-shadow 0.2s ease, border-color 0.2s ease,
            transform 0.1s ease;
        }
        :global(.form-control:focus) {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
          border-color: rgba(13, 110, 253, 0.5);
        }
        :global(label.text-dark) {
          font-weight: 500;
        }
        .btn-gradient {
          background: linear-gradient(135deg, #111 0%, #333 100%);
          border: 0;
        }
        .btn-gradient:disabled {
          opacity: 0.8;
        }
        .map-wrap {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .map-wrap:hover {
          transform: translateZ(0) scale(1.01);
          box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.15);
        }
        @media (max-width: 576px) {
          .contact-card {
            padding: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  );
}
