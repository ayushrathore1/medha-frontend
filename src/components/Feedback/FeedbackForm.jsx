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
      <div className="text-center bg-[#0a0a0a] rounded-3xl py-14 px-8 max-w-xl mx-auto backdrop-blur-xl border border-violet-700/20 shadow-2xl">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-gradient-to-br from-emerald-400/60 via-blue-400/40 to-purple-400/30 shadow-xl">
          <svg
            className="w-8 h-8 text-white"
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
        <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-3">
          Thank you!
        </h3>
        <p className="text-violet-300 mb-4">
          Your feedback helps us improve{" "}
          <span className="font-semibold text-blue-200">MEDHA</span> for
          everyone.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setMessage("");
          }}
          className="bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 rounded-xl text-white font-medium hover:scale-[1.04] shadow-xl transition"
        >
          Send another feedback
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0a0a0a] rounded-3xl max-w-xl mx-auto px-8 py-10 border border-violet-700/20 shadow-2xl backdrop-blur-2xl space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Send us your feedback
        </h2>
        <p className="text-violet-300">We'd love to hear from you!</p>
      </div>

      {errorMsg && (
        <div className="border border-red-300/70 bg-red-500/10 rounded-xl p-4 mb-2 text-center shadow">
          <span className="text-sm text-red-200">{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-sm font-medium text-violet-300 mb-2"
            htmlFor="fb-name"
          >
            Your Name
          </label>
          <input
            id="fb-name"
            type="text"
            className="w-full bg-white/10 backdrop-blur-xl border border-violet-400/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition text-white placeholder-violet-300/80"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-blue-300 mb-2"
            htmlFor="fb-email"
          >
            Your Email
          </label>
          <input
            id="fb-email"
            type="email"
            className="w-full bg-white/10 backdrop-blur-xl border border-blue-400/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-white placeholder-blue-300/80"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Optional (if you want a reply)"
          />
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium text-blue-300 mb-2"
          htmlFor="fb-message"
        >
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="fb-message"
          rows={6}
          required
          className="w-full bg-white/10 backdrop-blur-xl border border-violet-400/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition resize-none text-white placeholder-violet-300/70"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your experience, suggestions, or any issues you've encountered..."
        />
        <p className="mt-2 text-sm text-violet-300">
          {message.length}/1000 characters
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className={`flex-1 bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:scale-[1.03] shadow-xl transition-all duration-150 flex items-center justify-center ${
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
