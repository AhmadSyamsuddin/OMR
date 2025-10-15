import React from "react";
import { NavLink } from "react-router";
// import HomePage.css
import "../HomePage.css";


export default function HomePage() {
  return (
    <div className="home-hero min-vh-100 d-flex align-items-center">
      <div className="container py-5">
        <div className="home-overlay rounded-4 p-4 p-md-5">
          {/* Headline */}
          <div className="mb-4 text-center text-md-start">
            <h1 className="text-white fw-semibold m-0">Elevate Your Training</h1>
            <small className="text-secondary">
              Choose your path. Commit to the process. Become your best.
            </small>
          </div>

          {/* Cards */}
          <div className="row g-3 g-md-4">
            <div className="col-12 col-md-6">
              <NavLink to="/classes" className="text-decoration-none d-block">
                <div className="card-section card-classes position-relative rounded-4 overflow-hidden shadow border card-hover">
                  <div className="card-overlay position-absolute top-0 start-0 w-100 h-100">
                    <div className="position-absolute bottom-0 start-0 end-0 p-4 p-md-5">
                      <h2 className="text-white fw-semibold mb-1">Workout Classes</h2>
                      <p className="text-secondary mb-0">
                        Coach-led sessions • Fixed schedules • Team energy
                      </p>
                    </div>
                  </div>
                </div>
              </NavLink>
            </div>

            <div className="col-12 col-md-6">
              <NavLink to="/programs" className="text-decoration-none d-block">
                <div className="card-section card-programs position-relative rounded-4 overflow-hidden shadow border card-hover">
                  <div className="card-overlay position-absolute top-0 start-0 w-100 h-100">
                    <div className="position-absolute bottom-0 start-0 end-0 p-4 p-md-5">
                      <h2 className="text-white fw-semibold mb-1">Workout Programs</h2>
                      <p className="text-secondary mb-0">
                        AI-tailored plans • Weekly structure 
                      </p>
                    </div>
                  </div>
                </div>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
