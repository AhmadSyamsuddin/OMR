import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import axios from "axios";
// import HomePage.css
import "../HomePage.css";


export default function HomePage() {
  const [isMembership, setIsMembership] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:3000/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsMembership(data.isMembership);
      } catch (error) {
        console.log(error, "<<< error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:3000/payment/generate-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect to Midtrans payment page
      window.snap.pay(data.token, {
        onSuccess: function (result) {
          console.log("Payment success:", result);
          // Refresh user data to update membership status
          window.location.reload();
        },
        onPending: function (result) {
          console.log("Payment pending:", result);
        },
        onError: function (result) {
          console.log("Payment error:", result);
          alert("Payment failed. Please try again.");
        },
        onClose: function () {
          console.log("Payment popup closed");
        },
      });
    } catch (error) {
      console.log(error, "<<< error generating payment token");
      alert("Failed to initiate payment. Please try again.");
    }
  };

  return (
    <div className="home-hero min-vh-100 d-flex align-items-center">
      <div className="container py-5">
        <div className="home-overlay rounded-4 p-4 p-md-5">
          {/* Headline */}
          <div className="mb-4 text-center text-md-start">
            <h1 className="text-white fw-semibold m-0">Elevate Your Training</h1>
            <small className="text-secondary">
              Choose your path. Commit to the process. Become your best.
            </small>
          </div>

          {/* Cards */}
          <div className="row g-3 g-md-4">
            <div className="col-12 col-md-6">
              {isMembership ? (
                <NavLink to="/classes" className="text-decoration-none d-block">
                  <div className="card-section card-classes position-relative rounded-4 overflow-hidden shadow border card-hover">
                    <div className="card-overlay position-absolute top-0 start-0 w-100 h-100">
                      <div className="position-absolute bottom-0 start-0 end-0 p-4 p-md-5">
                        <h2 className="text-white fw-semibold mb-1">Workout Classes</h2>
                        <p className="text-secondary mb-0">
                          Coach-led sessions • Fixed schedules • Team energy
                        </p>
                      </div>
                    </div>
                  </div>
                </NavLink>
              ) : (
                <div
                  className="text-decoration-none d-block"
                  style={{ cursor: "default", opacity: loading ? 0.5 : 1 }}
                >
                  <div className="card-section card-classes position-relative rounded-4 overflow-hidden shadow border" style={{ opacity: 0.5, filter: "grayscale(50%)" }}>
                    <div className="card-overlay position-absolute top-0 start-0 w-100 h-100">
                      <div className="position-absolute bottom-0 start-0 end-0 p-4 p-md-5">
                        <h2 className="text-white fw-semibold mb-1">Workout Classes</h2>
                        <p className="text-secondary mb-0">
                          Coach-led sessions • Fixed schedules • Team energy
                        </p>
                        <div className="d-flex align-items-center gap-2 mt-3">
                          <span className="badge bg-warning text-dark">
                            Membership Required
                          </span>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={handleSubscribe}
                            disabled={loading}
                          >
                            Subscribe Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-12 col-md-6">
              <NavLink to="/programs" className="text-decoration-none d-block">
                <div className="card-section card-programs position-relative rounded-4 overflow-hidden shadow border card-hover">
                  <div className="card-overlay position-absolute top-0 start-0 w-100 h-100">
                    <div className="position-absolute bottom-0 start-0 end-0 p-4 p-md-5">
                      <h2 className="text-white fw-semibold mb-1">Workout Programs</h2>
                      <p className="text-secondary mb-0">
                        AI-tailored plans • Weekly structure 
                      </p>
                    </div>
                  </div>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
