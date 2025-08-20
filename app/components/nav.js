"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [tokenState, setToken] = useState("");
  const pathname = usePathname();

  const isActive = (href) => pathname === href;
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current =
      document.documentElement.getAttribute("data-bs-theme") ||
      (prefersDark ? "dark" : "light");
    setTheme(current);
    document.documentElement.setAttribute("data-bs-theme", current);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-bs-theme", next);
  };

  useEffect(() => {
    // อ่าน token จาก localStorage (ตอน mount)
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/signin");
  };
  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary sticky-top border-bottom shadow-sm"
      style={{
        background: "rgba(var(--bs-body-bg-rgb), 0.7)",
        backdropFilter: "saturate(180%) blur(8px)",
      }}
    >
      <div className="container-fluid">
        <Link
          href="/"
          className="navbar-brand d-flex align-items-center gap-2 brand-fx"
        >
          <img
            src="/images/logo.png"
            alt="Logo"
            width={30}
            height={30}
            className="d-inline-block align-text-top logo-fx"
          />
          <span className="brand-text">อินEar</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link navlink-fx ${
                  isActive("/") ? "active current" : ""
                }`}
                aria-current={isActive("/") ? "page" : undefined}
                href="/"
              >
                <i className="bi bi-house-door"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link navlink-fx ${
                  isActive("/about") ? "active current" : ""
                }`}
                href="/about"
              >
                <i className="bi bi-people"></i> About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link navlink-fx ${
                  isActive("/service") ? "active current" : ""
                }`}
                href="/service"
                aria-disabled="true"
              >
                <i className="bi bi-tools"></i> Our Services
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link navlink-fx ${
                  isActive("/contact") ? "active current" : ""
                }`}
                href="/contact"
                aria-disabled="true"
              >
                <i className="bi bi-envelope"></i> Contact
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            <div className="input-group d-none d-lg-flex me-2 search-fx">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control"
                type="search"
                placeholder="Search..."
                aria-label="Search"
              />
            </div>

            {tokenState ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="btn btn-outline-danger"
              >
                <i className="bi bi-box-arrow-right"></i> SignOut
              </button>
            ) : pathname === "/signin" ? (
              <Link href="/signup" className="btn btn-success btn-raise">
                <i className="bi bi-person-plus"></i> SignUp
              </Link>
            ) : pathname === "/signup" ? (
              <Link href="/signin" className="btn btn-primary btn-raise">
                <i className="bi bi-box-arrow-in-right"></i> SignIn
              </Link>
            ) : (
              <Link href="/signin" className="btn btn-primary btn-raise">
                <i className="bi bi-box-arrow-in-right"></i> SignIn
              </Link>
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        .brand-fx .brand-text {
          background: linear-gradient(
            90deg,
            var(--bs-primary),
            var(--bs-success)
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
        }
        .logo-fx {
          transition: transform 0.2s ease;
        }
        .brand-fx:hover .logo-fx {
          transform: rotate(-6deg) scale(1.05);
        }

        .navlink-fx {
          position: relative;
          transition: color 0.2s ease;
        }
        .navlink-fx::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2px;
          background: var(--bs-primary);
          transition: width 0.25s ease;
        }
        .navlink-fx:hover::after {
          width: 100%;
        }
        .navlink-fx.current::after {
          width: 100%;
        }

        .btn-raise {
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .btn-raise:hover {
          transform: translateY(-1px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }

        .search-fx .form-control {
          transition: box-shadow 0.2s ease, width 0.25s ease;
          width: 14rem;
        }
        .search-fx:focus-within .form-control {
          box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
          width: 18rem;
        }
      `}</style>
    </nav>
  );
}
