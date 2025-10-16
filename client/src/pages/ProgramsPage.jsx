import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrograms } from "../store/programsSlice";
import ProgramCard from "../components/ProgramCard";
import { Link } from "react-router";

export default function ProgramsPage() {
  const dispatch = useDispatch();
  const { items: programs, loading } = useSelector((state) => state.programs);

  useEffect(() => {
    dispatch(fetchPrograms());
  }, [dispatch]);

  return (
    <div className="bg-black min-vh-100">
      <div className="container py-5" style={{ maxWidth: 1200 }}>
        <div className="mb-4 text-center text-md-start">
          <Link
            className="btn btn-link text-secondary text-decoration-none p-0 mb-3"
            to="/"
          >
            ← Back to Home
          </Link>
          <h1 className="text-white fw-semibold m-0">Workout Programs</h1>
          <small className="text-secondary">
            Select your preferred sport or workout from the menu on this page and instantly generate a tailored one-week training plan to help you perform your best in your chosen activity!
          </small>
        </div>

        <div className="row g-3 g-md-4">
          {programs.map((program) => (
            <div key={program.id || program.name} className="col-12 col-sm-6 col-lg-4">
              <ProgramCard program={program} />
            </div>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-5">
            <div className="spinner-border text-light mb-3" role="status" />
            <p className="text-secondary m-0">Loading programs…</p>
          </div>
        )}
      </div>
    </div>
  );
}