import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import ProgramsPage from "./pages/ProgramsPage";
import ClassesPage from "./pages/ClassesPage";
import ClassesUserPage from "./pages/ClassesUserPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import WorkoutPlanPage from "./pages/WorkoutPlanPage";

function ProtectedRoute() {
  const { token } = useSelector((state) => state.user);
  const localToken = localStorage.getItem("token");

  if (!token && !localToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function GuestRoute() {
  const { token } = useSelector((state) => state.user);
  const localToken = localStorage.getItem("token");

  if (token || localToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Guest Routes - redirect to home if logged in */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes - require login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/programs/:programId/workout-plan" element={<WorkoutPlanPage />} />
          <Route path="/classes" element={<ClassesPage />} />
          <Route path="/classes/joined" element={<ClassesUserPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;