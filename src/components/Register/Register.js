import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import Login from "./Login";
import Signup from "./Signup";
import "./signup.css";

const Register = (props) => {
  const [isLogin, setIsLogin] = useState(false);

  const toggleAuth = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <Card className="card">
      <Card.Body className="cardbody">
        {!isLogin ? (
          <div className="body">
            <div className="bodyItems">
              <h1>Welcome!</h1>
              <h5>Sign up to create an account</h5>
              <Button onClick={toggleAuth} variant="outline-dark">
                {isLogin
                  ? "Don't have an account? Sign up"
                  : " Already have an account? Login"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="body1">
            <div className="bodyItems1">
              <h1>Welcome Back!</h1>
              <h5>Log In to proceed to your account</h5>
              <Button onClick={toggleAuth} variant="outline-dark">
                {isLogin
                  ? "Don't have an account? Sign up"
                  : " Already have an account? Login"}
              </Button>
            </div>
          </div>
        )}
        <div className="signupform">
          {isLogin ? <Login onLogin={props.onLogin} /> : <Signup />}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Register;
