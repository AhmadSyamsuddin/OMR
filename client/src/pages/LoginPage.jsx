import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("token");
  if (token) {
      navigate("/"); 
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:3000/login",{
            email,
            password
        });
        localStorage.setItem("token", response.data.access_token);
        navigate("/");
    } catch (error) {
        console.log(error,"<<< error login")
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

              <div className="mb-4">
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

              <div className="d-flex justify-content-between align-items-center mt-3">
                <p className="m-0">
                  Don’t have an account?{" "}
                  <a href="#" className="link-light link-underline-opacity-0">
                    Sign Up
                  </a>
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
            <img src="./logo.png" alt="Brand Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
