import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../store/userSlice";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle error
  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(error || "Registration failed");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(registerUser({ fullName, email, password })).unwrap();
      
      toast.dismiss();
      toast.success("Registration successful! Please login to continue.");
      
      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
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
              <h2 className="fw-semibold text-white m-0">Create account</h2>
              <small className="text-secondary">Please enter your details.</small>
            </div>

            <form onSubmit={handleSubmit} className="text-white">
              <div className="mb-3">
                <label className="form-label text-secondary">Full Name</label>
                <input
                  type="text"
                  className="form-control bg-black text-white border-secondary"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <p className="mb-0 text-secondary">
                  Already have an account?{" "}
                  <Link to="/login" className="link-light link-underline-opacity-0">
                    Log In
                  </Link>
                </p>
              </div>
            </form>
          </div>
          <div
            className="col-12 col-md-6"
            style={{
              backgroundColor: "#111",
              minHeight: 420,
              backgroundImage: `url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}