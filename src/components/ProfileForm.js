import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Button, Form } from "react-bootstrap";
import "./JobApplication.css";

const Backdrop2 = (props) => {
  const [photo, setPhoto] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [summary, setSummary] = useState("");
  const [goals, setGoals] = useState("");

  const token = localStorage.getItem("token");

  const photoChangeHandler = (event) => {
    setPhoto(event.target.value);
  };

  const phoneChangeHandler = (event) => {
    setPhone(event.target.value);
  };

  const dateChangeHandler = (event) => {
    setDate(event.target.value);
  };

  const addressChangeHandler = (event) => {
    setAddress(event.target.value);
  };

  const summaryChangeHandler = (event) => {
    setSummary(event.target.value);
  };

  const goalsChangeHandler = (event) => {
    setGoals(event.target.value);
  };

  useEffect(() => {
    if (props.editProfile) {
      setPhoto(props.editProfile.photo || "");
      setPhone(props.editProfile.phone || "");
      setDate(props.editProfile.dateofbirth || "");
      setAddress(props.editProfile.address || "");
      setSummary(props.editProfile.summary || "");
      setGoals(props.editProfile.careergoals || "");
    }
  }, [props.editProfile]);

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const profileDetails = {
      photo: photo,
      phone: phone,
      dateofbirth: date,
      address: address,
      summary: summary,
      careergoals: goals,
    };

    const url = props.editProfile
      ? `http://localhost:4002/profile/updateprofile/${props.editProfile.id}`
      : `http://localhost:4002/profile/addprofile`;

    const method = props.editProfile ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(profileDetails),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await response.json();
    console.log(data.profile);
    alert(data.message);

    {
      !props.editProfile && props.onAdded(data.profile);
    }

    setPhoto("");
    setPhone("");
    setDate("");
    setAddress("");
    setSummary("");
    setGoals("");

    props.onClose();
  };

  return (
    <div className="backdrop">
      <Form onSubmit={formSubmitHandler}>
        <Form.Group>
          <Form.Label>Profile Photo:</Form.Label>
          <Form.Control
            type="url"
            value={photo}
            onChange={photoChangeHandler}
            placeholder="Place you profile photo url"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone Number:</Form.Label>
          <Form.Control
            type="number"
            value={phone}
            onChange={phoneChangeHandler}
            placeholder="Enter your phone number"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Date of Birth:</Form.Label>
          <Form.Control type="date" value={date} onChange={dateChangeHandler} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Address:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={address}
            onChange={addressChangeHandler}
            placeholder="Add your Address"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Summary:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={summary}
            onChange={summaryChangeHandler}
            placeholder="Add something about yourself"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Career Goals:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={goals}
            onChange={goalsChangeHandler}
            placeholder="Add what you want to acheive"
          />
        </Form.Group>
        <div>
          <Button onClick={props.onClose} variant="outline-light">
            Close
          </Button>
          <Button type="submit" variant="outline-light">
            {props.editProfile ? "Update" : "Add"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

const ProfileForm = (props) => {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop2
          onClose={props.closeHandler}
          onAdded={props.onAdded}
          editProfile={props.editProfile}
        />,
        document.getElementById("backdrop-root2")
      )}
    </React.Fragment>
  );
};

export default ProfileForm;
