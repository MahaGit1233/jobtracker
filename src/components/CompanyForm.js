import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Button, Card, Form } from "react-bootstrap";
import "./JobApplication.css";
import API_BASE_URL from "../config";

const Backdrop1 = (props) => {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [notes, setNotes] = useState("");

  const token = localStorage.getItem("token");

  const nameChangeHandler = (event) => {
    setName(event.target.value);
  };

  const industryChangeHandler = (event) => {
    setIndustry(event.target.value);
  };

  const companySizeChangeHandler = (event) => {
    setCompanySize(event.target.value);
  };

  const locationChangeHandler = (event) => {
    setLocation(event.target.value);
  };

  const contactChangeHandler = (event) => {
    setContact(event.target.value);
  };

  const notesChangeHandler = (event) => {
    setNotes(event.target.value);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const companyDetails = {
      id: props.editCompany?.id,
      name: name,
      industry: industry,
      companysize: companySize,
      location: location,
      contact: contact,
      notes: notes,
    };

    const url = props.editCompany
      ? `${API_BASE_URL}/application/companies/updatecompany/${props.editCompany.id}`
      : `${API_BASE_URL}/application/companies/addnewcompany`;

    const method = props.editCompany ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(companyDetails),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();
    console.log(data);
    alert(data.message);

    props.onSaved(data.company);

    setName("");
    setIndustry("");
    setCompanySize("");
    setLocation("");
    setContact("");
    setNotes("");

    props.onClose();
  };

  return (
    <div className="backdrop">
      <Card className="companycard">
        <Form className="jobform" onSubmit={formSubmitHandler}>
          <Form.Group>
            <Form.Label className="jobformlabel">Name:</Form.Label>
            <Form.Control
              type="text"
              className="jobforminput"
              value={name}
              onChange={nameChangeHandler}
              placeholder="Enter the company's name"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="jobformlabel">Industry:</Form.Label>
            <Form.Control
              type="text"
              className="jobforminput"
              value={industry}
              onChange={industryChangeHandler}
              placeholder="Enter the company's insustry"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="jobformlabel">Company Size:</Form.Label>
            <Form.Select
              value={companySize}
              className="jobforminput"
              onChange={companySizeChangeHandler}
            >
              <option value="">--Select Company Size--</option>
              <option>1-5 employees</option>
              <option>5-50 employees</option>
              <option>50-500 employees</option>
              <option>500-5000 employees</option>
              <option>5000-10000 employees</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label className="jobformlabel">Location:</Form.Label>
            <Form.Control
              type="text"
              className="jobforminput"
              value={location}
              onChange={locationChangeHandler}
              placeholder="Enter company's location"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="jobformlabel">Contact:</Form.Label>
            <Form.Control
              type="email"
              className="jobforminput"
              value={contact}
              onChange={contactChangeHandler}
              placeholder="Enter company's email"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="jobformlabel">Notes:</Form.Label>
            <Form.Control
              as="textarea"
              className="jobforminput"
              rows={5}
              value={notes}
              onChange={notesChangeHandler}
              placeholder="Enter your thoughts about the company"
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
              {props.editCompany ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

const CompanyForm = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop1
          onClose={props.closeHandler}
          onAdded={props.onAdded}
          onSaved={props.onSaved}
          editCompany={props.editCompany}
        />,
        document.getElementById("backdrop-root1")
      )}
    </React.Fragment>
  );
};

export default CompanyForm;
