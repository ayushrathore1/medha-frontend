import React from "react";
import FeedbackForm from "../components/Feedback/FeedbackForm";
import Footer from "../components/Common/Footer";

// Example submit handler; wire this to your backend later!
const submitFeedback = async ({ name, email, message }) => {
  void name;
  void email;
  void message;
  await new Promise((resolve) => setTimeout(resolve, 700));
};

const Feedback = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden font-inter">
    {/* Ambient gradient blobs */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute -top-16 left-0 w-2/5 h-64 bg-gradient-to-r from-violet-400/30 to-blue-400/15 rounded-full blur-3xl opacity-25 animate-blob"></div>
      <div className="absolute top-1/2 right-0 w-1/4 h-48 bg-gradient-to-br from-blue-400/25 to-fuchsia-400/15 rounded-full blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/3 w-2/4 h-48 bg-gradient-to-r from-emerald-400/25 to-purple-400/15 rounded-full blur-2xl opacity-20 animate-blob animation-delay-4000"></div>
      <style>{`
        @keyframes blob {
          0% { transform: scale(1) translate(0,0);}
          33% { transform: scale(1.05) translate(14px,-34px);}
          66% { transform: scale(0.92) translate(-18px,15px);}
          100% { transform: scale(1) translate(0,0);}
        }
        .animate-blob { animation: blob 12s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>

    {/* Header Section */}
    <header className="pt-20 bg-[#18163a]/80 backdrop-blur-xl border-b border-violet-400/15 shadow-2xl">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-3 tracking-tight">
            Feedback & Suggestions
          </h1>
          <p className="text-lg text-violet-300 max-w-2xl mx-auto">
            Help us make <span className="font-bold text-blue-200">MEDHA</span>{" "}
            better for everyone!
          </p>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="py-8 md:py-14 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Side - Information */}
          <div className="lg:col-span-1">
            <div className="bg-[#18163a]/90 backdrop-blur-xl border border-violet-400/15 shadow-2xl rounded-3xl p-7">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-5">
                We Value Your Input
              </h2>
              <p className="text-violet-300 mb-7 leading-relaxed">
                Your feedback helps us improve MEDHA and create a better
                learning experience for all students.
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 bg-violet-500/30 rounded-full flex items-center justify-center shadow">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-300">Bug Reports</h3>
                    <p className="text-sm text-violet-300">
                      Found something broken? Let us know!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 bg-emerald-400/30 rounded-full flex items-center justify-center shadow">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-300">
                      Feature Ideas
                    </h3>
                    <p className="text-sm text-violet-300">
                      Have suggestions for new features?
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 bg-blue-300/30 rounded-full flex items-center justify-center shadow">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-200">
                      General Feedback
                    </h3>
                    <p className="text-sm text-violet-300">
                      Share your overall experience with us
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-7 p-4 bg-violet-400/10 rounded-2xl border border-violet-400/15">
                <p className="text-sm text-blue-200">
                  <strong>Note:</strong> Email is optional but helps us respond
                  personally.
                </p>
              </div>
            </div>
          </div>
          {/* Right Side - Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#18163a]/90 backdrop-blur-xl border border-violet-400/15 shadow-2xl rounded-3xl p-8">
              <FeedbackForm onSubmitFeedback={submitFeedback} />
            </div>
          </div>
        </div>
      </div>
    </main>

    {/* Footer */}
    <Footer />
  </div>
);

export default Feedback;
