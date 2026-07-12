import "./ExamModal.css";
import { useState, useEffect } from "react";
import api from "../../services/api";

function ExamModal({
  isOpen,
  onClose,
  fetchExams,
  selectedExam,
}) {
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examFee, setExamFee] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    if (selectedExam) {
      setExamName(selectedExam.exam_name);
      setExamDate(selectedExam.exam_date);
      setExamFee(selectedExam.exam_fee);
      setRemarks(selectedExam.remarks);
    } else {
      setExamName("");
      setExamDate("");
      setExamFee("");
      setRemarks("");
    }
  }, [selectedExam]);

  if (!isOpen) return null;

  const saveExam = async () => {
    try {
      if (selectedExam) {
        await api.put(`/exams/${selectedExam.id}`, {
          exam_name: examName,
          exam_date: examDate,
          exam_fee: Number(examFee),
          remarks: remarks,
        });

        alert("Exam updated successfully!");
      } else {
        await api.post("/exams", {
          exam_name: examName,
          exam_date: examDate,
          exam_fee: Number(examFee),
          remarks: remarks,
        });

        alert("Exam added successfully!");
      }

      fetchExams();
      onClose();
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Something went wrong!");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>{selectedExam ? "Edit Exam" : "Add Exam"}</h2>

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
              <label>Exam Name</label>

              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Exam Date</label>

              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Exam Fee</label>

              <input
                type="number"
                value={examFee}
                onChange={(e) => setExamFee(e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label>Remarks</label>

              <textarea
                rows="3"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
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
              onClick={saveExam}
            >
              {selectedExam ? "Update Exam" : "Save Exam"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ExamModal;