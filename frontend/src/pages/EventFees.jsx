import "./Students.css";
import { useEffect, useState } from "react";
import api from "../services/api";
import StudentEventFeeModal from "../components/StudentEventFeeModal/StudentEventFeeModal";
import EventPaymentModal from "../components/EventPaymentModal/EventPaymentModal";
import EventPaymentHistoryModal from "../components/EventPaymentHistoryModal/EventPaymentHistoryModal";
function EventFees() {
  const [eventFees, setEventFees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedFee, setSelectedFee] = useState(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    fetchEventFees();
  }, []);

  const fetchEventFees = async () => {
    try {
      const response = await api.get("/student-event-fees");
      setEventFees(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="students-page">
      <div className="students-header">
        <h1>Event Fees</h1>

        <button
          className="add-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Assign Event
        </button>
      </div>

      <div className="students-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Event</th>
              <th>Fee</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {eventFees.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center" }}
                >
                  No Event Fees Found
                </td>
              </tr>
            ) : (
              eventFees.map((fee) => (
                <tr key={fee.id}>
                  <td>{fee.id}</td>
                  <td>{fee.student_name}</td>
                  <td>{fee.event_name}</td>
                  <td>₹ {fee.event_fee}</td>
                  <td>₹ {fee.total_paid}</td>
                  <td>₹ {fee.remaining_amount}</td>
                  <td>{fee.status}</td>

           <td>
  <button
    onClick={() => {
      setSelectedFee(fee);
      setIsPaymentModalOpen(true);
    }}
  >
    Pay
  </button>

  <button
    style={{ marginLeft: "10px" }}
    onClick={() => {
      setSelectedFee(fee);
      setIsHistoryModalOpen(true);
    }}
  >
    History
  </button>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <StudentEventFeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchEventFees={fetchEventFees}
      />

      <EventPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        selectedFee={selectedFee}
        fetchEventFees={fetchEventFees}
      />
      <EventPaymentHistoryModal
  isOpen={isHistoryModalOpen}
  onClose={() => setIsHistoryModalOpen(false)}
  selectedFee={selectedFee}
/>
    </div>
  );
}

export default EventFees;