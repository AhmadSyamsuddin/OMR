import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrograms } from "../store/programsSlice";
import ProgramCard from "../components/ProgramCard";

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
          <h1 className="text-white fw-semibold m-0">Workout Programs</h1>
          <small className="text-secondary">
            AI-tailored plans • Weekly structure • Track progress
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