import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import ProgramsPage from "./pages/ProgramsPage";
import ClassesPage from "./pages/ClassesPage";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/classes" element={<ClassesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
