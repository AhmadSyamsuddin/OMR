import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // redirect kalau sudah login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  // init Google
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      // pastikan wrapper ada & full width
      const btn = document.getElementById("googleSignInButton");
      if (btn) {
        window.google.accounts.id.renderButton(btn, {
          theme: "filled_black",
          size: "large", // small | medium | large
        });
      }
    }
  }, []);

  const handleGoogleLogin = async (response) => {
    try {
      const { credential } = response;
      const result = await axios.post("http://localhost:3000/google-login", {
        googleToken: credential,
      });
      localStorage.setItem("token", result.data.access_token);
      navigate("/");
    } catch (error) {
      console.log(error, "<<< error Google login");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });
      localStorage.setItem("token", data.access_token);
      navigate("/");
    } catch (error) {
      console.log(error, "<<< error login");
    }
  };

  return (
    <div className="bg-black min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container" style={{ maxWidth: 1100 }}>
        <div
          className="row g-0 rounded-4 overflow-hidden shadow"
          style={{ backgroundColor: "#0b0b0b", border: "1px solid #1f1f1f" }}
        >
          {/* Left: Form */}
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
                  required
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
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-light w-100 py-2 border border-secondary"
              >
                Log In
              </button>

              {/* Divider */}
              <div className="d-flex align-items-center my-3">
                <div className="flex-grow-1 border-top border-secondary"></div>
                <span className="mx-3 text-secondary small">or</span>
                <div className="flex-grow-1 border-top border-secondary"></div>
              </div>

              {/* Google Button Wrapper (full width) */}
              <div id="googleSignInButton" className="w-100 d-grid mb-2" />

              <div className="d-flex justify-content-between align-items-center mt-3">
                <p className="m-0">
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
      {/* <style>{`
        #googleSignInButton > div {
          width: 100% !important;
        }
        #googleSignInButton > div > div {
          width: 100% !important;
        }
        #googleSignInButton iframe {
          width: 100% !important;
        }
      `}</style> */}
    </div>
  );
}
