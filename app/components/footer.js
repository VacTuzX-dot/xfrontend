"use client";

import React from "react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function Footer() {
  const handleContact = async () => {
    const { value: formValues, isConfirmed } = await Swal.fire({
      title: "Contact me",
      html: `
        <div class="text-start">
          <div class="mb-2">
            <label class="form-label">Name</label>
            <input id="swal-name" class="form-control" placeholder="Your name" />
          </div>
          <div class="mb-2">
            <label class="form-label">Email</label>
            <input id="swal-email" type="email" class="form-control" placeholder="you@example.com" />
          </div>
          <div class="mb-0">
            <label class="form-label">Message</label>
            <textarea id="swal-message" class="form-control" rows="4" placeholder="How can I help?"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Send",
      focusConfirm: false,
      width: 600,
      color: "#fdffff",
      background: "#212529",
      customClass: {
        popup: "border border-secondary rounded-4",
      },
      preConfirm: () => {
        const name = document.getElementById("swal-name")?.value?.trim();
        const email = document.getElementById("swal-email")?.value?.trim();
        const message = document.getElementById("swal-message")?.value?.trim();
        if (!email || !message) {
          // validate minimal viable info
          Swal.showValidationMessage("Email และข้อความจำเป็นต้องกรอก");
          return;
        }
        return { name, email, message };
      },
    });

    if (isConfirmed && formValues) {
      const { name, email, message } = formValues;
      const subject = encodeURIComponent("Contact via portfolio");
      const body = encodeURIComponent(
        `Name: ${name || "-"}\nEmail: ${email}\n\n${message}`
      );
      // เปิด mail client ของผู้ใช้
      window.location.href = `mailto:taweesaknumma@gmail.com?subject=${subject}&body=${body}`;
      Swal.fire({
        title: "Opening your email app…",
        timer: 1500,
        showConfirmButton: false,
        icon: "success",
        background: "#212529",
        color: "#fff",
      });
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer className="bg-light border-top border-secondary py-4">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
        {/* Left: brand / copyright */}
        <div className="small">
          © {year} <span className="fw-semibold">Taweesak Numma</span>
        </div>

        {/* Middle: quick links */}
        <nav className="d-flex align-items-center gap-3">
          <Link
            href="https://github.com/vactuzx-dot"
            className="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-2"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", transition: "all 0.4s ease" }}
          >
            {/* GitHub icon (inline SVG, no extra deps) */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.64 0 8.13c0 3.59 2.29 6.63 5.47 7.7.4.08.55-.18.55-.4l-.01-1.42c-2.23.5-2.7-1.09-2.7-1.09-.36-.93-.89-1.18-.89-1.18-.73-.51.06-.5.06-.5.8.06 1.22.84 1.22.84.72 1.25 1.9.89 2.36.68.07-.53.28-.89.51-1.1-1.78-.2-3.65-.91-3.65-4.05 0-.9.31-1.63.82-2.2-.08-.2-.36-1.02.08-2.13 0 0 .67-.22 2.2.84.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.06 2.2-.84 2.2-.84.44 1.11.16 1.93.08 2.13.51.57.82 1.3.82 2.2 0 3.15-1.87 3.85-3.66 4.05.29.25.54.74.54 1.5l-.01 2.22c0 .22.15.48.55.4A8.06 8.06 0 0 0 16 8.13C16 3.64 12.42 0 8 0Z" />
            </svg>
            GitHub
          </Link>

          <Link
            href="https://facebook.com/vactuz"
            className="btn btn-outline-dark btn-sm d-inline-flex align-items-center gap-2"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", transition: "0.4s ease" }}
          >
            {/* Facebook icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M22.675 0h-21.35C.595 0 0 .595 0 1.326v21.348C0 23.404.595 24 1.326 24h11.49v-9.294H9.691v-3.622h3.125V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.404 24 24 23.404 24 22.674V1.326C24 .595 23.404 0 22.675 0z" />
            </svg>
            Facebook
          </Link>

          <button
            onClick={handleContact}
            className="btn btn-primary btn-sm d-inline-flex align-items-center gap-2"
            aria-label="Contact"
            type="button"
          >
            {/* Mail icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20 4H4a2 2 0 0 0-2 2v.4l10 6.25L22 6.4V6a2 2 0 0 0-2-2Zm2 5.2-9.24 5.77a2 2 0 0 1-2.12 0L1 9.2V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9.2Z" />
            </svg>
            Contact
          </button>
        </nav>

        {/* Right: quick email */}
        <div className="small text-dark">
          <a
            href="mailto:taweesaknumma@gmail.com"
            className="link-dark text-decoration-none"
          >
            taweesaknumma@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
