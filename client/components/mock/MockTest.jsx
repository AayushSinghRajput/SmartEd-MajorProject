"use client"; // Client-side Next.js component

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown"; // Render Markdown for questions and options
import remarkMath from "remark-math"; // Enable LaTeX math in Markdown
import rehypeKatex from "rehype-katex"; // Render LaTeX math
import { Toaster } from "react-hot-toast"; // Toast notifications
import { useMockTest } from "../../hooks/useMockTest"; // Custom hook for mock test state & logic
import { useExamTimer } from "../../hooks/useExamTimer"; // Custom hook for countdown timer
import { formatTime } from "../../utils/formatTime"; // Format seconds into mm:ss
import { FaBrain, FaCog, FaStethoscope } from "react-icons/fa"; // Icons for UI
import { ENGINEERING_TEST_DURATION, MEDICAL_TEST_DURATION } from "../../lib/constants"; // Exam durations

export default function MockTest() {
  // Destructure all state and actions from mock test hook
  const {
    examData,           // Full exam data including questions
    currentQuestion,    // Index of current question
    answers,            // User's selected answers
    score,              // Calculated score
    showResult,         // Boolean: show result screen
    startTest,          // Function to start test
    selectAnswer,       // Function to select an answer
    nextQuestion,       // Move to next question
    prevQuestion,       // Move to previous question
    submitTest,         // Submit test manually
    resetMockTest,      // Reset all mock test state
  } = useMockTest();

  const [countdown, setCountdown] = useState(null); // Countdown before test starts
  const [selectedExam, setSelectedExam] = useState(null); // Currently selected exam type

  // Determine initial duration based on selected exam
  const initialDuration = selectedExam === "Medical" ? MEDICAL_TEST_DURATION : ENGINEERING_TEST_DURATION;

  // Exam timer hook: counts down, calls submitTest when timer hits 0
  const { timeLeft, resetTimer } = useExamTimer(Boolean(examData), () => {
    submitTest();
    resetTimer();
  }, initialDuration);

  // ------------------------- COUNTDOWN EFFECT -------------------------
  useEffect(() => {
    if (countdown === null) return; // Only run if countdown started

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000); // Decrement every second
      return () => clearTimeout(timer); // Cleanup on unmount/update
    } else if (countdown === 0 && selectedExam) {
      startTest(selectedExam); // Start the test after countdown
      setCountdown(null);      // Reset countdown
    }
  }, [countdown, selectedExam, startTest]);

  // ------------------------- HANDLERS -------------------------
  const handleExamSelect = (examType) => {
    setSelectedExam(examType); // Set chosen exam
    setCountdown(5);            // Start 5-second countdown before test
  };

  const handleManualSubmit = () => {
    const confirmSubmit = window.confirm("Are you sure you want to submit the test?");
    if (confirmSubmit) {
      submitTest(); // Submit current answers
      resetTimer(); // Stop the exam timer
    }
  };

  const handleRetakeTest = () => {
    resetMockTest();        // Reset all hook states (questions, answers, score, etc.)
    setSelectedExam(null);  // Clear selected exam
    setCountdown(null);     // Reset countdown
    resetTimer();           // Reset timer
  };

  // ------------------------- EXAM OPTIONS -------------------------
  const examOptions = [
    { key: "Engineering", title: "Engineering", subtitle: "IOE Entrance Preparation", questions: 100, duration: 120 },
    { key: "Medical", title: "Medical", subtitle: "MBBS Entrance Preparation", questions: 200, duration: 180 },
  ];

  // ------------------------- RESULT SCREEN -------------------------
  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <h1 className="text-3xl font-bold text-emerald-600 mb-4">🎉 Test Completed</h1>
          <p className="text-2xl font-semibold mb-6">Score: {score}</p>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl" onClick={handleRetakeTest}>
            Retake Test
          </button>
        </div>
      </div>
    );
  }

  // ------------------------- MOCK TEST UI -------------------------
  return (
    <div className="min-h-screen bg-indigo-50 flex justify-center items-center p-4">
      <Toaster /> {/* For toast notifications */}
      <div className="bg-white max-w-4xl w-full p-8 rounded-3xl shadow-lg">
        {!examData ? (
          <>
            {/* INITIAL EXAM SELECTION */}
            <h1 className="text-3xl font-bold text-indigo-600 mb-4 text-center flex items-center justify-center gap-2">
              <FaBrain className="w-8 h-8" /> Mock Test
            </h1>
            <p className="text-gray-600 mb-8 text-center">Select your exam type and start practicing with full-length mock tests.</p>

            {!countdown && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {examOptions.map((exam) => (
                  <div key={exam.key} onClick={() => handleExamSelect(exam.key)}
                       className="cursor-pointer border rounded-xl p-6 hover:shadow-lg transition text-center">
                    {/* Icon based on exam type */}
                    <div className="text-3xl mb-2 flex items-center justify-center gap-2">
                      {exam.key === "Engineering" ? (
                        <FaCog className="w-8 h-8 text-gray-700" />
                      ) : exam.key === "Medical" ? (
                        <FaStethoscope className="w-8 h-8 text-red-500" />
                      ) : null}
                    </div>
                    <h2 className="font-semibold text-lg">{exam.title}</h2>
                    <p className="text-sm text-gray-500">{exam.subtitle}</p>
                    <p className="text-sm text-gray-500">{exam.questions} Questions • {exam.duration} Minutes</p>
                  </div>
                ))}
              </div>
            )}

            {/* Countdown before starting exam */}
            {countdown !== null && countdown > 0 && (
              <div className="text-6xl font-bold text-indigo-600 my-8 text-center">{countdown}</div>
            )}
          </>
        ) : (
          <>
            {/* QUESTION HEADER */}
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Q {currentQuestion + 1}/{examData.questions.length}</span>
              <span className="font-bold text-red-600">⏱ {formatTime(timeLeft)}</span>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-3 bg-gray-200 rounded-full mb-6">
              <div className="h-3 bg-indigo-600 rounded-full"
                   style={{ width: `${((currentQuestion + 1) / examData.questions.length) * 100}%` }} />
            </div>

            {/* QUESTION TEXT */}
            <div className="text-lg mb-6">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {examData.questions[currentQuestion].question_text}
              </ReactMarkdown>
            </div>

            {/* OPTIONS */}
            <div className="grid gap-4 mb-6">
              {examData.questions[currentQuestion].options.map((opt, i) => (
                <button key={i} onClick={() => selectAnswer(opt)}
                        className={`p-3 rounded-xl border text-left ${answers[currentQuestion] === opt ? "bg-indigo-600 text-white" : "hover:bg-indigo-50"}`}>
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {opt}
                  </ReactMarkdown>
                </button>
              ))}
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="flex justify-between items-center mt-8">
              <button onClick={prevQuestion} disabled={currentQuestion === 0}
                      className={`px-6 py-2 rounded-xl ${currentQuestion === 0 ? "bg-gray-300" : "bg-gray-500 text-white"}`}>
                Previous
              </button>

              <button onClick={handleManualSubmit} className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">
                Submit Test
              </button>

              <button onClick={currentQuestion === examData.questions.length - 1 ? submitTest : nextQuestion}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-xl">
                {currentQuestion === examData.questions.length - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}