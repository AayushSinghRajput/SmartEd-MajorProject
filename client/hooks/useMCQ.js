import { useState, useMemo } from "react";
import { submitMCQScore } from "../api/performance";

/**
 * useMCQ Hook
 *
 * Manages the state and submission logic for a set of MCQs.
 *
 * @param {Object} params
 * @param {Array} params.mcqs - Array of MCQ objects { question, options, answer_index }
 * @param {string} params.pdfHash - Identifier for the book/lesson
 * @param {number} params.day - Day number of the MCQ set
 * @param {Function} params.onPerformanceUpdate - Callback to update overall performance after submission
 *
 * @returns {Object} - Hook state & handlers:
 *  - answers: selected answers per question
 *  - showScore: whether to show the score after submission
 *  - score: calculated score
 *  - performanceLevel: performance level returned from backend
 *  - isComplete: whether all questions have been answered
 *  - loading: submission in progress
 *  - error: submission error message
 *  - selectOption: function to select an option for a question
 *  - submit: function to submit MCQ answers
 */
export function useMCQ({ mcqs, pdfHash, day, onPerformanceUpdate }) {
  // Tracks selected answers: { questionIndex: optionIndex }
  const [answers, setAnswers] = useState({});

  // Whether the score should be displayed
  const [showScore, setShowScore] = useState(false);

  // Loading state for submission
  const [loading, setLoading] = useState(false);

  // Error message, if any
  const [error, setError] = useState(null);

  // Performance level returned by backend
  const [performanceLevel, setPerformanceLevel] = useState(null);

  /**
   * Select an option for a given question
   * @param {number} qIndex - question index
   * @param {number} optionIndex - selected option index
   */
  const selectOption = (qIndex, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  /**
   * Compute the total score
   * useMemo ensures recalculation only when answers or mcqs change
   */
  const score = useMemo(() => {
    let total = 0;
    mcqs.forEach((q, i) => {
      if (answers[i] === q.answer_index) total++;
    });
    return total;
  }, [answers, mcqs]);

  // Check if all questions have been answered
  const isComplete = Object.keys(answers).length === mcqs.length;

  /**
   * Submit MCQ answers to backend
   * Updates local state and optionally calls onPerformanceUpdate
   */
  const submit = async () => {
    if (!isComplete || loading) return; // guard: incomplete or already submitting

    if (!pdfHash || day === undefined) {
      setError("Internal error: pdfHash or day missing");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Send score to backend
      const res = await submitMCQScore({
        pdfHash,
        day,
        score,
        totalQuestions: mcqs.length,
      });

      // Update performance level locally and call callback
      const level = res?.performance_level || null;
      setPerformanceLevel(level);
      onPerformanceUpdate?.({ day, level });

      // Show the score after successful submission
      setShowScore(true);
    } catch (err) {
      // Normalize errors to a string
      if (Array.isArray(err?.detail)) {
        setError(err.detail[0]?.msg);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Failed to submit score");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    answers,
    showScore,
    score,
    performanceLevel,
    isComplete,
    loading,
    error,
    selectOption,
    submit,
  };
}