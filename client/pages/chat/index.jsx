"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { sendMessage } from "../../lib/api";

/**
 * Typewriter Component:
 * Animates the bot's message character by character
 * Uses ReactMarkdown for rendering Markdown and LaTeX
 */
const TypewriterText = ({ text, speed = 10 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // Remove any stray leading asterisks
    const cleanedText = text.replace(/^\*/, "");
    let i = 0;
    setDisplayedText("");

    // Add one character at a time
    const timer = setInterval(() => {
      if (i < cleanedText.length) {
        setDisplayedText((prev) => prev + cleanedText.charAt(i));
        i++;
      } else {
        clearInterval(timer); // Stop when done
      }
    }, speed);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [text, speed]);

  return (
    <div className="ai-prose">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {displayedText}
      </ReactMarkdown>
    </div>
  );
};

/**
 * Main ChatPage Component
 * Renders chat interface for +2 study assistant
 */
export default function ChatPage() {
  // -----------------------------
  // State Variables
  // -----------------------------
  const [messages, setMessages] = useState([
    {
      id: "initial",
      text: "Hello! I'm your +2 Nepal study assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState(""); // Input box value
  const [loading, setLoading] = useState(false); // Bot thinking indicator
  const messagesEndRef = useRef(null); // For auto-scrolling

  // -----------------------------
  // Auto-scroll to bottom on new messages
  // -----------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // -----------------------------
  // Handle sending a message
  // -----------------------------
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now() + Math.random(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const currentPrompt = inputMessage;
    setInputMessage(""); // Clear input
    setLoading(true); // Show "thinking" indicator

    try {
      const result = await sendMessage(currentPrompt); // Call backend API

      // Add bot response
      const botMessage = {
        id: Date.now() + Math.random(),
        text: result.success
          ? result.data
          : "Sorry, I couldn't process that. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString(),
        isNew: true, // Triggers typewriter effect
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat Error:", err);
      // Show error message in chat
      const errorMessage = {
        id: Date.now() + Math.random(),
        text: "Network error. Make sure your backend server is running.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false); // Stop "thinking"
    }
  };

  // -----------------------------
  // Framer-motion animation variants (can expand later)
  // -----------------------------
  const messageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-screen max-w-5xl mx-auto bg-white shadow-2xl overflow-hidden md:border-x border-gray-100"
    >
      {/* -----------------------------
          Header
          Sticky, glassmorphism effect, shows bot name, status & region
      ----------------------------- */}
      <header className="sticky top-0 z-20 bg-gradient-to-r from-indigo-700/95 to-purple-700/95 backdrop-blur-md p-4 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          {/* Bot icon */}
          <div className="bg-white/20 p-2.5 rounded-2xl text-2xl shadow-inner">
            🎓
          </div>

          {/* Bot name & active status */}
          <div>
            <h2 className="text-xl font-extrabold tracking-tight leading-none">
              +2 Study Assistant
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-100">
                Active Learning Node
              </p>
            </div>
          </div>
        </div>

        {/* Region info (hidden on small screens) */}
        <div className="hidden sm:flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/10">
          <div className="text-right">
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-tighter">
              Region
            </p>
            <p className="text-xs font-medium">Nepal</p>
          </div>
        </div>
      </header>

      {/* -----------------------------
          Messages Area
          Scrollable chat with animated bubbles
      ----------------------------- */}
      <main className="flex-1 relative flex flex-col overflow-hidden bg-slate-50">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Message bubble */}
                <div
                  className={`relative group max-w-[85%] md:max-w-[80%] px-6 py-4 shadow-md transition-shadow hover:shadow-lg ${
                    message.sender === "user"
                      ? "bg-indigo-600 text-white rounded-[2rem] rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-[2rem] rounded-tl-none"
                  }`}
                >
                  {/* Message content */}
                  <div
                    className={`prose prose-sm md:prose-base leading-relaxed ${
                      message.sender === "user" ? "prose-invert" : "text-gray-800"
                    }`}
                  >
                    {message.sender === "bot" && message.id !== "initial" ? (
                      <TypewriterText text={message.text} />
                    ) : (
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div
                    className={`text-[9px] mt-3 font-bold uppercase tracking-widest opacity-60 ${
                      message.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading / Thinking indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-gray-200 rounded-3xl rounded-tl-none px-6 py-4 shadow-sm flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.8s]" />
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                </div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                  Assistant is thinking
                </span>
              </div>
            </motion.div>
          )}

          {/* Dummy div to auto-scroll to bottom */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* -----------------------------
          Footer / Input Area
          Text input + send button
      ----------------------------- */}
      <footer className="p-4 md:p-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSendMessage}
            className="relative flex items-center"
          >
            {/* Input box */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about Physics, Chemistry, Biology..."
              className="w-full bg-gray-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl py-4 pl-6 pr-16 outline-none text-gray-800 text-sm md:text-base transition-all shadow-inner"
            />
            {/* Send button */}
            <div className="absolute right-2 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || !inputMessage.trim()}
                className="bg-indigo-600 text-white p-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </motion.button>
            </div>
          </form>

          {/* Footer notes */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 mt-4 px-2">
            <p className="text-[10px] text-gray-400 font-medium">
              Check textbooks for exam preparation.
            </p>
            <div className="flex gap-4 text-[10px] font-bold text-indigo-600/60 uppercase tracking-widest">
              <span>Physics</span>
              <span>Chemistry</span>
              <span>Biology</span>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}