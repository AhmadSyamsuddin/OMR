import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClasses } from "../store/classesSlice";
import { NavLink } from "react-router";
import ClassList from "../components/ClassList";

export default function ClassesPage() {
  const dispatch = useDispatch();
  const { items: classes, loading, error } = useSelector((state) => state.classes);

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  return (
    <div className="bg-black min-vh-100 py-5">
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* Header + Page Nav */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4">
          <div>
            <h1 className="text-white fw-semibold m-0">Workout Classes</h1>
            <small className="text-secondary">
              Browse all available sessions
            </small>
          </div>

          {/* Pindah halaman, bukan tab */}
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

        {/* List */}
        {loading ? (
          <div className="text-center text-secondary py-5">
            <div className="spinner-border text-light mb-3" role="status" />
            <div>Loading classes…</div>
          </div>
        ) : (
          <div className="row g-4">
            {classes.length ? (
              classes.map((classItem) => (
                <div key={classItem.id} className="col-12 col-md-6 col-lg-4">
                  <ClassList classItem={classItem} />
                </div>
              ))
            ) : (
              <div className="text-center text-secondary py-5 w-100">
                No classes found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}