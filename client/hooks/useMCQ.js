import { useState, useMemo } from "react";
import { submitMCQScore } from "../api/performance";

export function useMCQ({ mcqs, pdfHash, day }) {
  const [answers, setAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectOption = (qIndex, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  const score = useMemo(() => {
    let total = 0;
    mcqs.forEach((q, i) => {
      if (answers[i] === q.answer_index) total++;
    });
    return total;
  }, [answers, mcqs]);

  const isComplete = Object.keys(answers).length === mcqs.length;

  const submit = async () => {
    if (!isComplete || loading) return;

     // 🔒 Guard checks (VERY IMPORTANT)
    if (!pdfHash || day === undefined) {
      setError("Internal error: pdfHash or day missing");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await submitMCQScore({
        pdfHash,
        day,
        score,
        totalQuestions: mcqs.length,
      });

      setShowScore(true);
    } catch (err) {
      // ✅ Convert error to string safely
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
    isComplete,
    loading,
    error,
    selectOption,
    submit,
  };
}
