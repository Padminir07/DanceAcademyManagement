import "./EventModal.css";
import { useState, useEffect } from "react";
import api from "../../services/api";
function EventModal({
  isOpen,
  onClose,
  fetchEvents,
  selectedEvent,
}) {
  if (!isOpen) return null;

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventFee, setEventFee] = useState("");
  const [location, setLocation] = useState("");
  const [remarks, setRemarks] = useState("");
  useEffect(() => {
  if (selectedEvent) {
    setEventName(selectedEvent.event_name);
    setEventDate(selectedEvent.event_date);
    setEventFee(selectedEvent.event_fee);
    setLocation(selectedEvent.location);
    setRemarks(selectedEvent.remarks);
  } else {
    setEventName("");
    setEventDate("");
    setEventFee("");
    setLocation("");
    setRemarks("");
  }
}, [selectedEvent, isOpen]);

 const saveEvent = async () => {
  try {
    const eventData = {
      event_name: eventName,
      event_date: eventDate,
      event_fee: Number(eventFee),
      location: location,
      remarks: remarks,
    };

    if (selectedEvent) {
      await api.put(`/events/${selectedEvent.id}`, eventData);
      alert("Event updated successfully!");
    } else {
      await api.post("/events", eventData);
      alert("Event added successfully!");
    }

    fetchEvents();

    onClose();

  } catch (error) {
    console.error(error);

    if (error.response) {
      alert(error.response.data.detail);
    } else {
      alert("Failed to save event!");
    }
  }

  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h2>{selectedEvent ? "Edit Event" : "Add Event"}</h2>

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
              <label>Event Name</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Event Date</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Event Fee</label>
              <input
                type="number"
                value={eventFee}
                onChange={(e) => setEventFee(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label>Remarks</label>
              <textarea
                rows="3"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              ></textarea>
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
              onClick={saveEvent}
            >
              {selectedEvent ? "Update Event" : "Save Event"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default EventModal;