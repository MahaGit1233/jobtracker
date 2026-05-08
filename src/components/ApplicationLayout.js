import React from "react";
import Sidebar from "./Sidebar";
import { Container } from "react-bootstrap";

const ApplicationLayout = (props) => {
  return (
    <div>
      <Container>
        <Sidebar onLogout={props.onLogout} />
      </Container>
      <Container style={{ textAlign: "center", marginTop: "18rem" }}>
        <h1>Welcome to Job Tracker!</h1>
        <p>Use the sidebar to navigate to Tracker, Profile, or Dashboard.</p>
      </Container>
    </div>
  );
};

export default ApplicationLayout;
