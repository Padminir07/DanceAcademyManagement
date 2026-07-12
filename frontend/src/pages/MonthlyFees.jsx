import "./Students.css";
import { useEffect, useState } from "react";
import api from "../services/api";
import MonthlyFeeModal from "../components/MonthlyFeeModal/MonthlyFeeModal";

function MonthlyFees() {
  const [fees, setFees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const response = await api.get("/monthly-fees");
      setFees(response.data);
    } catch (error) {
      console.error(error);
    }
  };
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this Monthly Fee?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/monthly-fees/${id}`);

    alert("Monthly Fee deleted successfully!");

    fetchFees();
  } catch (error) {
    console.error(error);
    alert("Failed to delete Monthly Fee!");
  }
};
  return (
    <div className="students-page">

      <div className="students-header">
        <h1>Monthly Fees</h1>

        <button
          className="add-btn"
onClick={() => {
  setSelectedFee(null);
  setIsModalOpen(true);
}}        >
          + Add Monthly Fee
        </button>
      </div>

      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Year</th>
              <th>Month</th>
              <th>Monthly Fee</th>
              <th>Total Paid</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {fees.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No Monthly Fees Found
                </td>
              </tr>
            ) : (
              fees.map((fee) => (
                <tr key={fee.id}>
                  <td>{fee.id}</td>
                  <td>{fee.student_name}</td>
                  <td>{fee.year}</td>
                  <td>{fee.month}</td>
                  <td>₹ {fee.monthly_fee}</td>
                  <td>₹ {fee.total_paid}</td>
                  <td>₹ {fee.remaining_amount}</td>
                  <td>{fee.status}</td>

                  <td>
                    <button
  onClick={() => {
    setSelectedFee(fee);
    setIsModalOpen(true);
  }}
>
  Edit
</button>
                    <button
  onClick={() => handleDelete(fee.id)}
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

    <MonthlyFeeModal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setSelectedFee(null);
  }}
  fetchFees={fetchFees}
  selectedFee={selectedFee}
/>

    </div>
  );
}

export default MonthlyFees;