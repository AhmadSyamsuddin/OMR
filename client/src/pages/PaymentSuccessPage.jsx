import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const checkPayment = async () => {
      const orderId = searchParams.get("order_id");
      const statusCode = searchParams.get("status_code");
      const transactionStatus = searchParams.get("transaction_status");

      if (!orderId) {
        setStatus("error");
        setMessage("Invalid payment information");
        return;
      }

      try {
        // Check payment status from backend
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/payment/status/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (
          data.transaction_status === "settlement" ||
          data.transaction_status === "capture"
        ) {
          setStatus("success");
          setMessage("Payment successful! Your membership has been activated.");

          // Wait a bit for webhook to update database, then verify and trigger update
          const verifyAndUpdate = async () => {
            try {
              // First, manually update membership status (fallback for local development when webhook might not work)
              await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/memberships`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              // Check if user's membership is actually updated
              const { data: userData } = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/user`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              console.log("Verified user membership:", userData.isMembership);

              // Trigger membership update event for Navbar
              window.dispatchEvent(new Event("membershipUpdated"));

              // Redirect to home after a short delay
              setTimeout(() => {
                navigate("/");
              }, 2000);
            } catch (error) {
              console.error("Error verifying membership:", error);
              // Still trigger update and redirect even if verification fails
              window.dispatchEvent(new Event("membershipUpdated"));
              setTimeout(() => {
                navigate("/");
              }, 2000);
            }
          };

          // Wait 1.5 seconds for webhook to process
          setTimeout(verifyAndUpdate, 1500);
        } else if (data.transaction_status === "pending") {
          setStatus("pending");
          setMessage("Payment is still being processed. Please wait...");
        } else {
          setStatus("error");
          setMessage("Payment failed or cancelled. Please try again.");
        }
      } catch (error) {
        console.error("Error checking payment:", error);
        setStatus("error");
        setMessage("Failed to verify payment. Please contact support.");
      }
    };

    checkPayment();
  }, [searchParams, navigate]);

  const getStatusIcon = () => {
    if (status === "success") {
      return (
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mb-4"
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "#22c55e",
            boxShadow: "0 0 40px rgba(34, 197, 94, 0.3)",
          }}
        >
          <i className="bi bi-check-lg text-white" style={{ fontSize: "3rem" }}></i>
        </div>
      );
    } else if (status === "error") {
      return (
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mb-4"
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "#e50914",
            boxShadow: "0 0 40px rgba(229, 9, 20, 0.3)",
          }}
        >
          <i className="bi bi-x-lg text-white" style={{ fontSize: "3rem" }}></i>
        </div>
      );
    } else {
      return (
        <div
          className="spinner-border mb-4"
          role="status"
          style={{ width: "100px", height: "100px", color: "#e50914" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      );
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "#0b0b0b",
        backgroundImage:
          "radial-gradient(circle at 20% 50%, rgba(229, 9, 20, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(229, 9, 20, 0.08) 0%, transparent 50%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div
              className="card text-center"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "20px",
                padding: "3rem 2rem",
              }}
            >
              <div className="d-flex flex-column align-items-center">
                {getStatusIcon()}

                <h2
                  className="fw-bold mb-3"
                  style={{
                    color: "#ffffff",
                    fontSize: "2rem",
                  }}
                >
                  {status === "success"
                    ? "Payment Successful!"
                    : status === "error"
                    ? "Payment Failed"
                    : "Processing Payment"}
                </h2>

                <p
                  className="mb-4"
                  style={{
                    color: "#999",
                    fontSize: "1.1rem",
                  }}
                >
                  {message}
                </p>

                {status === "success" && (
                  <div
                    className="alert d-flex align-items-center gap-2 mb-4"
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.1)",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                      color: "#22c55e",
                      borderRadius: "12px",
                    }}
                  >
                    <i className="bi bi-star-fill"></i>
                    <span>You are now a Premium member!</span>
                  </div>
                )}

                {status === "error" && (
                  <button
                    onClick={() => navigate("/")}
                    className="btn btn-danger px-5 py-2"
                    style={{
                      backgroundColor: "#e50914",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    Back to Home
                  </button>
                )}

                {status === "success" && (
                  <small style={{ color: "#666" }}>
                    Redirecting to home page...
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
