import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";

import Students from "./pages/Students";
import MonthlyFees from "./pages/MonthlyFees";
import Payments from "./pages/Payments";
import Attendance from "./pages/Attendance";
import AttendanceReport from "./pages/AttendanceReport";
import Events from "./pages/Events";
import EventFees from "./pages/EventFees";
import Exams from "./pages/Exams";
import ExamFees from "./pages/ExamFees";
import FeeEnquiry from "./pages/FeeEnquiry";
import Login from "./pages/Login";

function App() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#FFF9F2",
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/monthly-fees" element={<MonthlyFees />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route
            path="/attendance-report"
            element={<AttendanceReport />}
          />
          <Route path="/events" element={<Events />} />
          <Route path="/event-fees" element={<EventFees />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exam-fees" element={<ExamFees />} />
          <Route path="/fee-enquiry" element={<FeeEnquiry />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;