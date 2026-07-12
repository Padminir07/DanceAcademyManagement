import "./EventPaymentHistoryModal.css";
import { useEffect, useState } from "react";
import api from "../../services/api";
function EventPaymentHistoryModal({
    isOpen,
    onClose,
    selectedFee,
}){
  if (!isOpen) return null;
  const [payments, setPayments] = useState([]);

useEffect(() => {
    if (isOpen && selectedFee) {
        fetchHistory();
    }
}, [isOpen, selectedFee]);

const fetchHistory = async () => {
    try {
        const response = await api.get(
            `/event-payments/${selectedFee.id}`
        );

        setPayments(response.data);

    } catch (error) {
        console.error(error);
    }
};

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>Event Payment History</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-body">

          <div style={{ marginBottom: "20px" }}>
  <h3>Student : {selectedFee?.student_name}</h3>
  <h3>Event : {selectedFee?.event_name}</h3>
</div>

<hr />

{payments.length === 0 ? (

  <p>No Payments Found</p>

) : (

  payments.map((payment) => (

    <div
      key={payment.id}
      style={{
        margin: "20px 0",
        paddingBottom: "15px",
        borderBottom: "1px solid #ddd",
      }}
    >

      <p><strong>Amount :</strong> ₹ {payment.amount_paid}</p>

      <p><strong>Date :</strong> {payment.payment_date}</p>

      <p><strong>Mode :</strong> {payment.payment_mode}</p>

      <p><strong>Remarks :</strong> {payment.remarks || "-"}</p>

    </div>

  ))

)}

<hr />

<div style={{ marginTop: "20px" }}>

  <p><strong>Total Paid :</strong> ₹ {selectedFee?.total_paid}</p>

  <p><strong>Remaining :</strong> ₹ {selectedFee?.remaining_amount}</p>

  <p><strong>Status :</strong> {selectedFee?.status}</p>

</div>

          <div className="modal-buttons">
            <button
              className="cancel-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default EventPaymentHistoryModal;