import { useEffect, useState } from "react";
import api from "../services/api";
import "./AttendanceReport.css";

function AttendanceReport() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");

  const [month, setMonth] = useState(
    new Date().getMonth() + 1
  );

  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getReport = async () => {
    if (!studentId) {
      alert("Select Student");
      return;
    }

    try {
      const response = await api.get(
        `/attendance/summary?student_id=${studentId}&month=${month}&year=${year}`
      );

      setReport(response.data);
    } catch (error) {
      console.error(error);

      alert("No attendance found");
    }
  };

  return (
    <div className="attendance-report-page">

      <div>
       <h1 className="attendance-title">
  Attendance Report
</h1>
      </div>

     <div className="report-filters">
      

        <select
          value={studentId}
          onChange={(e) =>
            setStudentId(e.target.value)
          }
        >
          <option value="">
            Select Student
          </option>

          {students.map((student) => (
            <option
              key={student.id}
              value={student.id}
            >
              {student.student_name}
            </option>
          ))}
        </select>

      <select
  value={month}
  onChange={(e) => setMonth(e.target.value)}
>
  <option value="1">January</option>
  <option value="2">February</option>
  <option value="3">March</option>
  <option value="4">April</option>
  <option value="5">May</option>
  <option value="6">June</option>
  <option value="7">July</option>
  <option value="8">August</option>
  <option value="9">September</option>
  <option value="10">October</option>
  <option value="11">November</option>
  <option value="12">December</option>
</select>

    <select
  value={year}
  onChange={(e) => setYear(e.target.value)}
>
  <option>2025</option>
  <option>2026</option>
  <option>2027</option>
  <option>2028</option>
  <option>2029</option>
</select>
        <button
  className="report-btn"
  onClick={getReport}
>
  Get Report
</button>

      </div>

      {report && (
  <>
    <div className="student-name-card">
      <h2>{report.student_name}</h2>
    </div>

    <div className="summary-grid">

      <div className="summary-card">
        <h3>📚 Total Classes</h3>
        <h1>{report.total_classes}</h1>
      </div>

      <div className="summary-card">
        <h3>✅ Present</h3>
        <h1>{report.present}</h1>
      </div>

      <div className="summary-card">
        <h3>❌ Absent</h3>
        <h1>{report.absent}</h1>
      </div>

      <div className="summary-card">
       <h3>📈 Attendance %</h3>
        <h1>{report.attendance_percentage}%</h1>
      </div>

    </div>
  </>
)}

    </div>
  );
}

export default AttendanceReport;