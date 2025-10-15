import axios from 'axios';
import React, { useEffect, useState } from 'react'
import UserClassList from '../components/UserClassList';
import { NavLink } from 'react-router';

export default function ClassesUserPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchClasses() {
    try {
      const { data } = await axios.get("http://localhost:3000/workout-classes-user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setClasses(data.classes || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteSuccess = (deletedId) => {
    // Remove deleted class from state
    setClasses((prevClasses) =>
      prevClasses.filter((item) => item.WorkoutClass.id !== deletedId)
    );
  };

  useEffect(() => {
    fetchClasses();
  }, []);

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
        {loading ? (
          <div className="text-center text-secondary py-5">
            <div className="spinner-border text-light mb-3" role="status" />
            <div>Loading classes…</div>
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
                No classes found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
