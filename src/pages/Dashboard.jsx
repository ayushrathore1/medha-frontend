import React, { useEffect, useState } from "react";
import SubjectList from "../components/Subject/SubjectList";
import Button from "../components/Common/Button";
import Footer from "../components/Common/Footer";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [notesCount, setNotesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Early auth check: if no token, redirect to welcome
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/welcome");
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUserAndDashboardData = async () => {
      setLoading(true);
      try {
        // User fetch
        const userRes = await fetch(
          "https://medha-backend.onrender.com/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        } else {
          localStorage.removeItem("token");
          navigate("/welcome");
          return;
        }

        // Subjects
        const subjRes = await fetch(
          "https://medha-backend.onrender.com/api/subjects",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const subjData = await subjRes.json();
        setSubjects(Array.isArray(subjData.subjects) ? subjData.subjects : []);

        // Notes count
        const notesRes = await fetch("https://medha-backend.onrender.com/api/notes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const notesData = await notesRes.json();
        setNotesCount(
          Array.isArray(notesData.notes) ? notesData.notes.length : 0
        );

        // Quizzes
        const quizRes = await fetch(
          "https://medha-backend.onrender.com/api/quizzes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const quizData = await quizRes.json();
        setRecentQuizzes(
          Array.isArray(quizData.quizzes) ? quizData.quizzes.slice(0, 5) : []
        );
      } catch (error) {
        console.error("Dashboard API error:", error);
        localStorage.removeItem("token");
        navigate("/welcome");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndDashboardData();
  }, [navigate]);

  // Compute average score
  const averageScore =
    recentQuizzes.length > 0
      ? Math.round(
          (recentQuizzes.reduce(
            (acc, quiz) => acc + quiz.score / quiz.total,
            0
          ) /
            recentQuizzes.length) *
            100
        )
      : 0;

  // Greeting message
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium text-blue-700">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <header className="pt-20 bg-white/80 backdrop-blur-sm border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 mb-2">
                  🎯 {getGreeting()}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
                Welcome back, {user && user.name ? user.name : "Student"}!
              </h1>
              <p className="text-lg text-blue-600 mb-6 max-w-2xl">
                Ready to continue your learning journey? You have{" "}
                {subjects.length} active subjects and {notesCount} notes to
                review. Let's make today productive!
              </p>
              <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 justify-center lg:justify-start">
                <Link to="/notes">
                  <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl border-0">
                    📝 My Notes
                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                      {notesCount}
                    </span>
                  </Button>
                </Link>
                <Link to="/flashcards">
                  <Button className="w-full lg:w-auto bg-white text-blue-700 border-2 border-blue-300 hover:bg-blue-50 hover:border-blue-400 px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                    🎴 Flashcards
                  </Button>
                </Link>
                <Link to="/quiz">
                  <Button className="w-full lg:w-auto bg-white text-green-700 border-2 border-green-300 hover:bg-green-50 hover:border-green-400 px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                    🧠 Take Quiz
                  </Button>
                </Link>
                <Link to="/chatbot">
                  <Button className="w-full lg:w-auto bg-white text-purple-700 border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400 px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
                    🤖 AI Tutor
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl p-8">
                  <img
                    src="https://ik.imagekit.io/ayushrathore1/studyIllustration?updatedAt=1758344375764"
                    alt="Study illustration"
                    className="w-72 h-72 object-contain drop-shadow-lg"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 -right-4 w-3 h-3 bg-pink-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="flex-1 py-8 md:py-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Stats Section - Moved to top */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold mb-1">
                      {subjects.length}
                    </div>
                    <div className="text-blue-100 font-medium">
                      Active Subjects
                    </div>
                  </div>
                  <div className="text-4xl opacity-80">📚</div>
                </div>
                <div className="mt-3 text-blue-100 text-sm">
                  {subjects.length > 0
                    ? "Keep up the great work!"
                    : "Add your first subject"}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold mb-1">{notesCount}</div>
                    <div className="text-green-100 font-medium">
                      Total Notes
                    </div>
                  </div>
                  <div className="text-4xl opacity-80">📝</div>
                </div>
                <div className="mt-3 text-green-100 text-sm">
                  Across all subjects
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold mb-1">
                      {recentQuizzes.length}
                    </div>
                    <div className="text-purple-100 font-medium">
                      Quizzes Taken
                    </div>
                  </div>
                  <div className="text-4xl opacity-80">🏆</div>
                </div>
                <div className="mt-3 text-purple-100 text-sm">This week</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold mb-1">
                      {averageScore}%
                    </div>
                    <div className="text-orange-100 font-medium">
                      Average Score
                    </div>
                  </div>
                  <div className="text-4xl opacity-80">📊</div>
                </div>
                <div className="mt-3 text-orange-100 text-sm">
                  {averageScore >= 80
                    ? "Excellent!"
                    : averageScore >= 60
                      ? "Good progress"
                      : "Keep practicing"}
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Subjects Section */}
            <section className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                    📖 Your Subjects
                  </h2>
                  <Link to="/subjects">
                    <Button className="bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 hover:border-blue-400 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200">
                      Manage Subjects
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {subjects.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📚</div>
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">
                        No subjects added yet
                      </h3>
                      <p className="text-blue-600 text-sm mb-4">
                        Get started by adding your first subject to organize
                        your studies
                      </p>
                      <Link to="/subjects">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-sm font-medium rounded-lg">
                          Add Subject
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <SubjectList
                        subjects={subjects}
                        onSelect={(subject) => alert(`Navigate to ${subject}`)}
                      />
                      {subjects.length > 3 && (
                        <div className="text-center pt-2">
                          <Link
                            to="/subjects"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View all {subjects.length} subjects →
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Enhanced Recent Quiz Results */}
            <section className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                    🏆 Recent Quizzes
                  </h2>
                  <Link to="/quiz">
                    <Button className="bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 hover:border-green-400 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200">
                      Take Quiz
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentQuizzes.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-lg font-semibold text-blue-700 mb-2">
                        No quiz results yet
                      </h3>
                      <p className="text-blue-600 text-sm mb-4">
                        Take your first quiz to track your progress and identify
                        areas for improvement
                      </p>
                      <Link to="/quiz">
                        <Button className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 text-sm font-medium rounded-lg">
                          Start Quiz
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {recentQuizzes.map((quiz, i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-blue-800 text-lg mb-1">
                                {quiz.subject}
                              </h3>
                              <p className="text-blue-600 text-sm mb-2">
                                {new Date(quiz.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    weekday: "short",
                                  }
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-700">
                                {quiz.score}/{quiz.total}
                              </div>
                              <div
                                className={`text-sm font-medium ${
                                  quiz.score / quiz.total >= 0.8
                                    ? "text-green-600"
                                    : quiz.score / quiz.total >= 0.6
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {Math.round((quiz.score / quiz.total) * 100)}%
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="w-full bg-blue-200 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full transition-all duration-700 ${
                                  quiz.score / quiz.total >= 0.8
                                    ? "bg-green-500"
                                    : quiz.score / quiz.total >= 0.6
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                }`}
                                style={{
                                  width: `${(quiz.score / quiz.total) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {recentQuizzes.length > 3 && (
                        <div className="text-center pt-2">
                          <Link
                            to="/quiz/history"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View all quiz results →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Quick Actions Section */}
          <section className="mt-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-white/50">
              <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                🚀 Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/notes/new" className="block">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 text-center hover:from-blue-200 hover:to-blue-300 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
                    <div className="text-3xl mb-2">📝</div>
                    <h3 className="font-semibold text-blue-800">Create Note</h3>
                    <p className="text-blue-600 text-sm">
                      Add new study material
                    </p>
                  </div>
                </Link>

                <Link to="/quiz/new" className="block">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 text-center hover:from-green-200 hover:to-green-300 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
                    <div className="text-3xl mb-2">🧠</div>
                    <h3 className="font-semibold text-green-800">Quick Quiz</h3>
                    <p className="text-green-600 text-sm">
                      Test your knowledge
                    </p>
                  </div>
                </Link>

                <Link to="/flashcards/create" className="block">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6 text-center hover:from-purple-200 hover:to-purple-300 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
                    <div className="text-3xl mb-2">🎴</div>
                    <h3 className="font-semibold text-purple-800">
                      Make Flashcards
                    </h3>
                    <p className="text-purple-600 text-sm">
                      Create study cards
                    </p>
                  </div>
                </Link>

                <Link to="/chatbot" className="block">
                  <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-6 text-center hover:from-orange-200 hover:to-orange-300 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 cursor-pointer">
                    <div className="text-3xl mb-2">🤖</div>
                    <h3 className="font-semibold text-orange-800">Ask AI</h3>
                    <p className="text-orange-600 text-sm">Get instant help</p>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Dashboard;
