import React, { useState } from "react";

const FeedbackForm = ({ onSubmitFeedback }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      if (onSubmitFeedback) {
        await onSubmitFeedback({ name, email, message });
      } else {
        // Replace with your API/form integration here
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
      setSent(true);
    } catch {
      setErrorMsg("Failed to send feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-blue-700 mb-3">Thank you!</h3>
        <p className="text-blue-600 mb-4">
          Your feedback helps us improve MEDHA for everyone.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setMessage("");
          }}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Send another feedback
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          Send us your feedback
        </h2>
        <p className="text-blue-600">We'd love to hear from you!</p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-sm font-medium text-blue-700 mb-2"
            htmlFor="fb-name"
          >
            Your Name
          </label>
          <input
            id="fb-name"
            type="text"
            className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-blue-700 mb-2"
            htmlFor="fb-email"
          >
            Your Email
          </label>
          <input
            id="fb-email"
            type="email"
            className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Optional (if you want a reply)"
          />
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium text-blue-700 mb-2"
          htmlFor="fb-message"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="fb-message"
          rows={6}
          required
          className="w-full border border-blue-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors resize-none text-gray-900 placeholder-gray-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your experience, suggestions, or any issues you've encountered..."
        />
        <p className="mt-2 text-sm text-blue-600">
          {message.length}/1000 characters
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className={`flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center ${
            loading ? "opacity-60 cursor-wait" : ""
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Send Feedback
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default FeedbackForm;
