import React, { useEffect, useState } from "react";
import AOS from "aos"; // Animate On Scroll library
import "aos/dist/aos.css";
import Lottie from "lottie-react"; // For animation
import { FaCheckCircle, FaStar, FaQuestionCircle } from "react-icons/fa";
import studentAnimation from "../../animations/student.json"; // Lottie animation JSON

export default function About() {
  // State to manage which FAQ is currently open
  const [faqOpen, setFaqOpen] = useState(null);

  // Initialize AOS (Animate On Scroll) when component mounts
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Animation duration: 1000ms
  }, []);

  // Function to toggle FAQ items open/closed
  const toggleFAQ = (index) => {
    setFaqOpen(faqOpen === index ? null : index); // Close if already open, else open
  };

  // Array of FAQ objects with question and answer
  const faqs = [
    {
      question: "How does SmartPrep AI work?",
      answer:
        "Upload your notes in PDF format, and SmartPrep AI will use AI to explain the content and generate quizzes to help you revise.",
    },
    {
      question: "Do I need to sign up to use it?",
      answer:
        "Yes, creating a free account helps you save your quizzes and track your progress.",
    },
    {
      question: "Can I use it on my phone?",
      answer:
        "Absolutely! SmartPrep AI is fully responsive and works well on mobile, tablet, and desktop devices.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-white overflow-hidden px-6 py-20">
      {/* -----------------------------
          Background Lottie Animation
          Positioned behind content with blur and low opacity
      ----------------------------- */}
      <div
        className="absolute inset-0 -z-10 opacity-20 pointer-events-none"
        style={{ filter: "blur(4px)" }}
      >
        <Lottie
          animationData={studentAnimation}
          loop={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* -----------------------------
          Main content container
      ----------------------------- */}
      <div className="relative max-w-5xl mx-auto text-gray-800">
        {/* Flex container for About text and animation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left side: About Text */}
          <div className="md:w-1/2" data-aos="fade-right">
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">
              About <span className="text-purple-600">SmartPrep AI</span>
            </h2>
            <p className="text-lg mb-4">
              <strong>SmartPrep AI</strong> is a personalized learning platform
              mainly focused on <strong>+2 science students</strong>, helping
              them succeed in their studies and ace entrance exams. It teaches
              students based on their <strong>learning capability</strong> using
              smart AI algorithms.
            </p>
            <p className="text-md text-gray-700">
              SmartPrep AI empowers students to learn smarter by simplifying
              complex topics, personalizing their study path, and generating
              instant multiple-choice quizzes from uploaded notes. Whether
              you're preparing for board exams or entrance tests, SmartPrep AI
              supports your journey with AI-powered tools.
            </p>
          </div>

          {/* Right side: Lottie Animation */}
          <div className="md:w-1/2" data-aos="fade-left">
            <Lottie
              animationData={studentAnimation}
              loop={true}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* -----------------------------
            Features Section
        ----------------------------- */}
        <h2
          className="text-2xl font-semibold mt-16 mb-4 flex items-center gap-2"
          data-aos="fade-up"
        >
          <FaStar className="text-amber-400" />
          Features You’ll Love
        </h2>
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {[
            "Upload PDFs and extract notes instantly",
            "AI-powered concept explanation",
            "Auto-generated multiple-choice quizzes",
            "Adaptive learning based on your progress",
            "Focus on +2 Science and entrance exam prep",
            "Chatbot for topic-specific doubts",
          ].map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <FaCheckCircle className="text-indigo-500 mt-1" />
              <span className="text-lg">{feature}</span>
            </li>
          ))}
        </ul>

        {/* -----------------------------
            FAQ Section
            Toggleable questions and answers
        ----------------------------- */}
        <div className="mt-12" data-aos="fade-up">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FaQuestionCircle className="text-blue-500 w-6 h-6" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                {/* Question button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left font-medium text-indigo-600 text-lg focus:outline-none"
                >
                  {item.question}
                </button>
                {/* Show answer only if this FAQ is open */}
                {faqOpen === index && (
                  <p className="mt-2 text-gray-700">{item.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}