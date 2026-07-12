import "./ExamPaymentModal.css";
import { useState } from "react";
import api from "../../services/api";

function ExamPaymentModal({
  isOpen,
  onClose,
  selectedFee,
  fetchExamFees,
}) {

  const [amountPaid, setAmountPaid] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [remarks, setRemarks] = useState("");

  if (!isOpen) return null;

  const savePayment = async () => {
    try {

      await api.post("/exam-payments", {
        student_exam_fee_id: selectedFee.id,
        amount_paid: Number(amountPaid),
        payment_date: paymentDate,
        payment_mode: paymentMode,
        remarks: remarks,
      });

      alert("Payment added successfully!");

      fetchExamFees();
      onClose();

      setAmountPaid("");
      setPaymentDate("");
      setPaymentMode("");
      setRemarks("");

    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Failed to add payment!");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>Exam Payment</h2>

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

              <input
                type="text"
                value={selectedFee?.student_name || ""}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Exam</label>

              <input
                type="text"
                value={selectedFee?.exam_name || ""}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Remaining Amount</label>

              <input
                type="number"
                value={selectedFee?.remaining_amount || ""}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Amount Paid</label>

              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Payment Date</label>

              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Payment Mode</label>

              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
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
              onClick={savePayment}
            >
              Save Payment
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ExamPaymentModal;