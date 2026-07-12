import "./Students.css";
import { useState } from "react";
import api from "../services/api";

function Attendance() {
  const [batch, setBatch] = useState("");

  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [students, setStudents] = useState([]);

  // Load students
  const fetchStudents = async () => {
    if (!batch) {
      alert("Please select a batch");
      return;
    }

    try {
      const response = await api.get(
        `/students/by-batch?batch=${encodeURIComponent(batch)}`
      );

      const attendanceList = response.data.map((student) => ({
        student_id: student.id,
        student_name: student.student_name,
        status: "Present",
        remarks: "",
      }));

      setStudents(attendanceList);
    } catch (error) {
      console.error(error);
      alert("Failed to load students!");
    }
  };

  // Save attendance
  const saveAttendance = async () => {
    try {
      await api.post("/attendance/bulk", {
        attendance_date: attendanceDate,
        students: students,
      });

      alert("Attendance saved successfully!");

      setStudents([]);
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Failed to save attendance!");
      }
    }
  };

  return (
    <div className="students-page">

      <div className="students-header">
        <h1>Attendance</h1>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <input
          type="date"
          value={attendanceDate}
          onChange={(e) =>
            setAttendanceDate(e.target.value)
          }
        />

        <select
          value={batch}
          onChange={(e) =>
            setBatch(e.target.value)
          }
        >
          <option value="">Select Batch</option>

          <option>Thursday & Friday 5 PM - 6 PM</option>
          <option>Thursday & Friday 6 PM - 7 PM</option>
          <option>Saturday & Sunday 5 PM - 6 PM</option>
          <option>Saturday & Sunday 6 PM - 7 PM</option>
        </select>

        <button
          className="add-btn"
          onClick={fetchStudents}
        >
          Load Students
        </button>

        <button
          className="add-btn"
          onClick={saveAttendance}
          disabled={students.length === 0}
        >
          Save Attendance
        </button>
      </div>

      {/* Table */}
      <div className="students-table">
        <table>

          <thead>
            <tr>
              <th>Student</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>

          <tbody>

            {students.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  style={{ textAlign: "center" }}
                >
                  No Students Loaded
                </td>
              </tr>
            ) : (
              students.map((student, index) => (
                <tr key={student.student_id}>

                  <td>{student.student_name}</td>

                  <td>

                    <button
                      onClick={() => {
                        const updated = [...students];
                        updated[index].status = "Present";
                        setStudents(updated);
                      }}
                      style={{
                        background:
                          student.status === "Present"
                            ? "#22c55e"
                            : "#e5e7eb",
                        color:
                          student.status === "Present"
                            ? "white"
                            : "black",
                        marginRight: "10px",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Present
                    </button>

                    <button
                      onClick={() => {
                        const updated = [...students];
                        updated[index].status = "Absent";
                        setStudents(updated);
                      }}
                      style={{
                        background:
                          student.status === "Absent"
                            ? "#ef4444"
                            : "#e5e7eb",
                        color:
                          student.status === "Absent"
                            ? "white"
                            : "black",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Absent
                    </button>

                  </td>

                  <td>
                    <input
                      type="text"
                      placeholder="Remarks"
                      value={student.remarks}
                      onChange={(e) => {
                        const updated = [...students];
                        updated[index].remarks = e.target.value;
                        setStudents(updated);
                      }}
                    />
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>
      </div>

    </div>
  );
}

export default Attendance;