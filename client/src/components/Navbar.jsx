import React from "react";
import { useNavigate, Link } from "react-router";

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      className="w-100"
      style={{
        backgroundColor: "#0b0b0b",
        borderBottom: "1px solid #1f1f1f",
      }}
    >
      <div className="container-fluid px-2 px-md-3 py-2 d-flex align-items-center justify-content-between">
        {/* Left: Logo */}
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <img
            src="/logo-icon.png"
            alt="Brand"
            style={{ width: 26, height: 26, objectFit: "contain" }}
          />
          <span
            className="text-white fw-semibold"
            style={{ letterSpacing: "0.5px", fontSize: "1rem" }}
          >
            ONE MORE REP
          </span>
        </Link>
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #2a2a2a",
              color: "#bbb",
              fontWeight: 500,
              fontSize: "0.9rem",
              letterSpacing: "0.3px",
              transition: "all 0.3s ease",
            }}
          >
            <i
              className="bi bi-lightning-charge-fill"
              style={{ color: "#e50914", fontSize: "1rem" }}
            ></i>
            <span>Regular</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-light py-1 px-3"
            style={{
              borderColor: "#2a2a2a",
              backgroundColor: "transparent",
              color: "#fff",
              fontWeight: 500,
              borderRadius: 8,
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e50914";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "#e50914";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "#2a2a2a";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
