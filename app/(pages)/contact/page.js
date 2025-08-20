"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    hp: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // simple honeypot (bots will fill hidden field)
    if (form.hp) return;

    // basic validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!form.email || !emailOk || !form.message.trim()) {
      Swal.fire({
        icon: "error",
        title: "ข้อมูลไม่ครบ",
        text: "กรอกอีเมลให้ถูกต้องและใส่ข้อความก่อนส่งนะ",
        confirmButtonText: "โอเค",
        background: "#212529",
        color: "#fff",
      });
      return;
    }

    try {
      setLoading(true);
      const subject = encodeURIComponent("Contact via website");
      const body = encodeURIComponent(
        `Name: ${form.name || "-"}\nEmail: ${form.email}\n\n${form.message}`
      );
      // Use user's mail client (fallback while no API)
      window.location.href = `mailto:taweesaknumma@gmail.com?subject=${subject}&body=${body}`;

      await Swal.fire({
        icon: "success",
        title: "เปิดแอปอีเมลให้แล้ว",
        text: "ถ้าไม่ขึ้น ลองเช็ค default mail app บนเครื่อง",
        timer: 2200,
        showConfirmButton: false,
        background: "#212529",
        color: "#fff",
      });

      setForm({ name: "", email: "", message: "", hp: "" });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "ส่งไม่สำเร็จ",
        text: "เกิดข้อผิดพลาด ลองใหม่อีกครั้ง",
        confirmButtonText: "ลองใหม่",
        background: "#212529",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container className="py-5 min-vh-100 d-flex align-items-center">
        <Row className="g-4 w-100 align-items-stretch">
          <Col md={6}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="p-4 border rounded-3 shadow-sm "
            >
              <motion.h3
                variants={fadeIn}
                className="mb-3 text-center fw-semibold"
              >
                Contact Us
              </motion.h3>
              <Form onSubmit={handleSubmit} noValidate>
                {/* Honeypot */}
                <Form.Group className="d-none" controlId="hp">
                  <Form.Control
                    type="text"
                    name="hp"
                    value={form.hp}
                    onChange={handleChange}
                    autoComplete="off"
                    tabIndex={-1}
                  />
                </Form.Group>

                <motion.div variants={fadeIn}>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label className="form-label">Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Your name (optional)"
                      className="rounded-3"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="form-label">Email *</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className="rounded-3"
                      value={form.email}
                      onChange={handleChange}
                      required
                      aria-required="true"
                    />
                  </Form.Group>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <Form.Group className="mb-3" controlId="message">
                    <Form.Label className="form-label">Message *</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      rows={4}
                      placeholder="How can we help?"
                      className="rounded-3"
                      value={form.message}
                      onChange={handleChange}
                      required
                      aria-required="true"
                    />
                    <div className="form-text">* จำเป็นต้องกรอก</div>
                  </Form.Group>
                </motion.div>

                <motion.div variants={fadeIn} className="d-grid">
                  <Button
                    variant="success"
                    type="submit"
                    className="rounded-3"
                    disabled={loading}
                  >
                    {loading ? "Sending…" : "Send"}
                  </Button>
                </motion.div>
              </Form>

              <motion.div
                variants={fadeIn}
                className="mt-3 small text-muted text-center"
              >
                เราจะตอบกลับผ่านอีเมลของคุณ — ไม่มีสแปม ไม่มีขายข้อมูล
              </motion.div>
            </motion.div>
          </Col>

          <Col md={6} className="d-flex">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.15 }}
              className="rounded-3 overflow-hidden shadow-sm w-100"
            >
              <div className="w-100 h-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.4953151955156!2d98.98856357540366!3d18.77606698236774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3b331f2eb293%3A0x91851cae07abc620!2z4LiqLuC4reC4tOC5gOC4peC5h-C4geC4l-C4o-C4reC4meC4tOC4geC4quC5jA!5e0!3m2!1sen!2sth!4v1752639767781!5m2!1sen!2sth"
                  loading="lazy"
                  style={{ border: 0 }}
                  className="w-100 h-100"
                  allowFullScreen={true}
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map"
                ></iframe>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
