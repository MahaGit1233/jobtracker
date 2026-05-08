import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Button, Card, Form } from "react-bootstrap";
import "./JobApplication.css";
import API_BASE_URL from "../config";

const Backdrop = (props) => {
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [lastDate, sertLastDate] = useState("");
  const [remindBeforeDays, setRemindBeforeDays] = useState("");
  const [document, setDocument] = useState(null);

  const token = localStorage.getItem("token");

  const titleChangeHandler = (event) => {
    setTitle(event.target.value);
  };

  const companyNameChangeHandler = (event) => {
    setCompanyName(event.target.value);
  };

  const locationChangeHandler = (event) => {
    setLocation(event.target.value);
  };

  const statusChangeHandler = (event) => {
    setStatus(event.target.value);
  };

  const notesChangeHandler = (event) => {
    setNotes(event.target.value);
  };

  const lastDateChangeHandler = (event) => {
    sertLastDate(event.target.value);
  };

  const documentChangeHandler = (event) => {
    setDocument(event.target.files[0]);
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    let documentBase64 = null;
    if (document) {
      documentBase64 = await fileToBase64(document);
    }

    const applicationData = {
      id: props.editJob?.id,
      jobtitle: title,
      companyname: companyName,
      joblocation: location,
      status: status,
      notes: notes,
      lastdate: lastDate,
      remindbeforedays: remindBeforeDays,
      document: documentBase64,
    };

    const url = props.editJob
      ? `${API_BASE_URL}/application/jobs/updatejob/${props.editJob.id}`
      : `${API_BASE_URL}/application/jobs/addnewjob`;

    const method = props.editJob ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(applicationData),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();
    console.log(data);
    alert(data.message);

    props.onSaved(data.job);

    setTitle("");
    setCompanyName("");
    setLocation("");
    setStatus("");
    setNotes("");
    setDocument(null);

    props.onClose();
  };

  return (
    <div className="backdrop">
      <Card className="jobcard">
        <Form className="jobform" onSubmit={formSubmitHandler}>
          <Form.Group>
            <Form.Label className="jobformlabel">Job Title:</Form.Label>
            <Form.Control
              type="text"
              className="jobforminput"
              value={title}
              onChange={titleChangeHandler}
              placeholder="Enter the title of the job"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="jobformlabel">Company Name:</Form.Label>
            <Form.Control
              type="text"
              className="jobforminput"
              value={companyName}
              onChange={companyNameChangeHandler}
              placeholder="Enter Company name"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="jobformlabel">Job Location </Form.Label>
            <Form.Control
              type="text"
              className="jobforminput"
              value={location}
              onChange={locationChangeHandler}
              placeholder="Enter the location of the job "
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="jobformlabel">Status:</Form.Label>
            <Form.Select
              className="jobforminput"
              value={status}
              onChange={statusChangeHandler}
            >
              <option value="">--Select Status--</option>
              <option>Bookmarked</option>
              <option>Applied</option>
              <option>Interviewed</option>
              <option>Offered</option>
              <option>Rejected</option>
              <option>I Dropped it</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label className="jobformlabel">Notes:</Form.Label>
            <Form.Control
              as="textarea"
              className="jobforminput"
              rows={5}
              value={notes}
              onChange={notesChangeHandler}
              placeholder="Enter your thoughts on the job"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="jobformlabel">Last Date:</Form.Label>
            <Form.Control
              type="date"
              className="jobforminput"
              value={lastDate}
              onChange={lastDateChangeHandler}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="jobformlabel">
              Remind me before (days):
            </Form.Label>
            <Form.Control
              type="number"
              className="jobforminput"
              min="0"
              placeholder="e.g., 3"
              value={remindBeforeDays}
              onChange={(e) => setRemindBeforeDays(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="jobformlabel">Document:</Form.Label>
            <Form.Control
              type="file"
              className="jobforminput"
              onChange={documentChangeHandler}
            />
          </Form.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "1%",
              paddingBottom: "1rem",
            }}
          >
            <Button onClick={props.onClose} variant="outline-dark">
              Close
            </Button>
            <Button type="submit" variant="outline-dark">
              {props.editJob ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

const JobApplicationForm = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop
          onClose={props.closeHandler}
          onAdded={props.onAdded}
          onSaved={props.onSaved}
          editJob={props.editJob}
        />,
        document.getElementById("backdrop-root")
      )}
    </React.Fragment>
  );
};

export default JobApplicationForm;
