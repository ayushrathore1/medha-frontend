import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

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
import RTUExams from "./pages/RTUExams";

// Providers
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
              path="/rtu-exams"
              element={
                <ProtectedRoute>
                  <PageTransition><RTUExams /></PageTransition>
                </ProtectedRoute>
              }
            />
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

export default App;
