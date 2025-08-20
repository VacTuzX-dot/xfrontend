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
    <div className="container-fluid py-5 min-vh-100 d-flex align-items-center justify-content-center bg-soft">
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="container"
      >
        {/* HERO */}
        <motion.section variants={fadeUp} className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-3 heading-gradient">
            Our Services
          </h1>
          <p className="lead text-secondary mx-auto" style={{ maxWidth: 760 }}>
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
              <div className="feature-card text-center py-3 px-2">
                <i className={`bi ${f.icon} fs-3 d-block mb-2`}></i>
                <span className="text-body-secondary small">{f.text}</span>
              </div>
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
              <div className="card card-minimal h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-semibold mb-2">{s.title}</h5>
                  <p className="card-text text-secondary flex-grow-1">
                    {s.desc}
                  </p>
                  <a
                    href="/contact"
                    className="btn btn-primary btn-raise align-self-start"
                  >
                    {s.cta}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ (Minimal) */}
        <motion.div variants={fadeUp} className="accordion accordion-flush mb-5" id="faq">
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
              <div className="accordion-item" key={idx}>
                <h2 className="accordion-header" id={`h-${idx}`}>
                  <button
                    className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`c-${idx}`}
                    onClick={() => toggleItem(idx)}
                  >
                    {it.q}
                  </button>
                </h2>
                <div
                  id={`c-${idx}`}
                  className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                  aria-labelledby={`h-${idx}`}
                >
                  <div className="accordion-body text-secondary small">{it.a}</div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* CTA STRIP */}
        <motion.div variants={fadeUp} className="text-center">
          <a href="/contact" className="btn btn-lg btn-primary px-4 btn-raise">
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
    </div>
  );
}
