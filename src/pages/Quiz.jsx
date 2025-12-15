import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import QuizItem from "../components/Quiz/QuizItem";

/* --- SubjectSelect is defined here for clarity and reliability --- */
const SubjectSelect = ({ subjects, selectedSubject, onChange }) => (
  <div className="w-full">
    <label htmlFor="subject" className="block mb-2 font-medium">
      Select Subject
    </label>
    <select
      id="subject"
      value={selectedSubject}
      onChange={e => onChange(e.target.value)}
      className="w-full px-5 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-2"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--accent-secondary)",
        color: "var(--text-primary)"
      }}
    >
      <option value="">-- Select a subject --</option>
      {subjects.map((subj) => (
        <option key={subj._id} value={subj.name}>
          {subj.name}
        </option>
      ))}
    </select>
  </div>
);

const Quiz = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [generationMode, setGenerationMode] = useState("subject");
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/subjects`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000,
        }
      );
      console.log("Subjects response:", response.data);

      if (response.data && Array.isArray(response.data.subjects)) {
        setSubjects(response.data.subjects);
      } else {
        setSubjects([]);
        setError("No subjects found.");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to fetch subjects.";
      setError(errorMsg);
      setSubjects([]);
    }
  };

  const handleStartQuiz = async () => {
    if (generationMode === "subject" && !selectedSubject) {
      setError("Please select a subject");
      return;
    }
    if (generationMode === "topic" && !topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      let endpoint, payload;

      if (generationMode === "topic") {
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/generate-topic-ai`;
        payload = { topic: topic.trim() };
        console.log("Generating topic-based quiz:", payload);
      } else {
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/generate-ai`;

        // Find the subject object to get the ID
        const subjectObj = subjects.find(s => s.name === selectedSubject);
        const subjectId = subjectObj ? subjectObj._id : null;

        // Try to fetch a note for the selected subject
        try {
          // Use subject ID if available, otherwise fallback or handle error
          if (!subjectId) {
             throw new Error("Subject ID not found");
          }

          const notesRes = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/notes?subject=${subjectId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 10000
            }
          );

          if (notesRes.data?.notes?.length > 0) {
            payload = {
              noteId: notesRes.data.notes[0]._id,
              subject: selectedSubject
            };
            console.log("Generating quiz from note:", payload);
          } else {
            // Fallback: topic mode with subject name
            endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/generate-topic-ai`;
            payload = { topic: selectedSubject };
          }
        } catch (noteError) {
          console.error("Error fetching notes or no notes found:", noteError);
          // Fallback to topic generation if notes fetch fails
          endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/generate-topic-ai`;
          payload = { topic: selectedSubject };
        }
      }

      console.log("Sending request to:", endpoint);
      console.log("Payload:", payload);

      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 seconds for AI generation
      });

      console.log("Quiz response:", response.data);

      const quizData = response.data.quiz || response.data;

      if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        throw new Error("Invalid quiz data received from server");
      }

      setQuiz(quizData);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setShowResults(false);
      setScore(0);
      setError("");
    } catch (error) {
      console.error("Error generating quiz:", error);

      let errorMsg = "Failed to generate quiz. ";

      if (error.response) {
        errorMsg += error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMsg += "No response from server. Please check your connection.";
      } else {
        errorMsg += error.message || "Unknown error occurred.";
      }

      setError(errorMsg);

      if (error.response?.status === 401 || error.response?.status === 403) {
        setError("Session expired. Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (answer) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      const correctAnswer = q.correctAnswer || q.answer;
      if (selectedAnswers[index] === correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const handleRestart = () => {
    setQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setError("");
    setSelectedSubject("");
    setTopic("");
  };

  if (loading) {
    return <Loader fullScreen message="Generating your quiz..." />;
  }

  if (!quiz) {
    return (
      <div className="min-h-screen w-full p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8" style={{ color: "var(--text-primary)" }}>
            Ready to test your knowledge?
          </h1>
          <p className="mb-8 text-lg" style={{ color: "var(--text-secondary)" }}>
            Choose how you want to generate your quiz
          </p>

          {error && (
            <div
              className="mb-6 p-4 rounded-xl border-2 border-red-500 bg-red-50"
              style={{ color: "#dc2626" }}
            >
              <strong>Error:</strong> {error}
            </div>
          )}

          <Card className="p-8">
            <div className="flex justify-center gap-4 mb-8">
              <Button
                variant={generationMode === "subject" ? "primary" : "outline"}
                onClick={() => {
                  setGenerationMode("subject");
                  setError("");
                }}
              >
                Select Subject
              </Button>
              <Button
                variant={generationMode === "topic" ? "primary" : "outline"}
                onClick={() => {
                  setGenerationMode("topic");
                  setError("");
                }}
              >
                Enter Topic
              </Button>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              {generationMode === "subject" ? (
                <>
                  <SubjectSelect
                    subjects={subjects}
                    selectedSubject={selectedSubject}
                    onChange={(value) => {
                      setSelectedSubject(value);
                      setError("");
                    }}
                  />
                  {subjects.length === 0 && !error && (
                    <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                      No subjects found. Try entering a custom topic instead.
                    </p>
                  )}
                </>
              ) : (
                <div>
                  <input
                    type="text"
                    placeholder="Enter any topic (e.g., 'React Hooks', 'Thermodynamics')"
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value);
                      setError("");
                    }}
                    className="w-full px-5 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--accent-secondary)",
                      color: "var(--text-primary)",
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && topic.trim()) {
                        handleStartQuiz();
                      }
                    }}
                  />
                </div>
              )}

              <Button
                onClick={handleStartQuiz}
                disabled={loading || (generationMode === "subject" ? !selectedSubject : !topic.trim())}
                loading={loading}
                fullWidth
                size="large"
              >
                {loading ? "Generating Quiz..." : "Start Quiz"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="min-h-screen w-full p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8" style={{ color: "var(--text-primary)" }}>
            Quiz Results
          </h1>

          <Card className="text-center p-8">
            <div
              className="text-6xl font-extrabold mb-4"
              style={{
                color: percentage >= 70 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444"
              }}
            >
              {percentage}%
            </div>
            <div className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              {score} / {quiz.questions.length} Correct
            </div>
            <p className="text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
              {percentage >= 70 ? "Excellent work! 🎉" : percentage >= 50 ? "Good effort! Keep it up! 👍" : "Keep practicing! You'll improve! 💪"}
            </p>
            <div className="flex gap-4">
              <Button onClick={handleRestart} variant="primary" fullWidth>
                Take Another Quiz
              </Button>
              <Button onClick={() => setShowResults(false)} variant="outline" fullWidth>
                Review Answers
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen w-full px-4 py-6 sm:p-6 pb-20 sm:pb-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--text-primary)" }}>
            Quiz
          </h1>
          <div className="text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
        </div>

        <QuizItem
          question={question.question || question.text}
          options={question.options}
          selectedAnswer={selectedAnswers[currentQuestion]}
          correctAnswer={question.correctAnswer || question.answer}
          onSelectAnswer={handleSelectAnswer}
          showResult={showResults}
        />

        <Card className="mt-6 p-4">
          <div className="flex justify-between items-center gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              ← Prev
            </Button>

             <div className="text-sm font-medium sm:hidden" style={{ color: "var(--text-secondary)" }}>
                {answeredCount}/{quiz.questions.length}
            </div>

            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                variant="success"
                disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}
                className="flex-1 sm:flex-none"
              >
                Submit
              </Button>
            ) : (
              <Button onClick={handleNext} variant="primary" className="flex-1 sm:flex-none">
                Next →
              </Button>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
              <span>Progress</span>
              <span className="hidden sm:inline">{answeredCount}/{quiz.questions.length} answered</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
                  background: `linear-gradient(to right, var(--action-primary), var(--accent-secondary))`,
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;
