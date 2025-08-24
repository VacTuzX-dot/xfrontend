"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [tokenState, setToken] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  const isActive = (href) => pathname === href;
  const [theme, setTheme] = useState("light");

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);

    // Theme detection
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current =
      document.documentElement.getAttribute("data-bs-theme") ||
      (prefersDark ? "dark" : "light");
    setTheme(current);
    document.documentElement.setAttribute("data-bs-theme", current);

    // Token detection
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  const toggleTheme = () => {
    if (!isClient) return;
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-bs-theme", next);
  };

  const handleSignOut = () => {
    if (!isClient) return;
    localStorage.removeItem("token");
    setToken(null);
    router.push("/signin");
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeNavbar = () => {
    setIsCollapsed(true);
  };

  // Prevent hydration issues by not rendering auth buttons until client-side
  if (!isClient) {
    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-glass sticky-top">
          <div className="container-fluid px-3 px-lg-4">
            {/* Brand */}
            <Link
              href="/"
              className="navbar-brand d-flex align-items-center gap-2 brand-fx"
            >
              <div className="logo-container">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="logo-fx"
                />
              </div>
              <span className="brand-text fs-4 fw-bold">อินEar</span>
            </Link>

            {/* Simple hamburger for SSR */}
            <button
              className="navbar-toggler border-0 p-1 d-lg-none"
              type="button"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Desktop nav items only */}
            <div className="d-none d-lg-flex">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" href="/">
                    <i className="bi bi-house-door me-2"></i>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/about">
                    <i className="bi bi-people me-2"></i>
                    About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/service">
                    <i className="bi bi-tools me-2"></i>
                    Our Services
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/contact">
                    <i className="bi bi-envelope me-2"></i>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <style jsx>{`
          .navbar-glass {
            background: rgba(var(--bs-body-bg-rgb), 0.8) !important;
            backdrop-filter: saturate(180%) blur(20px);
            -webkit-backdrop-filter: saturate(180%) blur(20px);
            border-bottom: 1px solid rgba(var(--bs-border-color-rgb), 0.2);
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          }
          .logo-container {
            position: relative;
            border-radius: 8px;
            padding: 4px;
            background: linear-gradient(
              135deg,
              var(--bs-primary),
              var(--bs-success)
            );
          }
          .logo-fx {
            border-radius: 4px;
          }
          .brand-text {
            background: linear-gradient(
              135deg,
              var(--bs-primary),
              var(--bs-success)
            );
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-glass sticky-top">
        <div className="container-fluid px-3 px-lg-4">
          {/* Brand */}
          <Link
            href="/"
            className="navbar-brand d-flex align-items-center gap-2 brand-fx"
            onClick={closeNavbar}
          >
            <div className="logo-container">
              <img
                src="/images/logo.png"
                alt="Logo"
                width={32}
                height={32}
                className="logo-fx"
              />
            </div>
            <span className="brand-text fs-4 fw-bold">อินEar</span>
          </Link>

          {/* Mobile Actions */}
          <div className="d-lg-none d-flex align-items-center gap-2">
            {/* Mobile Auth Button */}
            {tokenState ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="btn btn-outline-danger btn-sm"
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            ) : (
              <Link
                href="/signin"
                className="btn btn-primary btn-sm"
                onClick={closeNavbar}
              >
                <i className="bi bi-box-arrow-in-right"></i>
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="navbar-toggler border-0 p-1"
              type="button"
              onClick={toggleNavbar}
              aria-controls="navbarContent"
              aria-expanded={!isCollapsed}
              aria-label="Toggle navigation"
            >
              <div className="hamburger-icon">
                <span
                  className={`line line1 ${!isCollapsed ? "active" : ""}`}
                ></span>
                <span
                  className={`line line2 ${!isCollapsed ? "active" : ""}`}
                ></span>
                <span
                  className={`line line3 ${!isCollapsed ? "active" : ""}`}
                ></span>
              </div>
            </button>
          </div>

          {/* Collapsible Content */}
          <div
            className={`collapse navbar-collapse ${!isCollapsed ? "show" : ""}`}
            id="navbarContent"
          >
            {/* Mobile Search */}
            <div className="d-lg-none mt-3 mb-2">
              <div className="input-group search-mobile">
                <span className="input-group-text bg-transparent">
                  <i className="bi bi-search text-dark"></i>
                </span>
                <input
                  className="form-control border-0 bg-transparent"
                  type="search"
                  placeholder="Search..."
                  aria-label="Search"
                />
              </div>
            </div>

            {/* Navigation Links */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link navlink-fx px-3 py-2 ${
                    isActive("/") ? "active current" : ""
                  }`}
                  href="/"
                  onClick={closeNavbar}
                >
                  <i className="bi bi-house-door me-2"></i>
                  <span>Home</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link navlink-fx px-3 py-2 ${
                    isActive("/about") ? "active current" : ""
                  }`}
                  href="/about"
                  onClick={closeNavbar}
                >
                  <i className="bi bi-people me-2"></i>
                  <span>About Us</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link navlink-fx px-3 py-2 ${
                    isActive("/service") ? "active current" : ""
                  }`}
                  href="/service"
                  onClick={closeNavbar}
                >
                  <i className="bi bi-tools me-2"></i>
                  <span>Our Services</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link navlink-fx px-3 py-2 ${
                    isActive("/contact") ? "active current" : ""
                  }`}
                  href="/contact"
                  onClick={closeNavbar}
                >
                  <i className="bi bi-envelope me-2"></i>
                  <span>Contact</span>
                </Link>
              </li>
            </ul>

            {/* Desktop Actions */}
            <div className="d-none d-lg-flex align-items-center gap-3">
              {/* Search Bar */}
              <div className="search-container">
                <div className="input-group search-fx">
                  <span className="input-group-text bg-transparent border-end-0">
                    <i className="bi bi-search text-dark"></i>
                  </span>
                  <input
                    className="form-control border-start-0 bg-transparent"
                    type="search"
                    placeholder="Search..."
                    aria-label="Search"
                  />
                </div>
              </div>

              {/* Auth Buttons */}
              <div className="auth-buttons">
                {tokenState ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="btn btn-outline-danger btn-raise"
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Sign Out
                  </button>
                ) : pathname === "/signin" ? (
                  <Link href="/signup" className="btn btn-success btn-raise">
                    <i className="bi bi-person-plus me-2"></i>
                    Sign Up
                  </Link>
                ) : pathname === "/signup" ? (
                  <Link href="/signin" className="btn btn-primary btn-raise">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </Link>
                ) : (
                  <Link href="/signin" className="btn btn-primary btn-raise">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Auth Section */}
            <div className="d-lg-none mt-3 pt-3 border-top border-opacity-25">
              <div className="d-grid gap-2">
                {!tokenState && (
                  <>
                    {pathname !== "/signin" && (
                      <Link
                        href="/signin"
                        className="btn btn-primary"
                        onClick={closeNavbar}
                      >
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </Link>
                    )}
                    {pathname !== "/signup" && (
                      <Link
                        href="/signup"
                        className="btn btn-outline-success"
                        onClick={closeNavbar}
                      >
                        <i className="bi bi-person-plus me-2"></i>
                        Sign Up
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .navbar-glass {
          background: rgba(var(--bs-body-bg-rgb), 0.8) !important;
          backdrop-filter: saturate(180%) blur(20px);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          border-bottom: 1px solid rgba(var(--bs-border-color-rgb), 0.2);
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          transition: all 0.3s ease;
        }

        .navbar-glass.scrolled {
          background: rgba(var(--bs-body-bg-rgb), 0.95) !important;
          backdrop-filter: saturate(180%) blur(25px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }

        /* Brand Styling */
        .brand-fx {
          text-decoration: none !important;
          transition: transform 0.3s ease;
        }

        .brand-fx:hover {
          transform: translateY(-1px);
        }

        .logo-container {
          position: relative;
          border-radius: 8px;
          padding: 4px;
          background: linear-gradient(
            135deg,
            var(--bs-primary),
            var(--bs-success)
          );
          transition: transform 0.3s ease;
        }

        .logo-fx {
          border-radius: 4px;
          transition: transform 0.3s ease;
        }

        .brand-fx:hover .logo-container {
          transform: rotate(-3deg) scale(1.05);
        }

        .brand-text {
          background: linear-gradient(
            135deg,
            var(--bs-primary),
            var(--bs-success)
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        /* Hamburger Animation */
        .hamburger-icon {
          width: 24px;
          height: 18px;
          position: relative;
          cursor: pointer;
        }

        .line {
          display: block;
          height: 2px;
          width: 100%;
          background: var(--bs-body-color);
          border-radius: 2px;
          opacity: 1;
          left: 0;
          transform: rotate(0deg);
          transition: 0.25s ease-in-out;
          position: absolute;
        }

        .line1 {
          top: 0px;
        }
        .line2 {
          top: 8px;
        }
        .line3 {
          top: 16px;
        }

        .line1.active {
          top: 8px;
          transform: rotate(135deg);
        }

        .line2.active {
          opacity: 0;
          left: -60px;
        }

        .line3.active {
          top: 8px;
          transform: rotate(-135deg);
        }

        /* Navigation Links */
        .navlink-fx {
          position: relative;
          border-radius: 8px;
          transition: all 0.3s ease;
          margin: 0.25rem 0;
        }

        @media (min-width: 992px) {
          .navlink-fx {
            margin: 0;
          }
        }

        .navlink-fx::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            var(--bs-primary),
            var(--bs-success)
          );
          border-radius: 8px;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.3s ease;
          z-index: -1;
        }

        .navlink-fx:hover::before,
        .navlink-fx.current::before {
          opacity: 0.1;
          transform: scale(1);
        }

        .navlink-fx::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(
            135deg,
            var(--bs-primary),
            var(--bs-success)
          );
          transition: all 0.3s ease;
          transform: translateX(-50%);
          border-radius: 2px;
        }

        @media (max-width: 991.98px) {
          .navlink-fx::after {
            left: 0;
            transform: none;
          }
        }

        .navlink-fx:hover::after,
        .navlink-fx.current::after {
          width: 80%;
        }

        @media (max-width: 991.98px) {
          .navlink-fx:hover::after,
          .navlink-fx.current::after {
            width: 4px;
            height: 100%;
            bottom: 0;
            left: 0;
          }
        }

        .navlink-fx:hover {
          color: var(--bs-primary) !important;
          transform: translateX(4px);
        }

        @media (min-width: 992px) {
          .navlink-fx:hover {
            transform: translateY(-1px);
          }
        }

        /* Search Styling */
        .search-fx {
          width: 250px;
          transition: all 0.3s ease;
        }

        .search-fx .form-control {
          transition: all 0.3s ease;
          padding-left: 0.5rem;
        }

        .search-fx .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.15);
          border-color: var(--bs-primary);
        }

        .search-fx:focus-within {
          transform: scale(1.02);
          box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
        }

        .search-mobile {
          border: 1px solid rgba(var(--bs-border-color-rgb), 0.3);
          border-radius: 8px;
          background: rgba(var(--bs-body-bg-rgb), 0.5);
        }

        /* Button Styling */
        .btn-raise {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-raise::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: left 0.5s;
        }

        .btn-raise:hover::before {
          left: 100%;
        }

        .btn-raise:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }

        .btn-theme {
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .btn-theme:hover {
          transform: rotate(360deg) scale(1.1);
        }

        /* Responsive Adjustments */
        @media (max-width: 991.98px) {
          .navbar-collapse {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(var(--bs-border-color-rgb), 0.2);
            background: rgba(var(--bs-body-bg-rgb), 0.95);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            margin-left: -1rem;
            margin-right: -1rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .nav-item {
            margin: 0.25rem 0;
          }

          .navlink-fx {
            padding: 0.75rem 1rem !important;
            border-radius: 8px;
          }
        }

        /* Dark mode adjustments */
        [data-bs-theme="dark"] .navbar-glass {
          border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        [data-bs-theme="dark"] .search-mobile {
          color: #000;
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Smooth collapse animation */
        .navbar-collapse {
          transition: all 0.3s ease;
        }

        .navbar-collapse.collapsing {
          transition: height 0.3s ease;
        }
      `}</style>
    </>
  );
}
