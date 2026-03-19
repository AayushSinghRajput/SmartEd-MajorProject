import { useState } from "react";
import toast from "react-hot-toast";
import { getMockTest } from "../api/mock";
import { calculateScore } from "../utils/calculateScore";

export const useMockTest = () => {
  // ---------- STATES ----------
  const [examData, setExamData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
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
      console.log(data);
      if (!data?.data || data.data.length === 0) {
        toast.error("No mock test found");
        return;
      }
      
      // Select a random mock test from the array of mock tests
      const randomExam = data.data[Math.floor(Math.random() * data.data.length)];

      // Set initial states
      setExamData(randomExam);
      setCurrentQuestion(0);
      setAnswers({});
      setScore(0);
      setShowResult(false);

      toast.success("Mock test started");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load mock test");
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- SELECT ANSWER ----------
  const selectAnswer = (option) => {
    if (!examData) return; // defensive check
    setAnswers((prev) => ({ ...prev, [currentQuestion]: option }));
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
    resetMockTest, // For Retake Test
  };
};
