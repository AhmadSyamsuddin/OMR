import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, logout } from "../store/userSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isMembership, loading } = useSelector((state) => state.user);

  // Initial fetch and event listener setup
  useEffect(() => {
    dispatch(fetchUser());

    // Listen for membership update event
    const handleMembershipUpdate = () => {
      console.log("Membership update event received");
      dispatch(fetchUser());
    };

    window.addEventListener("membershipUpdated", handleMembershipUpdate);

    return () => {
      window.removeEventListener("membershipUpdated", handleMembershipUpdate);
    };
  }, [dispatch]);

  // Re-fetch user data when route changes
  useEffect(() => {
    console.log("Route changed, refetching user data");
    dispatch(fetchUser());
  }, [location.pathname, dispatch]);

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logout());
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
          {loading ? (
            <div
              className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                color: "#666",
              }}
            >
              <div
                className="spinner-border spinner-border-sm"
                role="status"
                style={{ width: "14px", height: "14px" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <span style={{ fontSize: "0.9rem" }}>Loading...</span>
            </div>
          ) : (
            <div
              className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
              style={{
                backgroundColor: isMembership ? "#1a1a1a" : "#1a1a1a",
                border: isMembership
                  ? "1px solid rgba(255, 215, 0, 0.3)"
                  : "1px solid #2a2a2a",
                color: isMembership ? "#ffd700" : "#bbb",
                fontWeight: 500,
                fontSize: "0.9rem",
                letterSpacing: "0.3px",
                transition: "all 0.3s ease",
                boxShadow: isMembership
                  ? "0 0 20px rgba(255, 215, 0, 0.15)"
                  : "none",
              }}
            >
              <i
                className={
                  isMembership
                    ? "bi bi-star-fill"
                    : "bi bi-lightning-charge-fill"
                }
                style={{
                  color: isMembership ? "#ffd700" : "#e50914",
                  fontSize: "1rem",
                }}
              ></i>
              <span>{isMembership ? "Premium" : "Regular"}</span>
            </div>
          )}
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