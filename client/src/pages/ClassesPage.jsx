import axios from "axios";
import React, { useEffect, useState } from "react";
import ClassList from "../components/ClassList";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  async function fetchClasses() {
    try {
      const { data } = await axios.get("http://localhost:3000/workout-classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setClasses(data.classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  }

  async function fetchJoinedClasses() {
    try {
      const { data } = await axios.get("http://localhost:3000/joined-classes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJoinedClasses(data.classes);
    } catch (error) {
      console.error("Error fetching joined classes:", error);
    }
  }

  useEffect(() => {
    fetchClasses();
    fetchJoinedClasses();
  }, []);

  const displayedClasses = activeTab === "all" ? classes : joinedClasses;

  return (
    <div className="bg-black min-vh-100 py-5">
      <div className="container" style={{ maxWidth: 1200 }}>
        {/* Page Header */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-4">
          <div>
            <h1 className="text-white fw-semibold m-0">Workout Classes</h1>
            <small className="text-secondary">
              Choose from the best sessions or check your joined classes
            </small>
          </div>

          {/* Tabs */}
          <div className="mt-3 mt-md-0">
            <div className="btn-group">
              <button
                className={`btn ${
                  activeTab === "all" ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Classes
              </button>
              <button
                className={`btn ${
                  activeTab === "joined" ? "btn-danger" : "btn-outline-danger"
                }`}
                onClick={() => setActiveTab("joined")}
              >
                Joined Classes
              </button>
            </div>
          </div>
        </div>

        {/* Class List */}
        <div className="row g-4">
          {displayedClasses.length > 0 ? (
            displayedClasses.map((classItem) => (
              <div key={classItem.id} className="col-12 col-md-6 col-lg-4">
                <ClassList classItem={classItem} />
              </div>
            ))
          ) : (
            <div className="text-center text-secondary py-5">
              No classes found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
