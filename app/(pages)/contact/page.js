"use client";
import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ContactPage() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center align-items-center">
        <Col md={6}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="p-4 border rounded  shadow-sm"
          >
            <h3 className="mb-4 text-center fw-semibold">Contact Us</h3>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  className="rounded-3"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  className="rounded-3"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Message"
                  className="rounded-3"
                />
              </Form.Group>
              <div className="d-grid">
                <Button variant="dark" type="submit" className="rounded-3">
                  Send
                </Button>
              </div>
            </Form>
          </motion.div>
        </Col>
        <Col md={6} className="d-none d-md-block">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="rounded overflow-hidden shadow-sm"
            style={{ width: "100%", height: "400px" }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.4953151955156!2d98.98856357540366!3d18.77606698236774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3b331f2eb293%3A0x91851cae07abc620!2z4LiqLuC4reC4tOC5gOC4peC5h-C4geC4l-C4o-C4reC4meC4tOC4geC4quC5jA!5e0!3m2!1sen!2sth!4v1752639767781!5m2!1sen!2sth"
              width="100%"
              height="100%"
              loading="lazy"
              style={{ border: 0 }}
              allowFullScreen=""
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}
