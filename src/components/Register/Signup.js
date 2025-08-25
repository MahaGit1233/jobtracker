import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import "./signup.css";

const Signup = () => {
  const [enteredName, setEnteredName] = useState("");
  const [enteredMail, setEnteredMail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [error, setError] = useState("");

  const nameChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const mailChangeHandler = (event) => {
    setEnteredMail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    if (!enteredName || !enteredMail || !enteredPassword) {
      setError("All fields are required to be filled");
      return;
    }

    try {
      const response = await fetch("http://localhost:4002/register/signup", {
        method: "POST",
        body: JSON.stringify({
          name: enteredName,
          email: enteredMail,
          password: enteredPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log(data.message);
      alert(data.message);

      if (!data) {
        throw new Error(data.error.message);
      }

      setEnteredName("");
      setEnteredMail("");
      setEnteredPassword("");
      setError("");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <div>
      <Form className="form" onSubmit={formSubmitHandler}>
        <Form.Group>
          <Form.Label className="formlabel">Name:</Form.Label>
          <Form.Control
            className="forminput"
            type="text"
            value={enteredName}
            onChange={nameChangeHandler}
            placeholder="Enter your name"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="formlabel">Email:</Form.Label>
          <Form.Control
            className="forminput"
            type="email"
            value={enteredMail}
            onChange={mailChangeHandler}
            placeholder="Enter your maii id"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="formlabel">Password:</Form.Label>
          <Form.Control
            className="forminput"
            type="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            placeholder="Enter your password"
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <div
          style={{
            textAlign: "center",
            paddingBottom: "0.7rem",
            paddingTop: "0.3rem",
          }}
        >
          <Button type="submit" variant="outline-dark">
            Sign Up
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Signup;
