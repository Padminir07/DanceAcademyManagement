import "./Sidebar.css";
import logo from "../../assets/logo.png";
import watermark from "../../assets/watermark.png";
import { FaHome } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">

      <div className="logo">
        <img src={logo} alt="NPNK Logo" />
      </div>

      <div className="menu">

        {/* Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <FaHome className="menu-icon" />
          <span>Dashboard</span>
        </NavLink>

        {/* Students */}
        <NavLink
          to="/students"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <span className="menu-icon">👥</span>
          <span>Students</span>
        </NavLink>

        {/* Monthly Fees */}
        <NavLink
          to="/monthly-fees"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <span className="menu-icon">📅</span>
          <span>Monthly Fees</span>
        </NavLink>

        {/* Payments */}
        <NavLink
          to="/payments"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <span className="menu-icon">💳</span>
          <span>Payments</span>
        </NavLink>

        {/* Attendance */}
        <NavLink
          to="/attendance"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <span className="menu-icon">📋</span>
          <span>Attendance</span>
        </NavLink>

     <NavLink
  to="/events"
  className={({ isActive }) =>
    isActive ? "menu-item active" : "menu-item"
  }
>
  <span className="menu-icon">🎉</span>
  <span>Events</span>
</NavLink>

        {/* Event Fees */}
       <NavLink
  to="/event-fees"
  className={({ isActive }) =>
    isActive ? "menu-item active" : "menu-item"
  }
>
  <span className="menu-icon">🎟️</span>
  <span>Event Fees</span>
</NavLink>

       <NavLink
  to="/exams"
  className={({ isActive }) =>
    isActive ? "menu-item active" : "menu-item"
  }
>
  <span className="menu-icon">📝</span>
  <span>Exams</span>
</NavLink>

   <NavLink
  to="/exam-fees"
  className={({ isActive }) =>
    isActive ? "menu-item active" : "menu-item"
  }
>
  <span className="menu-icon">🎓</span>
  <span>Exam Fees</span>
</NavLink>

        {/* Attendance Report */}
        <NavLink
          to="/attendance-report"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          <span className="menu-icon">📊</span>
          <span>Attendance Report</span>
        </NavLink>

       <NavLink
  to="/fee-enquiry"
  className={({ isActive }) =>
    isActive ? "menu-item active" : "menu-item"
  }
>
  <span className="menu-icon">🔍</span>
  <span>Fee Enquiry</span>
</NavLink>

     

      </div>

      <div className="sidebar-watermark">
        <img src={watermark} alt="watermark" />
      </div>

    </div>
  );
}

export default Sidebar;