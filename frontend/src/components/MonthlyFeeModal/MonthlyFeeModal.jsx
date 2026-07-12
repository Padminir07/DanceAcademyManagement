import "./MonthlyFeeModal.css";
import { useEffect, useState } from "react";
import api from "../../services/api";

function MonthlyFeeModal({
  isOpen,
  onClose,
  fetchFees,
  selectedFee,
}) {
  const [students, setStudents] = useState([]);

  const [formData, setFormData] = useState({
    student_id: "",
    year: new Date().getFullYear(),
    month: "January",
    monthly_fee: "",
  });

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
  useEffect(() => {
  if (selectedFee) {
    setFormData({
      student_id: selectedFee.student_id,
      year: selectedFee.year,
      month: selectedFee.month,
      monthly_fee: selectedFee.monthly_fee,
    });
  } else {
    setFormData({
      student_id: "",
      year: new Date().getFullYear(),
      month: "January",
      monthly_fee: "",
    });
  }
}, [selectedFee]);

  const handleSubmit = async () => {
  try {
    if (selectedFee) {
      await api.put(
        `/monthly-fees/${selectedFee.id}`,
        formData
      );

      alert("Monthly Fee Updated Successfully!");
    } else {
      await api.post(
        "/monthly-fees/",
        formData
      );

      alert("Monthly Fee Added Successfully!");
    }

    fetchFees();

    onClose();
  } catch (error) {
    console.error(error);

    if (error.response) {
      alert(error.response.data.detail);
    } else {
      alert("Operation Failed!");
    }
  }
};
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>
  {selectedFee ? "Edit Monthly Fee" : "Add Monthly Fee"}
</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">

          <div className="form-grid">

            {/* Student */}
            <div className="form-group">
              <label>Student</label>

              <select
                name="student_id"
                value={formData.student_id}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);

                  const student = students.find(
                    (s) => s.id === selectedId
                  );

                  setFormData({
                    ...formData,
                    student_id: selectedId,
                    monthly_fee: student
                      ? student.monthly_fee
                      : "",
                  });
                }}
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

            {/* Year */}
            <div className="form-group">
              <label>Year</label>

              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year: e.target.value,
                  })
                }
              />
            </div>

            {/* Month */}
            <div className="form-group">
              <label>Month</label>

              <select
                name="month"
                value={formData.month}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    month: e.target.value,
                  })
                }
              >
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
            </div>

            {/* Monthly Fee */}
            <div className="form-group">
              <label>Monthly Fee</label>

              <input
                type="number"
                name="monthly_fee"
                value={formData.monthly_fee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthly_fee: e.target.value,
                  })
                }
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
  onClick={handleSubmit}
>
  {selectedFee ? "Update Fee" : "Save Fee"}
</button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default MonthlyFeeModal;