import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../store/userSlice";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  // Initialize Google Sign-In
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      const btn = document.getElementById("googleSignInButton");
      if (btn) {
        window.google.accounts.id.renderButton(btn, {
          theme: "filled_black",
          size: "large",
        });
      }
    }
  }, []);

  // Handle error
  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(error || "Login failed");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle successful login redirect
  useEffect(() => {
    if (isLoginSuccess && token) {
      toast.dismiss();
      toast.success("Login successful! Welcome back!");
      navigate("/", { replace: true });
    }
  }, [isLoginSuccess, token, navigate]);

  const handleGoogleLogin = async (response) => {
    try {
      const { credential } = response;
      const result = await api.post("/google-login", {
        googleToken: credential,
      });

      // Save token to localStorage
      localStorage.setItem("token", result.data.access_token);

      // Trigger redirect
      setIsLoginSuccess(true);

      // Small delay to ensure state is updated
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 100);
    } catch (error) {
      toast.dismiss();
      toast.error("Google login failed. Please try again.");
      console.error("Error Google login:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ email, password })).unwrap();

      // Set flag to trigger redirect
      setIsLoginSuccess(true);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="bg-black min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container" style={{ maxWidth: 1100 }}>
        <div
          className="row g-0 rounded-4 overflow-hidden shadow"
          style={{ backgroundColor: "#0b0b0b", border: "1px solid #1f1f1f" }}
        >
          <div className="col-12 col-md-6 p-4 p-md-5">
            <div className="mb-4">
              <h2 className="fw-semibold text-white m-0">Welcome Back</h2>
              <small className="text-secondary">
                Please log in to continue.
              </small>
            </div>

            <form onSubmit={handleSubmit} className="text-white">
              <div className="mb-3">
                <label className="form-label text-secondary">Email</label>
                <input
                  type="email"
                  className="form-control bg-black text-white border-secondary"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label text-secondary">Password</label>
                <input
                  type="password"
                  className="form-control bg-black text-white border-secondary"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-light w-100 py-2 border border-secondary mt-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </button>

              <div className="d-flex align-items-center my-3">
                <div className="flex-grow-1 border-top border-secondary"></div>
                <span className="mx-3 text-secondary small">or</span>
                <div className="flex-grow-1 border-top border-secondary"></div>
              </div>

              <div id="googleSignInButton" className="w-100 d-grid mb-2" />

              <div className="d-flex justify-content-between align-items-center mt-3">
                <p className="mb-0 text-secondary">
                  Don't have an account?{" "}
                  <Link to={"/register"} className="link-light link-underline-opacity-0">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
          <div
            className="col-12 col-md-6 position-relative"
            style={{
              backgroundColor: "#111",
              minHeight: 420,
              backgroundImage: `url("https://row.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F8urtyqugdt2l%2F7DjCv2aBaPIABZ9wosGvJk%2F0d693d9d04fae848feac8779289e2d3c%2Fmobile-leg-exercises.jpg&w=3840&q=85")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img
              src="./logo.png"
              alt="Brand Logo"
              className="position-absolute end-0 top-0 m-3"
              style={{
                width: 100,
                height: "auto",
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: 8,
                padding: "4px 8px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}