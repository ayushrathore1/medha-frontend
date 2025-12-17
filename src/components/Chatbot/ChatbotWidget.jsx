import React, { useState, useRef, useEffect } from "react";
import Button from "../Common/Button";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Typewriter component for streaming text effect
const TypewriterText = ({ text, speed = 10, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;
    
    let index = 0;
    setDisplayedText("");
    setIsComplete(false);

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <div className="whitespace-pre-wrap">
      {displayedText}
      {!isComplete && <span className="animate-pulse inline-block w-2 h-4 ml-1 bg-current align-middle"></span>}
    </div>
  );
};

const ChatbotWidget = ({ messages, onSendMessage, isTyping }) => {
  const [input, setInput] = useState("");
  const [animatingIndex, setAnimatingIndex] = useState(-1);
  const chatEndRef = useRef(null);
  const chatScrollRef = useRef(null);
  const [atBottom, setAtBottom] = useState(true);
  const prevMessagesLength = useRef(messages?.length || 0);

  useEffect(() => {
    const currentLength = messages?.length || 0;
    const prevLength = prevMessagesLength.current;
    
    if (currentLength === prevLength + 1) {
      const newMessage = messages[messages.length - 1];
      if (newMessage.sender === "bot") {
        setAnimatingIndex(messages.length - 1);
      }
    } else if (currentLength !== prevLength) {
      setAnimatingIndex(-1);
    }
    
    prevMessagesLength.current = currentLength;
  }, [messages]);

  useEffect(() => {
    if (atBottom) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, atBottom, isTyping]); // scroll on typing too

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && onSendMessage) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleScroll = () => {
    if (chatScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatScrollRef.current;
      setAtBottom(scrollHeight - scrollTop - clientHeight < 100);
    }
  };

  const handleTypewriterComplete = () => {
    setAnimatingIndex(-1);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* Chat messages area */}
      <div
        ref={chatScrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6"
      >
        {messages && messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} gap-3 px-2`}
          >
            {/* Bot Avatar */}
            {msg.sender === "bot" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md self-start mt-1">
                <FaRobot className="text-white text-sm" />
              </div>
            )}
            
            {/* Message Bubble */}
            <div
              className={`max-w-[85%] md:max-w-[70%] px-5 py-4 shadow-sm text-sm md:text-base leading-relaxed ${
                msg.sender === "user" 
                  ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm" 
                  : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-sm"
              }`}
            >
              {msg.sender === "bot" && idx === animatingIndex ? (
                <TypewriterText 
                  text={msg.text} 
                  speed={8} 
                  onComplete={handleTypewriterComplete}
                />
              ) : (
                msg.sender === "bot" ? (
                   <div className="prose prose-sm max-w-none prose-slate">
                     <ReactMarkdown 
                        children={msg.text} 
                        remarkPlugins={[remarkGfm]}
                        components={{
                           p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                           a: ({node, ...props}) => <a className="text-indigo-600 hover:underline" {...props} />,
                           code: ({node, inline, ...props}) => 
                              inline 
                              ? <code className="bg-slate-100 text-indigo-600 px-1 py-0.5 rounded text-xs font-mono" {...props} />
                              : <code className="block bg-slate-800 text-slate-100 p-3 rounded-lg text-xs font-mono my-2 overflow-x-auto" {...props} />
                        }}
                     />
                   </div>
                ) : (
                   <p className="whitespace-pre-wrap">{msg.text}</p>
                )
              )}
            </div>

            {/* User Avatar */}
            {msg.sender === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shadow-sm self-start mt-1">
                <FaUser className="text-slate-500 text-sm" />
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3 px-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <FaRobot className="text-white text-sm" />
            </div>
            <div className="px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
               <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
               <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-slate-200">
         <form
           onSubmit={handleSubmit}
           className="max-w-4xl mx-auto relative flex gap-3 items-end"
         >
           <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="w-full pl-5 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-0 transition-colors text-slate-800 font-medium placeholder:text-slate-400"
              />
           </div>
           <Button 
             type="submit" 
             variant="primary" 
             disabled={!input.trim() || isTyping}
             className={`h-[52px] w-[52px] rounded-xl flex items-center justify-center p-0 transition-transform ${input.trim() ? 'hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20' : 'opacity-70'}`}
           >
              <FaPaperPlane className={`${input.trim() ? 'ml-[-2px]' : ''}`} />
           </Button>
         </form>
         <p className="text-center text-[10px] sm:text-xs text-slate-400 mt-3 font-medium">
            Medha AI can make mistakes. Verify important info.
         </p>
      </div>
    </div>
  );
};

export default ChatbotWidget;
