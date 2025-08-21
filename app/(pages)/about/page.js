"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="position-relative min-vh-100 text-white">
      {/* Background Image */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          zIndex: -999,
          backgroundColor: "#0a0a0a",
          opacity: 1,
          filter: "blur(4px)",
        }}
      >
        <img
          src="/images/bg2.png"
          alt="Background"
          className="w-100 h-100"
          style={{
            objectFit: "cover",
            opacity: 0.6,
          }}
        />
      </div>

      {/* Content */}
      <div className="container py-5">
        <div className="row">
          <div
            className="col-md-8 mx-auto"
            style={{
              background: "rgba(0,0,0,0.7)",
              borderRadius: "16px",
              padding: "2rem",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <motion.h1
              className="mb-4"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About IEM Audiophile
            </motion.h1>
            <motion.p
              className="lead mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.headphonesty.com%2Fwp-content%2Fuploads%2F2024%2F07%2FPromotion_on_the_worldwide_shipping-1100x500.jpg&f=1&nofb=1&ipt=50c9ffd6aa1b6987d0bcfcebf64c71327aced7d9b4d2fc6764beafe009ba6ba7"
                alt="About Us"
              />
            </motion.p>
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
                  journey, our mission is to help you discover the best sound
                  for your unique preferences.
                </motion.p>
                <motion.button
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="/contact"
                    className="text-white text-decoration-none"
                  >
                    Contact Us
                  </a>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
