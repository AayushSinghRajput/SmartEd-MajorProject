"use client";

import { useMCQ } from "../hooks/useMCQ";

export default function MCQViewer({ mcqs, pdfHash, day }) {
  const {
    answers,
    showScore,
    score,
    performanceLevel,
    isComplete,
    loading,
    error,
    selectOption,
    submit,
  } = useMCQ({ mcqs, pdfHash, day });

  if (!mcqs.length) return <p>No MCQs available.</p>;

  return (
    <div className="space-y-8">
      {mcqs.map((q, qIndex) => (
        <div key={qIndex} className="border p-4 rounded-lg">
          <p className="font-semibold mb-2">
            Q{qIndex + 1}: {q.question}
          </p>

          {q.options.map((opt, oIndex) => (
            <label
              key={oIndex}
              className={`flex p-2 border rounded cursor-pointer ${
                answers[qIndex] === oIndex
                  ? "bg-indigo-100 border-indigo-500"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name={`q${qIndex}`}
                checked={answers[qIndex] === oIndex}
                onChange={() => selectOption(qIndex, oIndex)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      {isComplete && !showScore && (
        <button
          onClick={submit}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded"
        >
          {loading ? "Submitting..." : "Submit & Save Score"}
        </button>
      )}

      {error && <p className="text-red-600">{error}</p>}

      {showScore && (
        <p className="text-xl font-bold text-green-700">
          Your Score: {score} / {mcqs.length}
        </p>
      )}
      {performanceLevel && (
        <p className="text-lg font-semibold text-indigo-600">
          Performance Level: {performanceLevel}
        </p>
      )}
    </div>
  );
}
