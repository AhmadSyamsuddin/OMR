import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { fetchUser } from "../store/userSlice";
import { generatePaymentToken, clearError } from "../store/paymentSlice";
import { toast } from "react-toastify";
import "../HomePage.css";

export default function HomePage() {
  const dispatch = useDispatch();
  const { isMembership, loading: userLoading } = useSelector((state) => state.user);
  const { loading: paymentLoading, error: paymentError } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (paymentError) {
      toast.error(paymentError || "Payment initialization failed");
      dispatch(clearError());
    }
  }, [paymentError, dispatch]);

  const handleSubscribe = async () => {
    try {
      const result = await dispatch(generatePaymentToken()).unwrap();
      if (result.token) {
        window.snap.pay(result.token, {
          onSuccess: function(result) {
            toast.success("Payment successful! 🎉");
            console.log('success', result);
          },
          onPending: function(result) {
            toast.info("Payment pending, please complete the payment");
            console.log('pending', result);
          },
          onError: function(result) {
            toast.error("Payment failed, please try again");
            console.log('error', result);
          },
          onClose: function() {
            toast.warning("Payment cancelled");
            console.log('customer closed the popup without finishing the payment');
          }
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="home-hero min-vh-100 d-flex align-items-center">
      <div className="container py-5">
        <div className="home-overlay rounded-4 p-4 p-md-5">
          <div className="mb-4 text-center text-md-start">
            <h1 className="text-white fw-semibold m-0">Elevate Your Training</h1>
            <small className="text-secondary">
              Choose your path. Commit to the process. Become your best.
            </small>
          </div>

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
                <div className="text-decoration-none d-block position-relative">
                  <div
                    className="card-section card-classes position-relative rounded-4 overflow-hidden shadow border"
                    style={{ opacity: 0.5, filter: "grayscale(50%)" }}
                  >
                    <div className="card-overlay position-absolute top-0 start-0 w-100 h-100">
                      <div className="position-absolute bottom-0 start-0 end-0 p-4 p-md-5">
                        <h2 className="text-white fw-semibold mb-1">Workout Classes</h2>
                        <p className="text-secondary mb-0">
                          Coach-led sessions • Fixed schedules • Team energy
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                    style={{
                      background: "rgba(0,0,0,0.7)",
                      zIndex: 5,
                      borderRadius: 16,
                    }}
                  >
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={handleSubscribe}
                      disabled={userLoading || paymentLoading}
                    >
                      {paymentLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : (
                        "Subscribe Now"
                      )}
                    </button>
                    <p className="text-center tex-wrap mt-2" style={{color : "rgba(171, 170, 170, 1)"}}>Unlock your fitness potential with membership access to various high-quality workout classes. Train with passionate coaches and feed off the electric energy of the group!</p>
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