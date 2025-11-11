import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserClass, clearError, clearDeleteSuccess } from "../store/userClassesSlice";
import { toast } from "react-toastify";

export default function UserClassList({ classItem, onDeleteSuccess }) {
  const dispatch = useDispatch();
  const { deleteLoading, error, deleteSuccess } = useSelector((state) => state.userClasses);

  useEffect(() => {
    if (deleteSuccess) {
      // Just clear state, no toast
      dispatch(clearDeleteSuccess());
      
      if (onDeleteSuccess) {
        onDeleteSuccess(classItem.id);
      }
    }
  }, [deleteSuccess, dispatch, onDeleteSuccess, classItem.id]);

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(error || "Failed to leave class", {
        toastId: `delete-error-${Date.now()}`,
      });
      
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm(`Are you sure you want to leave "${classItem.name}"?`)) {
      return;
    }
    
    try {
      await dispatch(deleteUserClass(classItem.id)).unwrap();
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

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
            <span className="text-white">
              {classItem.currentQuota}/{classItem.quota}
            </span>
          </p>
          <div className="d-flex justify-content-end">
            <button
              onClick={handleDelete}
              className="btn btn-danger fw-semibold px-3 py-1 join-btn"
              disabled={deleteLoading}
              style={{ 
                position: 'relative', 
                zIndex: 10,
                pointerEvents: 'auto'
              }}
            >
              {deleteLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Leaving...
                </>
              ) : (
                "Cancel  Class"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}