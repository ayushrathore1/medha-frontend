import React, { useState, useRef, useEffect } from "react";
import Button from "../Common/Button";
import { FaPaperPlane, FaRobot, FaUser, FaPenToSquare, FaArrowsRotate, FaCheck, FaXmark } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Semantic color patterns for dynamic text coloring
const colorPatterns = [
  // Success/positive
  { pattern: /\b(correct|right|success|successfull?y?|passed|valid|works?|solved|fixed|done|complete[d]?|achieved|excellent|perfect|great|good|yes|✓|✅)\b/gi, className: "text-emerald-600 font-semibold" },
  // Errors/negative
  { pattern: /\b(error|wrong|incorrect|fail(ed|ure)?|invalid|broken|bug|issue|problem|crash|exception|undefined|null|NaN|✗|❌)\b/gi, className: "text-red-600 font-semibold" },
  // Warnings
  { pattern: /\b(warning|caution|careful|note|attention|important|beware|avoid|deprecated|danger)\b/gi, className: "text-amber-600 font-semibold" },
  // Key concepts
  { pattern: /\b(definition|concept|key|main|primary|fundamental|essential|core|basic|principle)\b/gi, className: "text-violet-600 font-semibold" },
  // Tips/hints
  { pattern: /\b(tip|hint|suggestion|recommend|advice|pro-tip|trick|shortcut)\b/gi, className: "text-cyan-600 font-semibold" },
  // Numbers/statistics
  { pattern: /\b(\d+%|\d+\.\d+%|O\([\w\^]+\)|O\(n\)|O\(1\)|O\(log n\)|O\(n²\))\b/gi, className: "text-indigo-600 font-bold" },
];

// Component to apply semantic colors to text
const ColoredText = ({ children }) => {
  if (typeof children !== 'string') return children;
  
  let result = children;
  let segments = [{ text: children, className: null }];
  
  colorPatterns.forEach(({ pattern, className }) => {
    const newSegments = [];
    segments.forEach(segment => {
      if (segment.className) {
        newSegments.push(segment);
        return;
      }
      
      const parts = segment.text.split(pattern);
      const matches = segment.text.match(pattern) || [];
      
      parts.forEach((part, i) => {
        if (part) newSegments.push({ text: part, className: null });
        if (matches[i]) newSegments.push({ text: matches[i], className });
      });
    });
    segments = newSegments;
  });
  
  return (
    <>
      {segments.map((seg, i) => 
        seg.className ? (
          <span key={i} className={seg.className}>{seg.text}</span>
        ) : (
          seg.text
        )
      )}
    </>
  );
};

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

