import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./components/Register/Register";
import ForgotPassword from "./components/Register/ForgotPassword";
import { useEffect, useState } from "react";
import ApplicationLayout from "./components/ApplicationLayout";
import Tracker from "./components/Tracker";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import { ThemeProvider } from "./components/Context/ThemeContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const onLoginSuccess = () => setIsLoggedIn(true);

  const logoutHandler = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  return (
    <ThemeProvider>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              !isLoggedIn ? (
                <Register onLogin={onLoginSuccess} />
              ) : (
                <Navigate to="/application" replace />
              )
            }
          />
          <Route
            path="/application"
            element={
              isLoggedIn ? (
                <ApplicationLayout onLogout={logoutHandler} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/tracker"
            element={<Tracker onLogout={logoutHandler} />}
          />
          <Route
            path="/profile"
            element={<Profile onLogout={logoutHandler} />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard onLogout={logoutHandler} />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
