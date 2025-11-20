import React from "react";
<<<<<<< HEAD
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e

// Layout
import MainLayout from "./components/Layout";
import PageTransition from "./components/Common/PageTransition";

// Pages
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Subjects from "./pages/Subjects";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import Notes from "./pages/Notes";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Providers
<<<<<<< HEAD
import { AuthProvider } from "./AuthProvider";
// ProtectedRoute
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  const location = useLocation();

  return (
    <AuthProvider>
      <MainLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/" element={<PageTransition><Welcome /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageTransition><Dashboard /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <PageTransition><Chatbot /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards"
              element={
                <ProtectedRoute>
                  <PageTransition><Flashcards /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <PageTransition><Quiz /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <PageTransition><Feedback /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageTransition><Profile /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <PageTransition><Notes /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/subjects"
              element={
                <ProtectedRoute>
                  <PageTransition><Subjects /></PageTransition>
                </ProtectedRoute>
              }
            />
            {/* Catch-all 404 */}
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </MainLayout>
    </AuthProvider>
  );
};

=======

import { AuthProvider } from "./AuthProvider";

// ProtectedRoute
import ProtectedRoute from "./ProtectedRoute";

const App = () => (
 
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
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

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>

);

>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
export default App;
