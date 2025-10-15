import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkoutPlan, clearWorkoutPlan, clearError } from "../store/programsSlice";
import { useParams, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function WorkoutPlanPage() {
  const { programId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { workoutPlan, workoutLoading: loading, error } = useSelector((state) => state.programs);
  const [programName, setProgramName] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const name = location.state?.programName || "Unknown Program";
    setProgramName(name);
    dispatch(fetchWorkoutPlan({ programId, programName: name }));

    return () => {
      dispatch(clearWorkoutPlan());
    };
  }, [programId, location.state, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error || "Failed to generate workout plan");
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleRegenerate = () => {
    toast.info("Generating new workout plan...");
    dispatch(fetchWorkoutPlan({ programId, programName }));
  };

  if (loading) {
    return (
      <div className="bg-black min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-light mb-3" role="status" style={{ width: "3rem", height: "3rem" }} />
          <h4 className="text-white">Generating your personalized workout plan...</h4>
          <p className="text-secondary">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="text-danger mb-3" style={{ fontSize: "3rem" }}>⚠️</div>
          <h4 className="text-white mb-3">Oops! Something went wrong</h4>
          <p className="text-secondary mb-4">{error}</p>
          <button
            className="btn btn-light px-4"
            onClick={() => navigate("/programs")}
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-vh-100">
      <div className="container py-5" style={{ maxWidth: 1200 }}>
        <div className="mb-4">
          <button
            className="btn btn-link text-secondary text-decoration-none p-0 mb-3"
            onClick={() => navigate("/programs")}
          >
            ← Back to Programs
          </button>
          <h1 className="text-white fw-bold mb-2">7-Day Workout Plan</h1>
          <h3 className="text-white-50">{programName}</h3>
          <p className="text-secondary">
            AI-generated personalized workout plan to enhance your {programName.toLowerCase()} performance
          </p>
        </div>

        <div className="row g-3 g-md-4">
          {workoutPlan && workoutPlan.map((day, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div
                className="card bg-dark border-secondary h-100 cursor-pointer"
                style={{ cursor: "pointer", transition: "transform 0.2s, border-color 0.2s" }}
                onClick={() => setSelectedDay(selectedDay === day.day ? null : day.day)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--bs-border-color)";
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="text-white fw-bold mb-0">Day {day.day}</h5>
                    <span className="badge bg-primary">
                      {selectedDay === day.day ? "−" : "+"}
                    </span>
                  </div>
                  <h6 className="text-white-50 mb-3">{day.title}</h6>

                  {selectedDay === day.day && (
                    <div className="mt-3 pt-3 border-top border-secondary">
                      <div className="mb-3">
                        <h6 className="text-white text-uppercase small mb-2">Exercises</h6>
                        {day.exercises.map((exercise, idx) => (
                          <div key={idx} className="mb-3 pb-3 border-bottom border-dark">
                            <div className="text-white fw-semibold mb-1">{exercise.name}</div>
                            <div className="small text-secondary">
                              <div>Sets: {exercise.sets}</div>
                              <div>Reps: {exercise.reps}</div>
                              <div>Rest: {exercise.rest}</div>
                              {exercise.notes && (
                                <div className="mt-1 fst-italic text-white-50">
                                  {exercise.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {day.cooldown && (
                        <div className="mb-3">
                          <h6 className="text-white text-uppercase small mb-2">Cooldown</h6>
                          <p className="text-secondary small mb-0">{day.cooldown}</p>
                        </div>
                      )}

                      {day.tips && (
                        <div>
                          <h6 className="text-white text-uppercase small mb-2">Tips</h6>
                          <p className="text-secondary small mb-0">{day.tips}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <button
            className="btn btn-outline-light px-5 py-2"
            onClick={handleRegenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Generating...
              </>
            ) : (
              "Regenerate Plan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}