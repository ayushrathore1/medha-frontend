import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import QuizItem from "../components/Quiz/QuizItem";
import { FaBrain, FaUniversity, FaKeyboard, FaTrophy, FaRedo, FaList, FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";

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
      if (!token) return;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/subjects`,
        { headers: { Authorization: `Bearer ${token}` }, timeout: 10000 }
      );
      if (response.data && Array.isArray(response.data.subjects)) {
        setSubjects(response.data.subjects);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
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
      if (!token) throw new Error("Authentication required");

      let endpoint, payload;
      if (generationMode === "topic") {
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/generate-topic-ai`;
        payload = { topic: topic.trim() };
      } else {
        endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/generate-ai`;
        const subjectObj = subjects.find(s => s.name === selectedSubject);
        const subjectId = subjectObj ? subjectObj._id : null;
        
        try {
           if (!subjectId) throw new Error("ID not found");
           const notesRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes?subject=${subjectId}`, { headers: { Authorization: `Bearer ${token}` } });
           if (notesRes.data?.notes?.length > 0) {
              payload = { noteId: notesRes.data.notes[0]._id, subject: selectedSubject };
           } else {
              endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/generate-topic-ai`;
              payload = { topic: selectedSubject };
           }
        } catch {
           endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/quizzes/generate-topic-ai`;
           payload = { topic: selectedSubject };
        }
      }

      const response = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 60000
      });

      const quizData = response.data.quiz || response.data;
      if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        throw new Error("Invalid quiz data received");
      }

      setQuiz(quizData);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setShowResults(false);
      setScore(0);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to generate quiz. Please try again.");
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
  };

  if (loading) return <Loader fullScreen message="Generating a unique quiz for you..." />;

  // START SCREEN
  if (!quiz) {
    return (
      <div className="min-h-screen w-full px-4 py-8 sm:px-8 bg-slate-50 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Quiz Arena
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">
              Test your knowledge with AI-generated quizzes from your course material or any topic you choose.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
             {/* Mode Selection */}
             <Card className="md:col-span-2 p-1">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      onClick={() => { setGenerationMode("subject"); setError(""); }}
                      className={`flex-1 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all ${generationMode === "subject" ? "bg-white text-indigo-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                    >
                       <FaUniversity /> By Subject
                    </button>
                    <button
                      onClick={() => { setGenerationMode("topic"); setError(""); }}
                      className={`flex-1 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition-all ${generationMode === "topic" ? "bg-white text-indigo-600 shadow-md" : "text-slate-400 hover:text-slate-600"}`}
                    >
                       <FaKeyboard /> Custom Topic
                    </button>
                </div>
             </Card>

             {/* Input Area */}
             <div className="md:col-span-2">
               <AnimatePresence mode="wait">
                 {generationMode === "subject" ? (
                    <motion.div 
                      key="subject"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 max-w-md mx-auto"
                    >
                       <div className="relative">
                          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Select Course</label>
                          <select
                            value={selectedSubject}
                            onChange={(e) => { setSelectedSubject(e.target.value); setError(""); }}
                            className="w-full px-5 py-4 rounded-2xl border border-slate-300 bg-white text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 appearance-none shadow-sm"
                          >
                             <option value="">-- Choose Subject --</option>
                             {subjects.map((s) => <option key={s._id} value={s.name}>{s.name}</option>)}
                          </select>
                          <div className="absolute right-5 bottom-4 pointer-events-none text-slate-500">▼</div>
                       </div>
                    </motion.div>
                 ) : (
                    <motion.div 
                      key="topic"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 max-w-md mx-auto"
                    >
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Enter Topic</label>
                          <input
                             type="text"
                             placeholder="e.g. Thermodynamics, React Hooks..."
                             value={topic}
                             onChange={(e) => { setTopic(e.target.value); setError(""); }}
                             onKeyPress={(e) => e.key === 'Enter' && topic.trim() && handleStartQuiz()}
                             className="w-full px-5 py-4 rounded-2xl border border-slate-300 bg-white text-lg font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-sm"
                          />
                       </div>
                    </motion.div>
                 )}
               </AnimatePresence>

               {error && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 max-w-md mx-auto bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-200 text-center font-bold">
                    {error}
                 </motion.div>
               )}

               <div className="mt-8 max-w-sm mx-auto">
                 <Button 
                    onClick={handleStartQuiz} 
                    loading={loading}
                    disabled={generationMode === "subject" ? !selectedSubject : !topic.trim()}
                    size="lg" 
                    fullWidth 
                    className="h-14 text-lg bg-gradient-to-r from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/30 border-0"
                 >
                    Start Challenge
                 </Button>
               </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (showResults) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="min-h-screen w-full px-4 py-8 bg-slate-50 flex items-center justify-center">
         <motion.div 
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center"
         >
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl ${
               percentage >= 70 ? 'bg-emerald-100 text-emerald-600' :
               percentage >= 50 ? 'bg-amber-100 text-amber-600' :
               'bg-red-100 text-red-600'
            }`}>
               <FaTrophy size={60} />
            </div>

            <h2 className="text-4xl font-black text-slate-900 mb-2">
               {percentage >= 80 ? "Outstanding!" : percentage >= 50 ? "Good Job!" : "Keep Learning!"}
            </h2>
            <p className="text-slate-500 font-medium text-lg mb-8">
               You scored <span className="font-bold text-slate-900 text-2xl">{score}</span> out of {quiz.questions.length}
            </p>

            <div className="w-full h-6 bg-slate-100 rounded-full mb-10 overflow-hidden relative">
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    percentage >= 70 ? 'bg-emerald-500' :
                    percentage >= 50 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
               />
               <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white shadow-sm drop-shadow-md">
                  {percentage}% Accuracy
               </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <Button onClick={handleRestart} variant="primary" size="lg" className="shadow-lg shadow-indigo-500/20">
                  <FaRedo className="mr-2"/> Try Again
               </Button>
               <Button onClick={() => setShowResults(false)} variant="outline" size="lg">
                  <FaList className="mr-2"/> Review Answers
               </Button>
            </div>
         </motion.div>
      </div>
    );
  }

  // QUIZ SCREEN
  return (
    <div className="min-h-screen w-full px-4 py-8 bg-slate-50">
       <div className="max-w-3xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
             <div>
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                   <FaBrain className="text-indigo-600"/> Quiz Mode
                </h1>
                <p className="text-slate-500 font-bold">
                   Question {currentQuestion + 1} <span className="text-slate-300">/</span> {quiz.questions.length}
                </p>
             </div>
             <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 font-mono font-bold text-slate-700">
                {generationMode === "subject" ? selectedSubject : topic}
             </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
             <motion.div 
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
             />
          </div>

          {/* Question */}
          <QuizItem
             question={quiz.questions[currentQuestion].question || quiz.questions[currentQuestion].text}
             options={quiz.questions[currentQuestion].options}
             selectedAnswer={selectedAnswers[currentQuestion]}
             correctAnswer={quiz.questions[currentQuestion].correctAnswer || quiz.questions[currentQuestion].answer}
             onSelectAnswer={handleSelectAnswer}
             showResult={showResults}
          />

          {/* Controls */}
          <div className="flex justify-between items-center pt-6">
             <Button 
                onClick={handlePrevious} 
                disabled={currentQuestion === 0} 
                variant="ghost" 
                className="text-slate-400 hover:text-slate-600"
             >
                <FaArrowLeft className="mr-2"/> Previous
             </Button>

             {currentQuestion === quiz.questions.length - 1 ? (
                <Button 
                   onClick={handleSubmit} 
                   variant="success"
                   size="lg"
                   className="shadow-lg shadow-emerald-500/20"
                   disabled={Object.keys(selectedAnswers).length < quiz.questions.length} // Removed strict check to allow partial submission? No, let's allow it but warn visually maybe. Actually let's restrict for now.
                >
                   Submit Quiz <FaCheck className="ml-2"/>
                </Button>
             ) : (
                <Button 
                   onClick={handleNext} 
                   variant="primary" 
                   size="lg"
                   className="shadow-lg shadow-indigo-500/20"
                >
                   Next Question <FaArrowRight className="ml-2"/>
                </Button>
             )}
          </div>

       </div>
    </div>
  );
};

export default Quiz;
