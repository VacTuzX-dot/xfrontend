"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export default function ServicePage() {
  const [openIdx, setOpenIdx] = useState(null);
  const toggleItem = (idx) => setOpenIdx(openIdx === idx ? null : idx);

  return (
    <div className="position-relative min-vh-100">
      {/* Background Image */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          zIndex: -1,
          backgroundColor: "#0a0a0a",
        }}
      >
        <img
          src="/images/bg2.png"
          alt="Background"
          className="w-100 h-100"
          style={{
            objectFit: "cover",
            opacity: 0.6,
            loading: "lazy",
            fetchPriority: "high",
          }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)",
            backdropFilter: "blur(5px)",
          }}
        />
      </div>
      {/* Content Container */}
      <div
        className="container-fluid py-5 min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="container"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "2rem",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* HERO */}
          <motion.section variants={fadeUp} className="text-center mb-5">
            <h1 className="display-5 fw-bold mb-3" style={{ color: "#fff" }}>
              Our Services
            </h1>
            <p
              className="lead mx-auto"
              style={{ maxWidth: 760, color: "#e0e0e0" }}
            >
              Audiophile-grade IEMs & tuning services with a minimalist ethos.
              Clean design, precise sound, zero clutter.
            </p>
          </motion.section>

          {/* HERO IMAGE */}
          <motion.div variants={fadeUp} className="text-center mb-5">
            <motion.img
              src="https://potentgaming.com/cdn/shop/files/Gp5A0i9XoAA-vGx.jpg?v=1746213961&width=990"
              alt="Minimalist Audiophile IEM"
              className="img-fluid hero-img shadow-sm"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              style={{ borderRadius: "1rem", maxWidth: "100%" }}
            />
          </motion.div>

          {/* FEATURE STRIP */}
          <motion.ul variants={stagger} className="row g-3 list-unstyled mb-5">
            {[
              { icon: "bi-soundwave", text: "Premium, reference-grade tuning" },
              { icon: "bi-droplet", text: "Minimalist, clean aesthetics" },
              { icon: "bi-earbuds", text: "All-day comfort & fit" },
              { icon: "bi-sliders", text: "Customizable options" },
            ].map((f, i) => (
              <motion.li key={i} variants={fadeUp} className="col-6 col-md-3">
                <motion.div
                  className="text-center py-3 px-2"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    backdropFilter: "blur(5px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    background: "rgba(255,255,255,0.1)",
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i
                    className={`bi ${f.icon} fs-3 d-block mb-2 text-white`}
                  ></i>
                  <span className="text-white-50 small">{f.text}</span>
                </motion.div>
              </motion.li>
            ))}
          </motion.ul>

          {/* SERVICE CARDS */}
          <motion.div variants={stagger} className="row g-4 mb-5">
            {[
              {
                title: "IEM Consultation",
                desc: "Personalized recommendations matched to your library & preferences.",
                cta: "Book consult",
              },
              {
                title: "Custom Tuning",
                desc: "Fine-tune FR for neutrality or your target with subtle precision.",
                cta: "Request tuning",
              },
              {
                title: "Care & Fit",
                desc: "Tips, tips sizes, and fit coaching for comfort without fatigue.",
                cta: "Get fitting",
              },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="col-12 col-md-4">
                <motion.div
                  className="h-100 p-4"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "16px",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  whileHover={{
                    scale: 1.02,
                    background: "rgba(255,255,255,0.08)",
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="d-flex flex-column h-100">
                    <h5 className="fw-semibold mb-2 text-white">{s.title}</h5>
                    <p className="text-white-50 flex-grow-1">{s.desc}</p>
                    <motion.a
                      href="/contact"
                      className="btn btn-outline-light align-self-start"
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {s.cta}
                    </motion.a>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* FAQ (Minimal) */}
          <motion.div
            variants={fadeUp}
            className="accordion accordion-flush mb-5"
            id="faq"
            style={{
              background: "rgba(0,0,0,0.8)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {[
              {
                q: "What is your tuning philosophy?",
                a: "Neutral-first with tasteful, low-Q adjustments for musicality.",
              },
              {
                q: "Do you support returns?",
                a: "Consultation services are refundable within 7 days; custom work varies.",
              },
            ].map((it, idx) => {
              const isOpen = openIdx === idx;
              return (
                <motion.div
                  className="accordion-item"
                  key={idx}
                  style={{
                    background: "transparent",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <h2 className="accordion-header" id={`h-${idx}`}>
                    <motion.button
                      className={`accordion-button ${
                        isOpen ? "" : "collapsed"
                      }`}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`c-${idx}`}
                      onClick={() => toggleItem(idx)}
                      style={{
                        background: isOpen
                          ? "rgba(255,255,255,0.05)"
                          : "transparent",
                        color: "#fff",
                      }}
                      whileHover={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                      }}
                    >
                      {it.q}
                    </motion.button>
                  </h2>
                  <motion.div
                    id={`c-${idx}`}
                    className={`accordion-collapse collapse ${
                      isOpen ? "show" : ""
                    }`}
                    aria-labelledby={`h-${idx}`}
                  >
                    <div
                      className="accordion-body small"
                      style={{
                        color: "#e0e0e0",
                        background: "rgba(255,255,255,0.02)",
                      }}
                    >
                      {it.a}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA STRIP */}
          <motion.div variants={fadeUp} className="text-center">
            <a href="/contact" className="btn btn-lg btn-light px-4 btn-raise">
              Get Started
            </a>
            <p className="text-secondary small mt-2 mb-0">
              No spam. Just sound advice.
            </p>
          </motion.div>
        </motion.div>

        {/* Micro-interactions & minimal styles */}
        <style jsx>{`
          .bg-soft {
            background: linear-gradient(
              180deg,
              rgba(var(--bs-body-bg-rgb), 1) 0%,
              rgba(var(--bs-body-bg-rgb), 1) 55%,
              rgba(var(--bs-body-bg-rgb), 0.9) 100%
            );
          }
          .heading-gradient {
            background: linear-gradient(
              90deg,
              var(--bs-primary),
              var(--bs-success)
            );
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
          .hero-img {
            border-radius: 1rem;
            overflow: hidden;
            mask-image: radial-gradient(
              120% 120% at 50% 0%,
              #000 60%,
              rgba(0, 0, 0, 0.1) 100%
            );
            transition: transform 0.35s ease, box-shadow 0.35s ease;
          }
          .hero-img:hover {
            transform: translateY(-2px);
            box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.12);
          }

          .feature-card {
            border: 1px solid rgba(var(--bs-body-color-rgb), 0.08);
            border-radius: 0.75rem;
            background: rgba(var(--bs-body-bg-rgb), 0.6);
            transition: transform 0.18s ease, box-shadow 0.18s ease,
              border-color 0.18s ease;
          }
          .feature-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
            border-color: rgba(var(--bs-primary-rgb), 0.35);
          }

          .card-minimal {
            border: 1px solid rgba(var(--bs-body-color-rgb), 0.08);
            border-radius: 1rem;
            background: rgba(var(--bs-body-bg-rgb), 0.66);
            transition: transform 0.2s ease, box-shadow 0.2s ease,
              border-color 0.2s ease;
          }
          .card-minimal:hover {
            transform: translateY(-3px);
            box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.12);
            border-color: rgba(var(--bs-primary-rgb), 0.25);
          }

          .btn-raise {
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          .btn-raise:hover {
            transform: translateY(-1px);
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          }
        `}</style>
      </div>{" "}
    </div>
  );
}
