import "./StudentExamFeeModal.css";
import { useEffect, useState } from "react";
import api from "../../services/api";

function StudentExamFeeModal({
  isOpen,
  onClose,
  fetchExamFees,
}) {
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [examId, setExamId] = useState("");
  const [examFee, setExamFee] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const loadData = async () => {
    try {
      const studentsRes = await api.get("/students");
      const examsRes = await api.get("/exams");

      setStudents(studentsRes.data);
      setExams(examsRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const assignExam = async () => {
    try {
      await api.post("/student-exam-fees", {
        student_id: Number(studentId),
        exam_id: Number(examId),
        exam_fee: Number(examFee),
      });

      alert("Exam assigned successfully!");

      fetchExamFees();
      onClose();

      setStudentId("");
      setExamId("");
      setExamFee("");

    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Failed to assign exam.");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>Assign Exam</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">

          <div className="form-grid">

            <div className="form-group">
              <label>Student</label>

              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              >
                <option value="">Select Student</option>

                {students.map((student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.student_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Exam</label>

              <select
                value={examId}
                onChange={(e) => {
                  setExamId(e.target.value);

                  const selected = exams.find(
                    (exam) => exam.id === Number(e.target.value)
                  );

                  if (selected) {
                    setExamFee(selected.exam_fee);
                  }
                }}
              >
                <option value="">Select Exam</option>

                {exams.map((exam) => (
                  <option
                    key={exam.id}
                    value={exam.id}
                  >
                    {exam.exam_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Exam Fee</label>

              <input
                type="number"
                value={examFee}
                readOnly
              />
            </div>

          </div>

          <div className="modal-buttons">

            <button
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="save-btn"
              onClick={assignExam}
            >
              Assign
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default StudentExamFeeModal;