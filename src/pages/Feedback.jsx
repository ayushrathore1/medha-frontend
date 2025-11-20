import React from "react";
import FeedbackForm from "../components/Feedback/FeedbackForm";
import Footer from "../components/Common/Footer";
import Card from "../components/Common/Card";

// Example submit handler; wire this to your backend later!
const submitFeedback = async ({ name, email, message }) => {
  void name;
  void email;
  void message;
  await new Promise((resolve) => setTimeout(resolve, 700));
};

const Feedback = () => (
  <div className="min-h-screen flex flex-col pt-20 pb-10 px-4">
    {/* Header Section */}
    <Card className="max-w-5xl mx-auto w-full mb-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: "var(--action-primary)" }}>
          💬 Feedback & Suggestions
        </h1>
        <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
          Help us make <span className="font-bold" style={{ color: "var(--action-primary)" }}>MEDHA</span>{" "}
          better for everyone!
        </p>
      </div>
    </Card>

    {/* Main Content */}
    <div className="max-w-5xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Information */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-2xl font-bold mb-5" style={{ color: "var(--action-primary)" }}>
              We Value Your Input
            </h2>
            <p className="mb-7 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Your feedback helps us improve MEDHA and create a better
              learning experience for all students.
            </p>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div 
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow"
                  style={{ backgroundColor: "var(--accent-tertiary)" }}
                >
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
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>Bug Reports</h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Found something broken? Let us know!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div 
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow"
                  style={{ backgroundColor: "var(--accent-primary)" }}
                >
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
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    Feature Ideas
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Have suggestions for new features?
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div 
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow"
                  style={{ backgroundColor: "var(--accent-secondary)" }}
                >
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
                  <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    General Feedback
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Share your overall experience with us
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-7 p-4 rounded-2xl" style={{ 
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--accent-secondary)"
            }}>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                <strong>Note:</strong> Email is optional but helps us respond
                personally.
              </p>
            </div>
          </Card>
        </div>
        
        {/* Right Side - Form */}
        <div className="lg:col-span-2">
          <Card>
            <FeedbackForm onSubmitFeedback={submitFeedback} />
          </Card>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="mt-auto pt-10">
      <Footer />
    </div>
  </div>
);

export default Feedback;
