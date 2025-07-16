import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        textAlign: "center",
        padding: "1rem 0",
        fontSize: "1rem",
        color: "#888",
        background: "black",
        zIndex: 100,
      }}
    >
      © {new Date().getFullYear()} Your Company
    </footer>
  );
}
