import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";

// Layout
import MainLayout from "./components/Layout";
import PageTransition from "./components/Common/PageTransition";

// Pages
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EmailVerification from "./pages/EmailVerification";
import Subjects from "./pages/Subjects";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import WelcomeDark from "./pages/WelcomeDark";
import Notes from "./pages/Notes";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RTUExams from "./pages/RTUExams";
import ExamsPage from "./pages/ExamsPage";
import AdminDashboard from "./pages/AdminDashboard";
import Messages from "./pages/Messages";
import PersonalizationSetup from "./pages/PersonalizationSetup";

// Providers
import { AuthProvider } from "./AuthProvider";
// ProtectedRoute
import ProtectedRoute from "./ProtectedRoute";

import { TourProvider } from "./context/TourContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

const AppContent = () => {
  const location = useLocation();
  const { theme } = useTheme();

  // Choose Welcome page based on theme
  const WelcomePage = theme === 'premium-dark' ? WelcomeDark : Welcome;

  return (
    <AuthProvider>
      <Analytics />
      <TourProvider>
      <MainLayout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public routes */}
            <Route path="/" element={<PageTransition><WelcomePage /></PageTransition>} />
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
              <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
              <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
              <Route path="/verify-email" element={<PageTransition><EmailVerification /></PageTransition>} />

              {/* Protected routes */}
              <Route
                path="/personalize"
                element={
                  <ProtectedRoute>
                    <PageTransition><PersonalizationSetup /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/exams"
                element={
                  <ProtectedRoute>
                    <PageTransition><ExamsPage /></PageTransition>
                  </ProtectedRoute>
                }
              />
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
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <PageTransition><Notifications /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <PageTransition><AdminDashboard /></PageTransition>
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
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <PageTransition><Messages /></PageTransition>
                  </ProtectedRoute>
                }
              />
              {/* Catch-all 404 */}
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </MainLayout>
        </TourProvider>
      </AuthProvider>
  );
};

// Main App component wraps everything with ThemeProvider
const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
