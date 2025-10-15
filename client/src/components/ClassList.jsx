import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { bookClass, clearBookingSuccess, clearError } from "../store/classesSlice";
import { fetchUserClasses } from "../store/userClassesSlice";
import { toast } from "react-toastify";
import "../ClassList.css";

export default function ClassList({ classItem }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookingLoading, bookingSuccess, error } = useSelector((state) => state.classes);

  useEffect(() => {
    if (bookingSuccess) {
      // Fetch updated user classes
      dispatch(fetchUserClasses());
      
      // Clear success state
      dispatch(clearBookingSuccess());
      
      // Direct redirect without toast
      navigate("/classes/joined");
    }
  }, [bookingSuccess, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      // Show error toast only
      toast.dismiss();
      toast.error(error || "Failed to join class", {
        toastId: `join-error-${Date.now()}`,
      });
      
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleJoin = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validate quota
    if (classItem.currentQuota >= classItem.quota) {
      toast.dismiss();
      toast.warning("This class is already full!", {
        toastId: `full-${classItem.id}`,
      });
      return;
    }
    
    try {
      await dispatch(bookClass(classItem.id)).unwrap();
    } catch (error) {
      console.error("Error joining class:", error);
    }
  };

  const isFull = classItem.currentQuota >= classItem.quota;

  return (
    <div className="class-card card border-0 rounded-4 overflow-hidden shadow-sm card-hover text-white">
      <div
        className="class-background position-relative"
        style={{
          backgroundImage: `url(${classItem.coachProfilePictureUrl || "https://via.placeholder.com/800x600"})`,
        }}
      >
        <div className="class-overlay position-absolute top-0 start-0 w-100 h-100"></div>

        <div className="position-absolute bottom-0 start-0 end-0 p-4">
          <h5 className="fw-bold mb-2 text-uppercase">{classItem.name}</h5>

          <p className="text-secondary small mb-2 d-flex align-items-center gap-1">
            <span className="coach-name fw-bold text-uppercase">
              {classItem.coach}
            </span>
          </p>

          <p className="text-secondary small mb-1">
            Duration: {classItem.duration} min
          </p>
          <p className="text-secondary small mb-3">
            Day: {classItem.day} • Quota:{" "}
            <span className={isFull ? "text-danger" : "text-white"}>
              {classItem.currentQuota}/{classItem.quota}
            </span>
            {isFull && <span className="badge bg-danger ms-2">FULL</span>}
          </p>
          <div className="d-flex justify-content-end">
            <button
              onClick={handleJoin}
              className="btn btn-danger fw-semibold px-3 py-1 join-btn"
              disabled={bookingLoading || isFull}
              style={{ 
                position: 'relative', 
                zIndex: 10,
                pointerEvents: 'auto'
              }}
            >
              {bookingLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Joining...
                </>
              ) : isFull ? (
                "Class Full"
              ) : (
                "Join Class"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}