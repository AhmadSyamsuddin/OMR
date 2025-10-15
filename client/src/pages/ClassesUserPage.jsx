import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserClasses } from "../store/userClassesSlice";
import UserClassList from '../components/UserClassList';
import { NavLink } from 'react-router';

export default function ClassesUserPage() {
  const dispatch = useDispatch();
  const { items: classes, loading, error } = useSelector((state) => state.userClasses);

  useEffect(() => {
    dispatch(fetchUserClasses());
  }, [dispatch]);

  const handleDeleteSuccess = (deletedId) => {
    // Redux will automatically update the state after delete
    console.log("Class deleted successfully:", deletedId);
  };

  return (
    <div className="bg-black min-vh-100 py-5">
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* Header + Page Nav */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4">
          <div>
            <h1 className="text-white fw-semibold m-0">My Classes</h1>
            <small className="text-secondary">
              Classes you have joined
            </small>
          </div>
          <div className="mt-3 mt-md-0 d-flex gap-2">
            <NavLink
              to="/classes"
              end
              className={({ isActive }) =>
                isActive ? "btn btn-danger" : "btn btn-outline-danger"
              }
            >
              All Classes
            </NavLink>
            <NavLink
              to="/classes/joined"
              className={({ isActive }) =>
                isActive ? "btn btn-danger" : "btn btn-outline-danger"
              }
            >
              Joined Classes
            </NavLink>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-secondary py-5">
            <div className="spinner-border text-light mb-3" role="status" />
            <div>Loading your classes…</div>
          </div>
        ) : (
          <div className="row g-4">
            {classes.length ? (
              classes.map((item) => (
                <div key={item.WorkoutClass.id} className="col-12 col-md-6 col-lg-4">
                  <UserClassList
                    classItem={item.WorkoutClass}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </div>
              ))
            ) : (
              <div className="text-center text-secondary py-5 w-100">
                <div className="mb-3">
                  <i className="bi bi-calendar-x" style={{ fontSize: "3rem", opacity: 0.5 }}></i>
                </div>
                <p>You haven't joined any classes yet.</p>
                <NavLink to="/classes" className="btn btn-danger mt-2">
                  Browse Classes
                </NavLink>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}