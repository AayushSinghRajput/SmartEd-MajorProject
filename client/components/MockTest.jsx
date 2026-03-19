"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Toaster } from "react-hot-toast";
import { useMockTest } from "../hooks/useMockTest";
import { useExamTimer } from "../hooks/useExamTimer";
import { formatTime } from "../utils/formatTime";
import { FaBrain, FaCog, FaStethoscope } from "react-icons/fa";
import { ENGINEERING_TEST_DURATION, MEDICAL_TEST_DURATION } from "../lib/constants";

export default function MockTest() {
  const {
    examData,
    currentQuestion,
    answers,
    score,
    showResult,
    startTest,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitTest,
    resetMockTest, // Add reset from hook (we’ll define it)
  } = useMockTest();

  const [countdown, setCountdown] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  const initialDuration = selectedExam === "Medical" ? MEDICAL_TEST_DURATION : ENGINEERING_TEST_DURATION;

  const { timeLeft, resetTimer } = useExamTimer(Boolean(examData), () => {
    submitTest();
    resetTimer();
  }, initialDuration);

  // ------------------------- EFFECT FOR COUNTDOWN -------------------------
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && selectedExam) {
      startTest(selectedExam);
      setCountdown(null);
    }
  }, [countdown, selectedExam, startTest]);

  // ------------------------- HANDLERS -------------------------
  const handleExamSelect = (examType) => {
    setSelectedExam(examType);
    setCountdown(5); // 5-second countdown before test
  };

  const handleManualSubmit = () => {
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit the test?",
    );
    if (confirmSubmit) {
      submitTest();
      resetTimer();
    }
  };

  const handleRetakeTest = () => {
    // Reset all hook states (examData, answers, score, showResult)
    resetMockTest();

    // Reset selection and countdown
    setSelectedExam(null);
    setCountdown(null);

    // Reset timer
    resetTimer();
  };

  // ------------------------- EXAM OPTIONS -------------------------
  const examOptions = [
    {
      key: "Engineering",
      title: "Engineering",
      subtitle: "IOE Entrance Preparation",
      questions: 100,
      duration: 120,
    },
    {
      key: "Medical",
      title: "Medical",
      subtitle: "MBBS Entrance Preparation",
      questions: 200,
      duration: 180,
    },
  ];

  // ------------------------- RENDER RESULT -------------------------
  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <h1 className="text-3xl font-bold text-emerald-600 mb-4">
            🎉 Test Completed
          </h1>
          <p className="text-2xl font-semibold mb-6">Score: {score}</p>
          <button
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl"
            onClick={handleRetakeTest} // RESET TO INITIAL STATE
          >
            Retake Test
          </button>
        </div>
      </div>
    );
  }

  // ------------------------- RENDER MOCK TEST -------------------------
  return (
    <div className="min-h-screen bg-indigo-50 flex justify-center items-center p-4">
      <Toaster />
      <div className="bg-white max-w-4xl w-full p-8 rounded-3xl shadow-lg">
        {!examData ? (
          <>
            {/* INITIAL EXAM SELECT CARDS */}
            <h1 className="text-3xl font-bold text-indigo-600 mb-4 text-center flex items-center justify-center gap-2">
              <FaBrain className="w-8 h-8" />
              Mock Test
            </h1>
            <p className="text-gray-600 mb-8 text-center">
              Select your exam type and start practicing with full-length mock
              tests.
            </p>

            {!countdown && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {examOptions.map((exam) => (
                  <div
                    key={exam.key}
                    onClick={() => handleExamSelect(exam.key)}
                    className="cursor-pointer border rounded-xl p-6 hover:shadow-lg transition text-center"
                  >
                    <div className="text-3xl mb-2 flex items-center justify-center gap-2">
                      {exam.key === "Engineering" ? (
                        <FaCog className="w-8 h-8 text-gray-700" />
                      ) : exam.key === "Medical" ? (
                        <FaStethoscope className="w-8 h-8 text-red-500" />
                      ) : null}
                    </div>
                    <h2 className="font-semibold text-lg">{exam.title}</h2>
                    <p className="text-sm text-gray-500">{exam.subtitle}</p>
                    <p className="text-sm text-gray-500">
                      {exam.questions} Questions • {exam.duration} Minutes
                    </p>
                  </div>
                ))}
              </div>
            )}

            {countdown !== null && countdown > 0 && (
              <div className="text-6xl font-bold text-indigo-600 my-8 text-center">
                {countdown}
              </div>
            )}
          </>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">
                Q {currentQuestion + 1}/{examData.questions.length}
              </span>
              <span className="font-bold text-red-600">
                ⏱ {formatTime(timeLeft)}
              </span>
            </div>

            {/* PROGRESS */}
            <div className="w-full h-3 bg-gray-200 rounded-full mb-6">
              <div
                className="h-3 bg-indigo-600 rounded-full"
                style={{
                  width: `${
                    ((currentQuestion + 1) / examData.questions.length) * 100
                  }%`,
                }}
              />
            </div>

            {/* QUESTION */}
            <div className="text-lg mb-6">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {examData.questions[currentQuestion].question_text}
              </ReactMarkdown>
            </div>

            {/* OPTIONS */}
            <div className="grid gap-4 mb-6">
              {examData.questions[currentQuestion].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => selectAnswer(opt)}
                  className={`p-3 rounded-xl border text-left ${
                    answers[currentQuestion] === opt
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-indigo-50"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {opt}
                  </ReactMarkdown>
                </button>
              ))}
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`px-6 py-2 rounded-xl ${
                  currentQuestion === 0
                    ? "bg-gray-300"
                    : "bg-gray-500 text-white"
                }`}
              >
                Previous
              </button>

              {/* MANUAL SUBMIT */}
              <button
                onClick={handleManualSubmit}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                Submit Test
              </button>

              <button
                onClick={
                  currentQuestion === examData.questions.length - 1
                    ? submitTest
                    : nextQuestion
                }
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl"
              >
                {currentQuestion === examData.questions.length - 1
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
