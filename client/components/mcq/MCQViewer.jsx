"use client"; // Client-side Next.js component

import { useMCQ } from "../../hooks/useMCQ"; // Custom hook for MCQ state & logic

export default function MCQViewer({ mcqs, pdfHash, day }) {
  // Destructure state and actions from useMCQ hook
  const {
    answers,           // Array of selected option indexes per question
    showScore,         // Boolean: whether to show the final score
    score,             // Calculated score
    performanceLevel,  // Performance feedback (e.g., Excellent, Average)
    isComplete,        // True if all questions have been answered
    loading,           // True while submitting score
    error,             // Error message if submission fails
    selectOption,      // Function to select an option for a question
    submit,            // Function to submit answers and save score
  } = useMCQ({ mcqs, pdfHash, day });

  // Handle empty MCQ list
  if (!mcqs.length) return <p>No MCQs available.</p>;

  return (
    <div className="space-y-8">
      {/* Render each question */}
      {mcqs.map((q, qIndex) => (
        <div key={qIndex} className="border p-4 rounded-lg">
          {/* Question text */}
          <p className="font-semibold mb-2">
            Q{qIndex + 1}: {q.question}
          </p>

          {/* Render options */}
          {q.options.map((opt, oIndex) => (
            <label
              key={oIndex}
              className={`flex p-2 border rounded cursor-pointer ${
                answers[qIndex] === oIndex
                  ? "bg-indigo-100 border-indigo-500" // Highlight selected option
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name={`q${qIndex}`} // Group options per question
                checked={answers[qIndex] === oIndex} // Reflect selected option
                onChange={() => selectOption(qIndex, oIndex)} // Handle selection
                className="mr-2"
              />
              {opt} {/* Option text */}
            </label>
          ))}
        </div>
      ))}

      {/* Submit button appears when all questions answered but score not shown */}
      {isComplete && !showScore && (
        <button
          onClick={submit}
          disabled={loading} // Disable while submitting
          className="px-6 py-2 bg-green-600 text-white rounded"
        >
          {loading ? "Submitting..." : "Submit & Save Score"}
        </button>
      )}

      {/* Display error if submission fails */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Display final score */}
      {showScore && (
        <p className="text-xl font-bold text-green-700">
          Your Score: {score} / {mcqs.length}
        </p>
      )}

      {/* Display performance feedback */}
      {performanceLevel && (
        <p className="text-lg font-semibold text-indigo-600">
          Performance Level: {performanceLevel}
        </p>
      )}
    </div>
  );
}