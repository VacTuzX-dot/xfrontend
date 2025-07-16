"use client";
import React from "react";
import { motion } from "framer-motion";

export default function ServicePage() {
  return (
    <div className="container py-5">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="display-4 fw-bold mb-3 text-primary">Our Service</h1>
        <p className="lead mb-4 text-secondary">
          Discover audiophile-grade IEMs with a sleek, minimalist design. Enjoy
          high-fidelity sound and elegant aesthetics—perfect for music lovers
          who appreciate both performance and style.
        </p>
        <motion.img
          src="/images/minimalist-iem.png"
          alt="Minimalist Audiophile IEM"
          className="img-fluid rounded shadow mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{ maxWidth: "350px" }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <ul className="list-group mx-auto" style={{ maxWidth: "400px" }}>
            <li className="list-group-item d-flex align-items-center">
              <span className="me-2 text-success">&#10003;</span>
              Premium sound quality
            </li>
            <li className="list-group-item d-flex align-items-center">
              <span className="me-2 text-success">&#10003;</span>
              Minimalist, modern style
            </li>
            <li className="list-group-item d-flex align-items-center">
              <span className="me-2 text-success">&#10003;</span>
              Comfortable fit for long listening
            </li>
            <li className="list-group-item d-flex align-items-center">
              <span className="me-2 text-success">&#10003;</span>
              Customizable options
            </li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-4"
        >
          <a href="/contact" className="btn btn-primary btn-lg px-4">
            Get Started
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
