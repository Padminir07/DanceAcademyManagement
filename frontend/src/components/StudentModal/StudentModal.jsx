import "./StudentModal.css";
import { useState, useEffect } from "react";
import api from "../../services/api";

function StudentModal({
  isOpen,
  onClose,
  fetchStudents,
  selectedStudent,
}) {
    const [formData, setFormData] = useState({
    student_name: "",
    parent_name: "",
    phone: "",
    date_of_birth: "",
    gender: "Female",
    address: "",
    joining_date: "",
    monthly_fee: "",
    batch: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
  if (selectedStudent) {
    setFormData({
      student_name: selectedStudent.student_name,
      parent_name: selectedStudent.parent_name,
      phone: selectedStudent.phone,
      date_of_birth: selectedStudent.date_of_birth,
      gender: selectedStudent.gender,
      address: selectedStudent.address,
      joining_date: selectedStudent.joining_date,
      monthly_fee: selectedStudent.monthly_fee,
      batch: selectedStudent.batch,
    });
  } else {
    setFormData({
      student_name: "",
      parent_name: "",
      phone: "",
      date_of_birth: "",
      gender: "Female",
      address: "",
      joining_date: "",
      monthly_fee: "",
      batch: "",
    });
  }
}, [selectedStudent]);
  const handleSubmit = async () => {
  try {
    if (selectedStudent) {
      // UPDATE
      await api.put(
        `/students/${selectedStudent.id}`,
        formData
      );

      alert("Student updated successfully!");
    } else {
      // ADD
      await api.post(
        "/students/",
        formData
      );

      alert("Student added successfully!");
    }

    fetchStudents();
    onClose();
  } catch (error) {
    console.error(error);
    alert("Operation failed!");
  }
};

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>Add Student</h2>

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
              <label>Student Name</label>
              <input
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Parent Name</label>
              <input
                type="text"
                name="parent_name"
                value={formData.parent_name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Joining Date</label>
              <input
                type="date"
                name="joining_date"
                value={formData.joining_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <textarea
                rows="3"
                name="address"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label>Monthly Fee</label>
              <input
                type="number"
                name="monthly_fee"
                value={formData.monthly_fee}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Batch</label>
              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
              >
                <option value="">Select Batch</option>
                <option value="Thursday & Friday 5 PM - 6 PM">
                  Thursday & Friday 5 PM - 6 PM
                </option>
                <option value="Thursday & Friday 6 PM - 7 PM">
                  Thursday & Friday 6 PM - 7 PM
                </option>
                <option value="Saturday & Sunday 5 PM - 6 PM">
                  Saturday & Sunday 5 PM - 6 PM
                </option>
                <option value="Saturday & Sunday 6 PM - 7 PM">
                  Saturday & Sunday 6 PM - 7 PM
                </option>
              </select>
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
  Save Student
</button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default StudentModal;