import { Button, Nav } from "react-bootstrap";
import {
  BoxArrowLeft,
  CalendarWeek,
  House,
  Moon,
  PersonCircle,
  Sun,
} from "react-bootstrap-icons";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "./Context/ThemeContext";
import { useContext } from "react";

const Sidebar = (props) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <div className="custom-sidebar">
        <Nav className="flex-column nav-top">
          <NavLink
            style={{ textDecoration: "none" }}
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-item active-link" : "nav-item"
            }
          >
            <House className="icon" />
            <span className="label">Dashboard</span>
          </NavLink>
          <NavLink
            style={{ textDecoration: "none" }}
            to="/tracker"
            className={({ isActive }) =>
              isActive ? "nav-item active-link" : "nav-item"
            }
          >
            <CalendarWeek className="icon" />
            <span className="label">Tracker</span>
          </NavLink>
          <NavLink
            style={{ textDecoration: "none" }}
            to="/profile"
            className={({ isActive }) =>
              isActive ? "nav-item active-link" : "nav-item"
            }
          >
            <PersonCircle className="icon" />
            <span className="label">profile</span>
          </NavLink>
        </Nav>

        <Nav className="flex-column nav-bottom">
          <div className="nav-item theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? (
              <>
                <Moon className="icon" />
                <span className="label">Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="icon" />
                <span className="label">Light Mode</span>
              </>
            )}
          </div>
          <NavLink
            style={{ textDecoration: "none" }}
            onClick={props.onLogout}
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-item active-link" : "nav-item"
            }
          >
            <BoxArrowLeft className="icon" />
            <span className="label">Logout</span>
          </NavLink>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
