import React from "react";
import "../ProgramCard.css";

export default function ProgramCard({ program }) {
  return (
    <div className="program-card card border-0 rounded-4 overflow-hidden h-100 shadow-sm card-hover">
      <div
        className="program-card-cover position-relative"
        style={{ backgroundImage: `url("${program.image}")` }}
      >
        {/* Overlay */}
        <div className="program-card-overlay position-absolute top-0 start-0 w-100 h-100"></div>

        {/* Content */}
        <div className="program-card-content position-absolute bottom-0 start-0 end-0 p-4">
          <h5 className="program-title text-uppercase text-white fw-bold mb-2">
            {program.name}
          </h5>
          <div className="title-accent"></div>
        </div>
      </div>
    </div>
  );
}
