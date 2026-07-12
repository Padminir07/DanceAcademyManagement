import "./Students.css";
import { useEffect, useState } from "react";
import api from "../services/api";
import StudentModal from "../components/StudentModal/StudentModal";

function Students() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [searchName, searchPhone]);

  const fetchStudents = async () => {
    try {
      let url = "/students";

      if (searchName || searchPhone) {
        url = `/students/search?name=${searchName}&phone=${searchPhone}`;
      }

      const response = await api.get(url);
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/students/${id}`);

      alert("Student deleted successfully!");

      fetchStudents();
    } catch (error) {
      console.error(error);
      alert("Failed to delete student!");
    }
  };

  return (
    <div className="students-page">

      <div className="students-header">
        <h1>Students</h1>

        <button
          className="add-btn"
          onClick={() => {
            setSelectedStudent(null);
            setIsModalOpen(true);
          }}
        >
          + Add Student
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search by Phone"
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
      </div>

      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Parent Name</th>
              <th>Phone</th>
              <th>Batch</th>
              <th>Monthly Fee</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.student_name}</td>
                  <td>{student.parent_name}</td>
                  <td>{student.phone}</td>
                  <td>{student.batch}</td>
                  <td>₹ {student.monthly_fee}</td>

                  <td>
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(student.id)}
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

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        fetchStudents={fetchStudents}
        selectedStudent={selectedStudent}
      />

    </div>
  );
}

export default Students;