const ChatbotWidget = ({ messages, onSendMessage, onEditMessage, onRegenerateResponse, isTyping, userAvatar }) => {
  const [input, setInput] = useState("");
  const [animatingIndex, setAnimatingIndex] = useState(-1);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editText, setEditText] = useState("");
  const chatEndRef = useRef(null);
  const chatScrollRef = useRef(null);
  const [atBottom, setAtBottom] = useState(true);
  const prevMessagesLength = useRef(messages?.length || 0);

  // Handle edit submission
  const handleEditSubmit = (idx) => {
    if (editText.trim() && onEditMessage) {
      onEditMessage(idx, editText.trim());
      setEditingIndex(-1);
      setEditText("");
    }
  };

  // Handle regenerate
  const handleRegenerate = (idx) => {
    if (onRegenerateResponse) {
      onRegenerateResponse(idx);
    }
  };

  // Start editing
  const startEditing = (idx, text) => {
    setEditingIndex(idx);
    setEditText(text);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingIndex(-1);
    setEditText("");
  };

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
    <div className="flex flex-col h-full bg-transparent relative">
      
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--action-primary)] to-[var(--action-hover)] flex items-center justify-center shadow-md self-start mt-1">
                <FaRobot className="text-white text-sm" />
              </div>
            )}
            
            {/* Message Bubble */}
            <div
              className={`max-w-[85%] md:max-w-[70%] px-5 py-4 shadow-sm text-sm md:text-base leading-relaxed ${
                msg.sender === "user" 
                  ? "bg-[var(--action-primary)] text-white rounded-2xl rounded-tr-sm" 
                  : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-default)] rounded-2xl rounded-tl-sm"
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
                        rehypePlugins={[rehypeRaw]}
                        components={{
                           // Paragraphs with colored text
                           p: ({node, children, ...props}) => (
                              <p className="mb-3 last:mb-0 leading-relaxed text-[var(--text-primary)]" {...props}>
                                 {React.Children.map(children, child => 
                                    typeof child === 'string' ? <ColoredText>{child}</ColoredText> : child
                                 )}
                              </p>
                           ),
                           
                           // Links with accent color
                           a: ({node, ...props}) => <a className="text-[var(--action-primary)] font-semibold hover:underline hover:text-[var(--action-hover)] transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                           
                           // Headings with gradient accent
                           h1: ({node, ...props}) => <h1 className="text-xl font-black text-[var(--text-primary)] mt-4 mb-2 pb-1 border-b-2 border-[var(--action-primary)]/30" {...props} />,
                           h2: ({node, ...props}) => <h2 className="text-lg font-bold text-[var(--action-primary)] mt-4 mb-2" {...props} />,
                           h3: ({node, ...props}) => <h3 className="text-base font-bold text-[var(--text-secondary)] mt-3 mb-1" {...props} />,
                           h4: ({node, ...props}) => <h4 className="text-sm font-bold text-[var(--text-tertiary)] mt-2 mb-1" {...props} />,
                           
                           // Bold text with color
                           strong: ({node, ...props}) => <strong className="font-bold text-[var(--action-primary)]" {...props} />,
                           
                           // Italic text
                           em: ({node, ...props}) => <em className="italic text-[var(--text-secondary)]" {...props} />,
                           
                           // Code - inline and block
                           code: ({node, inline, className, children, ...props}) => {
                              const match = /language-(\w+)/.exec(className || '');
                              const language = match ? match[1] : '';
                              
                              return inline ? (
                                 <code className="bg-[var(--action-primary)]/10 text-[var(--action-primary)] px-1.5 py-0.5 rounded font-mono text-xs font-semibold border border-[var(--action-primary)]/20" {...props}>
                                    {children}
                                 </code>
                              ) : (
                                 <div className="relative group my-3">
                                    {language && (
                                       <div className="absolute top-0 right-0 bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded-bl-lg font-mono uppercase">
                                          {language}
                                       </div>
                                    )}
                                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-700 shadow-inner">
                                       <code className={className} {...props}>
                                          {children}
                                       </code>
                                    </pre>
                                 </div>
                              );
                           },
                           
                           // Pre wrapper
                           pre: ({node, ...props}) => <div {...props} />,
                           
                           // Blockquotes with accent bar
                           blockquote: ({node, ...props}) => (
                              <blockquote className="border-l-4 border-[var(--color-warning-bg)] bg-[var(--color-warning-bg)]/10 pl-4 pr-3 py-2 my-3 rounded-r-lg text-[var(--text-secondary)] italic" {...props} />
                           ),
                           
                           // Unordered lists with styled bullets
                           ul: ({node, ...props}) => <ul className="my-2 ml-1 space-y-1" {...props} />,
                           li: ({node, ordered, ...props}) => (
                              <li className="flex items-start gap-2 text-[var(--text-secondary)]">
                                 <span className={`mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${ordered ? 'bg-[var(--action-primary)]' : 'bg-[var(--color-success-bg)]'}`}></span>
                                 <span {...props} />
                              </li>
                           ),
                           
                           // Ordered lists
                           ol: ({node, ...props}) => <ol className="my-2 ml-1 space-y-1 list-decimal list-inside" {...props} />,
                           
                           // Tables with styling
                           table: ({node, ...props}) => (
                              <div className="my-3 overflow-x-auto rounded-xl border border-[var(--border-default)] shadow-sm">
                                 <table className="min-w-full divide-y divide-[var(--border-default)] text-xs" {...props} />
                              </div>
                           ),
                           thead: ({node, ...props}) => <thead className="bg-[var(--bg-tertiary)]" {...props} />,
                           th: ({node, ...props}) => <th className="px-3 py-2 text-left font-bold text-[var(--action-primary)] uppercase tracking-wider text-[10px]" {...props} />,
                           tbody: ({node, ...props}) => <tbody className="bg-[var(--bg-secondary)] divide-y divide-[var(--border-default)]" {...props} />,
                           tr: ({node, ...props}) => <tr className="hover:bg-[var(--bg-tertiary)] transition-colors even:bg-[var(--bg-tertiary)]/50" {...props} />,
                           td: ({node, ...props}) => <td className="px-3 py-2 text-[var(--text-secondary)] whitespace-nowrap" {...props} />,
                           
                           // Horizontal rule
                           hr: ({node, ...props}) => <hr className="my-4 border-t-2 border-[var(--border-default)]" {...props} />,
                           
                           // Images
                           img: ({node, ...props}) => (
                              <img className="rounded-xl shadow-md my-3 max-w-full" {...props} />
                           ),
                        }}
                     />
                   </div>
                ) : (
                   // User message with edit capability
                   editingIndex === idx ? (
                      <div className="flex flex-col gap-2 w-full min-w-[200px]">
                         <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[var(--action-primary)] text-white border border-[var(--action-primary)]/50 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none text-sm"
                            rows={3}
                            autoFocus
                         />
                         <div className="flex gap-2 justify-end">
                            <button
                               onClick={cancelEditing}
                               className="px-3 py-1.5 text-xs font-medium text-indigo-200 hover:text-white transition-colors flex items-center gap-1"
                            >
                               <FaXmark size={10} /> Cancel
                            </button>
                            <button
                               onClick={() => handleEditSubmit(idx)}
                               className="px-3 py-1.5 text-xs font-bold bg-white text-[var(--action-primary)] rounded-lg hover:bg-[var(--bg-primary)] transition-colors flex items-center gap-1"
                            >
                               <FaCheck size={10} /> Save & Resend
                            </button>
                         </div>
                      </div>
                   ) : (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                   )
                )
              )}
              
              {/* Edit button for user messages */}
              {msg.sender === "user" && editingIndex !== idx && !isTyping && (
                 <div className="flex justify-end mt-1">
                    <button
                       onClick={() => startEditing(idx, msg.text)}
                       className="text-[10px] text-indigo-200 hover:text-white flex items-center gap-1 transition-colors"
                       title="Edit message"
                    >
                       <FaPenToSquare size={10} /> Edit
                    </button>
                 </div>
              )}
              
              {/* Regenerate button for bot messages */}
              {msg.sender === "bot" && idx === messages.length - 1 && !isTyping && animatingIndex !== idx && idx > 0 && (
                 <div className="flex justify-start mt-2">
                    <button
                       onClick={() => handleRegenerate(idx)}
                       className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--action-primary)] flex items-center gap-1 transition-colors bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] px-2 py-1 rounded-lg"
                       title="Regenerate response"
                    >
                       <FaArrowsRotate size={10} /> Regenerate
                    </button>
                 </div>
              )}
            </div>

            {/* User Avatar */}
            {msg.sender === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center shadow-sm self-start mt-1 overflow-hidden">
                {userAvatar ? (
                  <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <FaUser className="text-[var(--text-tertiary)] text-sm" />
                )}
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3 px-2">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--action-primary)] to-[var(--action-hover)] flex items-center justify-center shadow-md">
              <FaRobot className="text-white text-sm" />
            </div>
            <div className="px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
               <span className="w-2 h-2 bg-[var(--action-primary)]/70 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-[var(--action-primary)]/70 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
               <span className="w-2 h-2 bg-[var(--action-primary)]/70 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-[var(--bg-secondary)] border-t border-[var(--border-default)]">
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
                className="w-full pl-5 pr-4 py-3.5 bg-[var(--bg-tertiary)] border-2 border-[var(--border-default)] rounded-xl focus:outline-none focus:border-[var(--action-primary)] focus:ring-0 transition-colors text-[var(--text-primary)] font-medium placeholder:text-[var(--text-tertiary)]"
              />
           </div>
           <Button 
             type="submit" 
             variant="primary" 
             disabled={!input.trim() || isTyping}
             className={`h-[52px] w-[52px] rounded-xl flex items-center justify-center p-0 transition-transform ${input.trim() ? 'hover:scale-105 active:scale-95 shadow-lg shadow-[var(--action-primary)]/20' : 'opacity-70'}`}
           >
              <FaPaperPlane className={`${input.trim() ? 'ml-[-2px]' : ''}`} />
           </Button>
         </form>
         <p className="text-center text-[10px] sm:text-xs text-[var(--text-tertiary)] mt-3 font-medium">
            Medha AI can make mistakes. Verify important info.
         </p>
      </div>
    </div>
  );
};

export default ChatbotWidget;
