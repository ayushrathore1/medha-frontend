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
        <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--action-primary)" }}>
          Thank you!
        </h3>
        <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
          Your feedback helps us improve{" "}
          <span className="font-semibold" style={{ color: "var(--action-primary)" }}>MEDHA</span> for
          everyone.
        </p>
        <Button
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setMessage("");
          }}
        >
          Send another feedback
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
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
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
            htmlFor="fb-name"
          >
            Your Name
          </label>
          <input
            id="fb-name"
            type="text"
            className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition font-medium"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--accent-secondary)",
              color: "var(--text-primary)",
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
            htmlFor="fb-email"
          >
            Your Email
          </label>
          <input
            id="fb-email"
            type="email"
            className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition font-medium"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--accent-secondary)",
              color: "var(--text-primary)",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Optional (if you want a reply)"
          />
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
          htmlFor="fb-message"
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="fb-message"
          rows={6}
          required
          className="w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition resize-none font-medium"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--accent-secondary)",
            color: "var(--text-primary)",
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your experience, suggestions, or any issues you've encountered..."
        />
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          {message.length}/1000 characters
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="submit"
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
