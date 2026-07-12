import "./Students.css";
import { useEffect, useState } from "react";
import api from "../services/api";
import PaymentModal from "../components/PaymentModal/PaymentModal";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get("/payments");
      console.log(response.data);
setPayments(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this payment?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/payments/${id}`);

    alert("Payment deleted successfully!");

    fetchPayments();
  } catch (error) {
    console.error(error);
    alert("Failed to delete payment!");
  }
};
  return (
    <div className="students-page">

      <div className="students-header">
        <h1>Payments</h1>

        <button
          className="add-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Payment
        </button>
      </div>

      <div className="students-table">
        <table>

          <thead>
            <tr>
              <th>ID</th>
<th>Student</th>
<th>Month</th>
<th>Year</th>
<th>Amount Paid</th>
<th>Payment Date</th>
<th>Payment Mode</th>
<th>Remarks</th>
<th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {payments.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No Payments Found
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
<td>{payment.student_name}</td>
<td>{payment.month}</td>
<td>{payment.year}</td>
<td>₹ {payment.amount_paid}</td>
<td>{payment.payment_date}</td>
<td>{payment.payment_mode}</td>
<td>{payment.remarks}</td>
<td>
  <button
    onClick={() => handleDelete(payment.id)}
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

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchPayments={fetchPayments}
      />

    </div>
  );
}

export default Payments;