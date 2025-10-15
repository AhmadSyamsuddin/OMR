import axios from 'axios';
import React from 'react'

export default function UserClassList({ classItem, onDeleteSuccess }) {
  const handleDelete = async(e) => {
    e.preventDefault();
    try {
      await axios.delete(`http://localhost:3000/workout-classes/${classItem.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (onDeleteSuccess) {
        onDeleteSuccess(classItem.id);
      }
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
            >
              Delete Class
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
