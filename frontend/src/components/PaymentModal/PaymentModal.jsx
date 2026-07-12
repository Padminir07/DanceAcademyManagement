import "./PaymentModal.css";
import { useEffect, useState } from "react";
import api from "../../services/api";

function PaymentModal({
  isOpen,
  onClose,
  fetchPayments,
}) {
  const [fees, setFees] = useState([]);

  const [formData, setFormData] = useState({
    monthly_fee_id: "",
    amount_paid: "",
    payment_date: new Date().toISOString().split("T")[0],
    payment_mode: "Cash",
    remarks: "",
  });

  useEffect(() => {
    fetchMonthlyFees();
  }, []);

  const fetchMonthlyFees = async () => {
    try {
      const response = await api.get("/monthly-fees");
      setFees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      await api.post("/payments/", formData);

      alert("Payment Added Successfully!");

      fetchPayments();

      onClose();

      setFormData({
        monthly_fee_id: "",
        amount_paid: "",
        payment_date: new Date().toISOString().split("T")[0],
        payment_mode: "Cash",
        remarks: "",
      });

    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("Failed to add payment!");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="modal">

        <div className="modal-header">
          <h2>Add Payment</h2>

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
              <label>Monthly Fee</label>

              <select
                value={formData.monthly_fee_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthly_fee_id: Number(e.target.value),
                  })
                }
              >
                <option value="">
                  Select Monthly Fee
                </option>

                {fees.map((fee) => (
                  <option
                    key={fee.id}
                    value={fee.id}
                  >
                    {fee.student_name} - {fee.month} ({fee.year})
                  </option>
                ))}

              </select>
            </div>

            <div className="form-group">
              <label>Amount Paid</label>

              <input
                type="number"
                value={formData.amount_paid}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount_paid: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Payment Date</label>

              <input
                type="date"
                value={formData.payment_date}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment_date: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Payment Mode</label>

              <select
                value={formData.payment_mode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment_mode: e.target.value,
                  })
                }
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Remarks</label>

              <textarea
                rows="3"
                value={formData.remarks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    remarks: e.target.value,
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
              Save Payment
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default PaymentModal;