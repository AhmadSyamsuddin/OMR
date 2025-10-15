import React from "react";
import "../ClassList.css";

export default function ClassList({ classItem }) {
  return (
    <div className="class-card card border-0 rounded-4 overflow-hidden shadow-sm card-hover text-white">
      <div
        className="class-background position-relative"
        style={{
          backgroundImage: `url(${classItem.coachProfilePictureUrl || "https://via.placeholder.com/800x600"})`,
        }}
      >
        {/* Overlay */}
        <div className="class-overlay position-absolute top-0 start-0 w-100 h-100"></div>

        {/* Content */}
        <div className="position-absolute bottom-0 start-0 end-0 p-4">
          <h5 className="fw-bold mb-1 text-uppercase">{classItem.name}</h5>
          <p className="text-secondary small mb-1">
            Coach: <span className="text-white">{classItem.coach}</span>
          </p>
          <p className="text-secondary small mb-1">
            Duration: {classItem.duration} min
          </p>
          <p className="text-secondary small mb-0">
            Day: {classItem.day} • Quota: {classItem.quota}
          </p>
        </div>
      </div>
    </div>
  );
}
