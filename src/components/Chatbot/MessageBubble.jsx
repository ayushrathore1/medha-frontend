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
      <span className="mr-2 flex items-center justify-center h-8 w-8 sm:h-8 sm:w-8 rounded-full bg-blue-100 text-blue-700 font-bold shadow text-lg">
        🤖
      </span>
    )}
    <div
      className={`px-3 sm:px-4 py-2 rounded-2xl max-w-[85vw] sm:max-w-[75%] text-sm sm:text-base shadow transition-all ${
        sender === "user"
          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-sm"
          : "bg-blue-50 text-blue-900 border border-blue-100"
      }`}
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
      <span className="ml-2 flex items-center justify-center h-8 w-8 sm:h-8 sm:w-8 rounded-full bg-blue-500 text-white font-bold shadow text-lg">
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
