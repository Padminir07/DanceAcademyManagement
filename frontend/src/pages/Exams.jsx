import "./Students.css";
import { useEffect, useState } from "react";
import api from "../services/api";
import ExamModal from "../components/ExamModal/ExamModal";

function Exams() {
  const [exams, setExams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get("/exams");
      setExams(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExam = async (id) => {
    if (!window.confirm("Delete this exam?")) return;

    try {
      await api.delete(`/exams/${id}`);
      alert("Exam deleted successfully!");
      fetchExams();
    } catch (error) {
      console.error(error);
      alert("Failed to delete exam.");
    }
  };

  return (
    <div className="students-page">

      <div className="students-header">
        <h1>Exams</h1>

        <button
          className="add-btn"
          onClick={() => {
            setSelectedExam(null);
            setIsModalOpen(true);
          }}
        >
          + Add Exam
        </button>
      </div>

      <div className="students-table">
        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Exam Name</th>
              <th>Date</th>
              <th>Fee</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {exams.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Exams Found
                </td>
              </tr>
            ) : (
              exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.id}</td>
                  <td>{exam.exam_name}</td>
                  <td>{exam.exam_date}</td>
                  <td>₹ {exam.exam_fee}</td>
                  <td>{exam.remarks}</td>

                  <td>

                    <button
                      onClick={() => {
                        setSelectedExam(exam);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => deleteExam(exam.id)}
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))
            )}

          </tbody>

        </table>
      </div>

      <ExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchExams={fetchExams}
        selectedExam={selectedExam}
      />

    </div>
  );
}

export default Exams;