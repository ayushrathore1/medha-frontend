import React, { useState } from "react";
import Button from "../Common/Button";

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
<<<<<<< HEAD
      <div className="text-center rounded-3xl py-14 px-8 max-w-xl mx-auto border-2 shadow-2xl" style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--accent-secondary)"
      }}>
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl text-white"
          style={{ background: `linear-gradient(to bottom right, var(--accent-primary), var(--accent-secondary))` }}
        >
          <svg
            className="w-8 h-8"
=======
      <div className="text-center bg-[#0a0a0a] rounded-3xl py-14 px-8 max-w-xl mx-auto backdrop-blur-xl border border-violet-700/20 shadow-2xl">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 bg-gradient-to-br from-emerald-400/60 via-blue-400/40 to-purple-400/30 shadow-xl">
          <svg
            className="w-8 h-8 text-white"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
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
<<<<<<< HEAD
        <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--action-primary)" }}>
          Thank you!
        </h3>
        <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
          Your feedback helps us improve{" "}
          <span className="font-semibold" style={{ color: "var(--action-primary)" }}>MEDHA</span> for
=======
        <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-3">
          Thank you!
        </h3>
        <p className="text-violet-300 mb-4">
          Your feedback helps us improve{" "}
          <span className="font-semibold text-blue-200">MEDHA</span> for
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          everyone.
        </p>
        <Button
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setMessage("");
          }}
<<<<<<< HEAD
=======
          className="bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 rounded-xl text-white font-medium hover:scale-[1.04] shadow-xl transition"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
        >
          Send another feedback
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
<<<<<<< HEAD
      className="rounded-3xl max-w-xl mx-auto px-8 py-10 border-2 shadow-2xl space-y-6"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--accent-secondary)"
      }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--action-primary)" }}>
          Send us your feedback
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>We'd love to hear from you!</p>
      </div>

      {errorMsg && (
        <div className="border-2 rounded-xl p-4 mb-2 text-center shadow" style={{
          backgroundColor: "#fef2f2",
          borderColor: "#fca5a5",
          color: "#dc2626"
        }}>
          <span className="text-sm">{errorMsg}</span>
=======
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
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
<<<<<<< HEAD
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
=======
            className="block text-sm font-medium text-violet-300 mb-2"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
            htmlFor="fb-name"
          >
            Your Name
          </label>
          <input
            id="fb-name"
            type="text"
<<<<<<< HEAD
            className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition font-medium"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--accent-secondary)",
              color: "var(--text-primary)",
            }}
=======
            className="w-full bg-white/10 backdrop-blur-xl border border-violet-400/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition text-white placeholder-violet-300/80"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div>
          <label
<<<<<<< HEAD
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
=======
            className="block text-sm font-medium text-blue-300 mb-2"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
            htmlFor="fb-email"
          >
            Your Email
          </label>
          <input
            id="fb-email"
            type="email"
<<<<<<< HEAD
            className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition font-medium"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--accent-secondary)",
              color: "var(--text-primary)",
            }}
=======
            className="w-full bg-white/10 backdrop-blur-xl border border-blue-400/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-white placeholder-blue-300/80"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Optional (if you want a reply)"
          />
        </div>
      </div>

      <div>
        <label
<<<<<<< HEAD
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
=======
          className="block text-sm font-medium text-blue-300 mb-2"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          htmlFor="fb-message"
        >
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="fb-message"
          rows={6}
          required
<<<<<<< HEAD
          className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition resize-none font-medium"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--accent-secondary)",
            color: "var(--text-primary)",
          }}
=======
          className="w-full bg-white/10 backdrop-blur-xl border border-violet-400/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition resize-none text-white placeholder-violet-300/70"
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your experience, suggestions, or any issues you've encountered..."
        />
<<<<<<< HEAD
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
=======
        <p className="mt-2 text-sm text-violet-300">
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          {message.length}/1000 characters
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="submit"
<<<<<<< HEAD
=======
          className={`flex-1 bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:scale-[1.03] shadow-xl transition-all duration-150 flex items-center justify-center ${
            loading ? "opacity-60 cursor-wait" : ""
          }`}
>>>>>>> 955bdb36399c7acde998407e68198e6f31b0151e
          disabled={loading}
          loading={loading}
          fullWidth
          icon={
            <svg
              className="w-5 h-5"
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
          }
        >
          Send Feedback
        </Button>
      </div>
    </form>
  );
};

export default FeedbackForm;
