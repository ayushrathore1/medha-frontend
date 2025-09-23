import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Layout
import Navbar from "./components/Navigation/Navbar";

// Pages
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
// import NoteUpload from "./pages/NoteUpload"; // REMOVE
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Subjects from "./pages/Subjects";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome"; // Optional welcome/landing page
import Notes from "./pages/Notes";

// For now, using a stub; swap with your auth logic when backend ready.
const isAuthenticated = () => {
  // When backend/auth ready: Replace this stub
  // e.g., return Boolean(localStorage.getItem("user"))
  return true;
};

// Wrapper for protected routes
const ProtectedRoute = ({ children }) =>
  isAuthenticated() ? children : <Navigate to="/login" replace />;

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      {/* Welcome/landing page */}
      <Route path="/" element={<Welcome />} />

      {/* Protected pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flashcards"
        element={
          <ProtectedRoute>
            <Flashcards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />
      {/* Remove /upload */}
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <Feedback />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      {/* The all-in-one Notes page */}
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subjects"
        element={
          <ProtectedRoute>
            <Subjects />
          </ProtectedRoute>
        }
      />
      

      {/* Public only */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;
