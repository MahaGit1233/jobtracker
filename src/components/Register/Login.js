import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./signup.css";

const Login = (props) => {
  const [enteredMail, setEnteredMail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [error, setError] = useState("");

  const mailChangeHandler = (event) => {
    setEnteredMail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    if (!enteredMail || !enteredPassword) {
      setError("All fields are required to be filled");
      return;
    }

    try {
      const response = await fetch("http://localhost:4002/register/login", {
        method: "POST",
        body: JSON.stringify({
          email: enteredMail,
          password: enteredPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login Failed");
        return;
      }
      console.log(data.message);
      alert(data.message);

      props.onLogin();
      localStorage.setItem("token", data.token);

      setEnteredMail("");
      setEnteredPassword("");
      setError("");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <div>
      <Form className="form1" onSubmit={formSubmitHandler}>
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
        <NavLink to="/forgot-password">Forgot Password??</NavLink>
        <div
          style={{
            textAlign: "center",
            paddingBottom: "0.7rem",
            paddingTop: "0.3rem",
          }}
        >
          <Button type="submit" variant="outline-dark">
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
