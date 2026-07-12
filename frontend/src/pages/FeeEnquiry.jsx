import "./Students.css";
import { useState } from "react";
import api from "../services/api";

function FeeEnquiry() {
  const [studentName, setStudentName] = useState("");
  const [result, setResult] = useState(null);

  const searchStudent = async () => {
    if (!studentName.trim()) {
      alert("Enter student name");
      return;
    }

    try {
      const response = await api.get("/pending-fees", {
        params: {
          student_name: studentName,
        },
      });

      setResult(response.data);

    } catch (error) {
      console.error(error);
      alert("Failed to fetch pending fees.");
    }
  };

  return (
    <div className="students-page">

      <div className="students-header">
        <h1>Fee Enquiry</h1>
      </div>

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "10px",
          marginTop: "20px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Enter Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
            }}
          />

          <button
            className="add-btn"
            onClick={searchStudent}
          >
            Search
          </button>
        </div>

        {result && (
          <div style={{ marginTop: "30px" }}>

            <h2>{result.student_name}</h2>

            <hr />

            <h3>Monthly Fees</h3>

            {result.monthly_fees.length === 0 ? (
              <p>No Pending Monthly Fees</p>
            ) : (
              result.monthly_fees.map((fee, index) => (
                <p key={index}>
                  {fee.month} {fee.year} — ₹ {fee.pending_amount}
                </p>
              ))
            )}

            <hr />

            <h3>Event Fees</h3>

            {result.event_fees.length === 0 ? (
              <p>No Pending Event Fees</p>
            ) : (
              result.event_fees.map((fee, index) => (
                <p key={index}>
                  {fee.event_name} — ₹ {fee.pending_amount}
                </p>
              ))
            )}

            <hr />

            <h3>Exam Fees</h3>

            {result.exam_fees.length === 0 ? (
              <p>No Pending Exam Fees</p>
            ) : (
              result.exam_fees.map((fee, index) => (
                <p key={index}>
                  {fee.exam_name} — ₹ {fee.pending_amount}
                </p>
              ))
            )}

            <hr />

            <h2>
              Total Pending : ₹ {result.total_pending}
            </h2>

          </div>
        )}

      </div>

    </div>
  );
}

export default FeeEnquiry;