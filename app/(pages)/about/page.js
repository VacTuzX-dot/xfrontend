"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <motion.h1
            className="mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            About IEM Audiophile
          </motion.h1>
          <motion.div
            className="card shadow-sm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="card-body">
              <motion.h5
                className="card-title"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Our Passion
              </motion.h5>
              <motion.p
                className="card-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Welcome to IEM Audiophile! We are enthusiasts dedicated to
                sharing knowledge, reviews, and experiences about in-ear
                monitors (IEMs) and audio gear.
              </motion.p>
              <motion.p
                className="card-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                Whether you’re a seasoned audiophile or just starting your
                journey, our mission is to help you discover the best sound for
                your unique preferences.
              </motion.p>
              <motion.button
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a href="/contact" className="text-white text-decoration-none">
                  Contact Us
                </a>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
