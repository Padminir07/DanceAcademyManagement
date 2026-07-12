import "./Dashboard.css";
import { useEffect, useState } from "react";
import api from "../../services/api";

import StatCard from "../Cards/StatCard";
import dancer from "../../assets/dancer.png";

function Dashboard() {
  const [stats, setStats] = useState({
    total_students: 0,
    today_attendance: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard">

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>

          <p>
            Welcome to NPNK Bharatanatyam Class Management System
          </p>
        </div>

        <img
          src={dancer}
          alt="Dancer"
          className="dashboard-dancer"
        />

      </div>

      <div className="cards">

  <StatCard
    title="Total Students"
    value={stats.total_students}
    color="#3b82f6"
  />

  <StatCard
    title="Today's Attendance"
    value={stats.today_attendance}
    color="#10b981"
  />

  <StatCard
    title="Total Events"
    value={stats.total_events}
    color="#f59e0b"
  />

  <StatCard
    title="Total Exams"
    value={stats.total_exams}
    color="#ef4444"
  />

</div>

    </div>
  );
}

export default Dashboard;