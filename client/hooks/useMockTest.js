import { useState } from "react";
import toast from "react-hot-toast";
import { getMockTest } from "../api/mock";
import { calculateScore } from "../utils/calculateScore";

/**
 * useMockTest Hook
 *
 * Handles fetching, navigating, answering, and scoring a mock test.
 */
export const useMockTest = () => {
  // ---------- STATE ----------
  const [examData, setExamData] = useState(null); // current mock test
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionIndex: selectedOption }
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ---------- START TEST ----------
  const startTest = async (mockType) => {
    if (!mockType) {
      toast.error("Please select an exam type");
      return;
    }

    setIsLoading(true);
    try {
      const data = await getMockTest(mockType);
      if (!data?.data || data.data.length === 0) {
        toast.error("No mock test found");
        return;
      }

      // Pick a random mock from available tests
      const randomExam = data.data[Math.floor(Math.random() * data.data.length)];

      // Initialize states
      setExamData(randomExam);
      setCurrentQuestion(0);
      setAnswers({});
      setScore(0);
      setShowResult(false);

      toast.success("Mock test started");
    } catch (err) {
      console.error("[useMockTest] Failed to fetch mock test:", err);
      toast.error("Failed to load mock test");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- SELECT ANSWER ----------
  const selectAnswer = (optionIndex) => {
    if (!examData) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion]: optionIndex }));
  };

  // ---------- NAVIGATION ----------
  const prevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const nextQuestion = () => {
    if (!examData) return;
    if (currentQuestion < examData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // ---------- SUBMIT TEST ----------
  const submitTest = () => {
    if (!examData) return;
    const total = calculateScore(examData.questions, answers);
    setScore(total);
    setShowResult(true);
  };

  // ---------- RESET TEST ----------
  const resetMockTest = () => {
    setExamData(null);
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setShowResult(false);
  };

  return {
    examData,
    currentQuestion,
    answers,
    score,
    showResult,
    isLoading,
    startTest,
    selectAnswer,
    prevQuestion,
    nextQuestion,
    submitTest,
    resetMockTest,
  };
};