import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import WellnessPage from "./components/WellnessPage.jsx";
import HistoryPage from "./components/HistoryPage.jsx";

function AppShell() {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Arogya Wellness Assistant";
  }, []);

  const handleLogout = () => {
    setUserId("");
    setUserName("");
    setProfileCompleted(false);
    setShowLandingPage(true);
    navigate("/");
  };

  const handleLoginClick = () => {
    setShowLandingPage(false);
    navigate("/login");
  };

  const handleRegisterClick = () => {
    setShowLandingPage(false);
    navigate("/register");
  };

  const RequireAuth = ({ children }) =>
    userId ? children : <Navigate to="/login" replace />;

  return (
    <Routes>
      {/* Landing */}
      <Route
        path="/"
        element={
          showLandingPage && !userId ? (
            <HomePage
              onLoginClick={handleLoginClick}
              onRegisterClick={handleRegisterClick}
            />
          ) : userId ? (
            <Navigate
              to={profileCompleted ? "/wellness" : "/profile"}
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          !userId ? (
            <LoginPage
              onLogin={(uid, name) => {
                setUserId(uid);
                setUserName(name);
                setProfileCompleted(false);
                setShowLandingPage(false);
                navigate("/profile");
              }}
              onBackClick={() => {
                setShowLandingPage(true);
                navigate("/");
              }}
            />
          ) : (
            <Navigate
              to={profileCompleted ? "/wellness" : "/profile"}
              replace
            />
          )
        }
      />

      {/* Register (reuses LoginPage for now) */}
      <Route
        path="/register"
        element={
          !userId ? (
            <LoginPage
              onLogin={(uid, name) => {
                setUserId(uid);
                setUserName(name);
                setProfileCompleted(false);
                setShowLandingPage(false);
                navigate("/profile");
              }}
              onBackClick={() => {
                setShowLandingPage(true);
                navigate("/");
              }}
            />
          ) : (
            <Navigate
              to={profileCompleted ? "/wellness" : "/profile"}
              replace
            />
          )
        }
      />

      {/* Profile (can navigate to /history using navigate("/history") inside ProfilePage) */}
      <Route
        path="/profile"
        element={
          <RequireAuth>
            <ProfilePage
              userId={userId}
              onProfileSaved={() => {
                setProfileCompleted(true);
                navigate("/wellness");
              }}
            />
          </RequireAuth>
        }
      />

      {/* Wellness (can navigate to /history using navigate("/history") inside NavBar or buttons) */}
      <Route
        path="/wellness"
        element={
          <RequireAuth>
            {profileCompleted ? (
              <WellnessPage
                userId={userId}
                userName={userName}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/profile" replace />
            )}
          </RequireAuth>
        }
      />

      {/* History – reached from Profile or Wellness via navigate("/history") */}
      <Route
        path="/history"
        element={
          <RequireAuth>
            <HistoryPage
              userId={userId}
              onBack={() => navigate("/wellness")}
            />
          </RequireAuth>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppShell;
