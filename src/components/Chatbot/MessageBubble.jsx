import React from "react";

// Responsive typewriter text
const TypewriterText = ({ text, speed = 30, onChar, onDone }) => {
  const [displayed, setDisplayed] = React.useState("");
  const idxRef = React.useRef(0);

  React.useEffect(() => {
    setDisplayed("");
    idxRef.current = 0;
    if (text && text.length > 0) {
      const interval = setInterval(() => {
        idxRef.current += 1;
        setDisplayed(text.slice(0, idxRef.current));
        if (onChar) onChar();
        if (idxRef.current >= text.length) {
          clearInterval(interval);
          if (onDone) onDone();
        }
      }, speed);
      return () => clearInterval(interval);
    }
  }, [text, speed, onDone, onChar]);

  return (
    <span className="whitespace-pre-wrap tracking-normal typewriter">
      {displayed}
    </span>
  );
};

const MessageBubble = ({ sender, text, isTyping, speed, onChar, onDone }) => (
  <div
    className={`flex mb-2 sm:mb-3 px-1 ${
      sender === "user" ? "justify-end" : "justify-start"
    }`}
  >
    {sender === "ai" && (
      <span className="mr-2 flex items-center justify-center h-9 w-9 sm:h-9 sm:w-9 rounded-full bg-gradient-to-r from-violet-400 via-blue-400 to-fuchsia-400 text-white font-bold shadow-xl text-xl">
        🤖
      </span>
    )}
    <div
      className={`px-4 py-3 max-w-[85vw] sm:max-w-[77%] rounded-3xl font-inter text-[1rem] shadow-lg transition-all
        ${
          sender === "user"
            ? "bg-white/10 backdrop-blur-xl border border-violet-400/30 text-white font-semibold hover:shadow-xl hover:scale-[1.03]"
            : "bg-gradient-to-r from-violet-500/15 via-blue-500/10 to-purple-500/5 border border-violet-400/10 text-white font-medium hover:scale-[1.02]"
        }`}
      style={{
        transition: "scale 0.25s cubic-bezier(.45,1.25,.32,1)",
      }}
    >
      {sender === "ai" && isTyping ? (
        <TypewriterText
          text={text}
          speed={speed || 30}
          onChar={onChar}
          onDone={onDone}
        />
      ) : (
        <span className="whitespace-pre-wrap">{text}</span>
      )}
    </div>
    {sender === "user" && (
      <span className="ml-2 flex items-center justify-center h-9 w-9 sm:h-9 sm:w-9 rounded-full bg-gradient-to-r from-violet-400 via-blue-400 to-purple-400 text-white font-bold shadow text-xl">
        🧑
      </span>
    )}
    <style>
      {`
      .typewriter {
        animation: typingShow 0.3s ease-in;
      }
      @keyframes typingShow {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      `}
    </style>
  </div>
);

export default MessageBubble;
