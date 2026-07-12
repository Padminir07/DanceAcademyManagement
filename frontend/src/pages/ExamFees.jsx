import "./Students.css";
import { useEffect, useState } from "react";
import api from "../services/api";

import StudentExamFeeModal from "../components/StudentExamFeeModal/StudentExamFeeModal";
import ExamPaymentModal from "../components/ExamPaymentModal/ExamPaymentModal";
import ExamPaymentHistoryModal from "../components/ExamPaymentHistoryModal/ExamPaymentHistoryModal";

function ExamFees() {
  const [examFees, setExamFees] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedFee, setSelectedFee] = useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  useEffect(() => {
    fetchExamFees();
  }, []);

  const fetchExamFees = async () => {
    try {
      const response = await api.get("/student-exam-fees");
      setExamFees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="students-page">

      <div className="students-header">
        <h1>Exam Fees</h1>

        <button
          className="add-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Assign Exam
        </button>
      </div>

      <div className="students-table">
        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Exam</th>
              <th>Fee</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {examFees.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center" }}
                >
                  No Exam Fees Found
                </td>
              </tr>
            ) : (
              examFees.map((fee) => (
                <tr key={fee.id}>

                  <td>{fee.id}</td>

                  <td>{fee.student_name}</td>

                  <td>{fee.exam_name}</td>

                  <td>₹ {fee.exam_fee}</td>

                  <td>₹ {fee.total_paid}</td>

                  <td>₹ {fee.remaining_amount}</td>

                  <td>{fee.status}</td>

                  <td>

                    <button
                      onClick={() => {
                        setSelectedFee(fee);
                        setIsPaymentModalOpen(true);
                      }}
                    >
                      Pay
                    </button>

                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => {
                        setSelectedFee(fee);
                        setIsHistoryModalOpen(true);
                      }}
                    >
                      History
                    </button>

                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>
      </div>

      <StudentExamFeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchExamFees={fetchExamFees}
      />

      <ExamPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedFee={selectedFee}
        fetchExamFees={fetchExamFees}
      />

      <ExamPaymentHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        selectedFee={selectedFee}
      />

    </div>
  );
}

export default ExamFees;