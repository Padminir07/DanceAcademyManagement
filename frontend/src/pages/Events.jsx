import "./Students.css";
import { useEffect, useState } from "react";
import api from "../services/api";
import EventModal from "../components/EventModal/EventModal";
function Events() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedEvent, setSelectedEvent] = useState(null);
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events");
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteEvent = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this event?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete(`/events/${id}`);

    alert("Event deleted successfully!");

    fetchEvents();

  } catch (error) {
    console.error(error);

    if (error.response) {
      alert(error.response.data.detail);
    } else {
      alert("Failed to delete event!");
    }
  }
};

  return (
    <div className="students-page">

      <div className="students-header">
        <h1>Events</h1>

       <button
  className="add-btn"
  onClick={() => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  }}
>
  + Add Event
</button>
      </div>

      <div className="students-table">
        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>Event Name</th>
              <th>Date</th>
              <th>Fee</th>
              <th>Location</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {events.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center" }}
                >
                  No Events Found
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id}>

                  <td>{event.id}</td>

                  <td>{event.event_name}</td>

                  <td>{event.event_date}</td>

                  <td>₹ {event.event_fee}</td>

                  <td>{event.location}</td>

                  <td>{event.remarks}</td>

                  <td>
<button
  onClick={() => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }}
>
  Edit
</button>

                  <button
  style={{
    marginLeft: "10px",
  }}
  onClick={() => deleteEvent(event.id)}
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
      <EventModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  fetchEvents={fetchEvents}
  selectedEvent={selectedEvent}
/>
    </div>
    
  );
}

export default Events;