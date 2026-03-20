"use client";

import { useState } from "react";
import { FaPaperPlane, FaTimes, FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { useChatbot } from "../hooks/useChatbot";
import TypingDots from "./ui/TypingDots";

/**
 * ChatWidget Component
 * Floating chatbot overlay for study assistance
 */
export default function ChatWidget({ metaData, selectedSubtopic }) {
  const [isOpen, setIsOpen] = useState(false);  // Chat overlay open/close
  const [message, setMessage] = useState("");   // Current input message
  const [messages, setMessages] = useState([]); // Chat history

  const { askChatbot, loading } = useChatbot({ metaData, selectedSubtopic });

  const toggleChat = () => setIsOpen((prev) => !prev);

  /**
   * Handles sending a message
   */
  const sendMessage = async () => {
    if (!message.trim() || !selectedSubtopic) return;

    const userMessage = message.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setMessage("");

    try {
      const botReply = await askChatbot(userMessage);
      const botText =
        typeof botReply === "string"
          ? botReply
          : botReply?.text || botReply?.content || "⚠️ Empty response.";

      setMessages((prev) => [...prev, { role: "bot", text: botText }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "⚠️ Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    }
  };

  const clearChat = () => setMessages([]); // Clear history

  return (
    <>
      {/* Floating Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 
                  hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-xl 
                  transition-all duration-300 hover:scale-105 flex items-center justify-center"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <FaTimes className="text-lg" />
        ) : (
          <div className="relative">
            <FaRobot className="text-xl" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        )}
      </button>

      {/* Chat Overlay */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg flex items-center gap-2">
                <FaRobot /> Study Assistant
              </h2>
              <p className="text-xs opacity-90">
                {selectedSubtopic?.title || selectedSubtopic?.name || "General Topic"}
              </p>
            </div>
            <div className="flex gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                >
                  Clear
                </button>
              )}
              <button onClick={toggleChat} className="hover:bg-white/20 p-1 rounded-full">
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white space-y-4">
            
            {/* Initial Empty State */}
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FaRobot className="text-2xl text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Study Chat Assistant
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Ask questions about the current topic to get instant explanations and help.
                </p>
                <div className="text-xs text-gray-400 bg-gray-100 px-3 py-2 rounded-lg">
                  Try: "Can you explain this concept?" or "Give me an example"
                </div>
              </div>
            ) : (
              // Render all messages
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 transition-all
                      ${msg.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200"
                      }`}
                  >
                    {msg.role === "bot" ? (
                      <div className="prose prose-sm max-w-none 
                                      prose-headings:text-base prose-headings:font-bold 
                                      prose-p:my-1.5 prose-li:my-0.5 
                                      prose-ol:list-decimal prose-ul:list-disc 
                                      prose-strong:text-indigo-700 
                                      prose-em:text-gray-600 
                                      prose-blockquote:border-l-4 prose-blockquote:border-indigo-400 
                                      prose-blockquote:bg-indigo-50 prose-blockquote:px-3 
                                      prose-code:bg-gray-200 prose-code:px-1 rounded-md">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Typing Indicator */}
            {loading && <TypingDots />}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask a question about this topic..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!selectedSubtopic}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !message.trim() || !selectedSubtopic}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 
                           text-white p-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <FaPaperPlane />
              </button>
            </div>
            {!selectedSubtopic && (
              <p className="text-xs text-amber-600 mt-2 text-center">
                Please select a subtopic to start chatting
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}