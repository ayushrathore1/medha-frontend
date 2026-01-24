import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";

// Layout
import MainLayout from "./components/Layout";
import PageTransition from "./components/Common/PageTransition";
import Loader from "./components/Common/Loader";

// Lazy Load Pages
const Dashboard = React.lazy(() => import("./pages/Dashboard"));


const Notifications = React.lazy(() => import("./pages/Notifications"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const EmailVerification = React.lazy(() => import("./pages/EmailVerification"));
const Subjects = React.lazy(() => import("./pages/Subjects"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Welcome = React.lazy(() => import("./pages/Welcome"));
const WelcomeDark = React.lazy(() => import("./pages/WelcomeDark"));
const Notes = React.lazy(() => import("./pages/Notes"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const RTUExams = React.lazy(() => import("./pages/RTUExams"));
const VisualizeConcepts = React.lazy(() => import("./components/RTUExams/VisualizeConcepts"));
const ExamsPage = React.lazy(() => import("./pages/ExamsPage"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const TeamDashboard = React.lazy(() => import("./pages/TeamDashboard"));
const JoinTeam = React.lazy(() => import("./pages/JoinTeam"));
const PersonalizationSetup = React.lazy(() => import("./pages/PersonalizationSetup"));
const VisualizationPage = React.lazy(() => import("./pages/VisualizationPage"));
const PublicProfile = React.lazy(() => import("./pages/PublicProfile"));

// Feature flag for Charcha (discussion forum)
const CHARCHA_ENABLED = import.meta.env.VITE_ENABLE_CHARCHA === 'true';

// Conditionally import Charcha components
const Charcha = CHARCHA_ENABLED ? React.lazy(() => import('./pages/Charcha')) : null;
const CharchaPost = CHARCHA_ENABLED ? React.lazy(() => import('./pages/CharchaPost')) : null;

// Providers
import { AuthProvider } from "./AuthProvider";
// ProtectedRoute
import ProtectedRoute from "./ProtectedRoute";

import { TourProvider } from "./context/TourContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import { ChatbotProvider } from "./context/ChatbotContext";

const AppContent = () => {
  const location = useLocation();
  const { theme } = useTheme();

  // Choose Welcome page based on theme
  const WelcomePage = Welcome;

  return (
    <AuthProvider>
      <AuthModalProvider>
      <Analytics />
      <TourProvider>
        <ChatbotProvider>
          <MainLayout>
        <AnimatePresence mode="wait">
          <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader /></div>}>
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
                    <PageTransition><ExamsPage /></PageTransition>
                  }
                />
                <Route
                  path="/rtu-exams"
                  element={
                    <PageTransition><RTUExams /></PageTransition>
                  }
                />
                <Route
                  path="/visualizations"
                  element={
                    <PageTransition><VisualizeConcepts /></PageTransition>
                  }
                />
                {/* Shareable visualization URLs */}
                <Route
                  path="/visualize/:animationId"
                  element={<VisualizationPage />}
                />
                <Route
                  path="/visualize/:animationId/:step"
                  element={<VisualizationPage />}
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
                  path="/profile/:userId"
                  element={
                    <ProtectedRoute>
                      <PageTransition><PublicProfile /></PageTransition>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team-dashboard"
                  element={
                    <ProtectedRoute>
                      <PageTransition><TeamDashboard /></PageTransition>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/join-team"
                  element={
                    <PageTransition><JoinTeam /></PageTransition>
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
                    <PageTransition><Notes /></PageTransition>
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
                {/* Charcha routes - only rendered when feature flag is enabled */}
                {CHARCHA_ENABLED && (
                  <>
                    <Route
                      path="/charcha"
                      element={
                        <ProtectedRoute>
                          <PageTransition><Charcha /></PageTransition>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/charcha/post/:idOrSlug"
                      element={
                          <PageTransition><CharchaPost /></PageTransition>
                      }
                    />
                  </>
                )}
                {/* Catch-all 404 */}
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </MainLayout>
        </ChatbotProvider>
      </TourProvider>
      </AuthModalProvider>
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
