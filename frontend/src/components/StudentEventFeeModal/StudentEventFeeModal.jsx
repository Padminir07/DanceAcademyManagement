import "./StudentEventFeeModal.css";
import { useEffect, useState } from "react";
import api from "../../services/api";

function StudentEventFeeModal({
  isOpen,
  onClose,
  fetchEventFees,
}){
  if (!isOpen) return null;
  const [students, setStudents] = useState([]);
const [events, setEvents] = useState([]);

const [studentId, setStudentId] = useState("");
const [eventId, setEventId] = useState("");
const [eventFee, setEventFee] = useState("");
useEffect(() => {
  if (isOpen) {
    loadData();
  }
}, [isOpen]);

const loadData = async () => {
  try {
    const studentsRes = await api.get("/students");
    const eventsRes = await api.get("/events");

    setStudents(studentsRes.data);
    setEvents(eventsRes.data);
  } catch (error) {
    console.log(error);
  }
};

const assignEvent = async () => {
  try {
    await api.post("/student-event-fees", {
      student_id: Number(studentId),
      event_id: Number(eventId),
      event_fee: Number(eventFee),
    });

    alert("Event assigned successfully!");

    fetchEventFees();
    onClose();

  } catch (error) {
    console.log(error);

    if (error.response) {
      alert(error.response.data.detail);
    } else {
      alert("Failed to assign event.");
    }
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>Assign Event</h2>

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

    <select
      value={studentId}
      onChange={(e) => setStudentId(e.target.value)}
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

  <div className="form-group">
    <label>Event</label>

    <select
      value={eventId}
      onChange={(e) => {
        setEventId(e.target.value);

        const selected = events.find(
          (event) => event.id === Number(e.target.value)
        );

        if (selected) {
          setEventFee(selected.event_fee);
        }
      }}
    >
      <option value="">Select Event</option>

      {events.map((event) => (
        <option
          key={event.id}
          value={event.id}
        >
          {event.event_name}
        </option>
      ))}
    </select>
  </div>

  <div className="form-group">
    <label>Event Fee</label>

    <input
      type="number"
      value={eventFee}
      readOnly
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
  onClick={assignEvent}
>
  Assign
</button>
          </div>

        </div>

      </div>
    </div>
  );

<EventPaymentModal
  isOpen={isPaymentModalOpen}
  onClose={() => setIsPaymentModalOpen(false)}
  selectedFee={selectedFee}
  fetchEventFees={fetchEventFees}
/>
}

export default StudentEventFeeModal;