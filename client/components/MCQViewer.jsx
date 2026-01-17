import { useState } from "react";

/**
 * MCQViewer Component
 * Renders multiple-choice questions (MCQs) with interactive selection
 * and calculates the score after submission.
 *
 * Props:
 * - mcqs: Array of MCQ objects, each containing:
 *    - question: string
 *    - options: array of strings
 *    - answer_index: number (index of the correct option)
 */
export default function MCQViewer({ mcqs }) {
  // Store user-selected answers: { questionIndex: optionIndex }
  const [answers, setAnswers] = useState({});

  // Track whether the user has submitted to show score
  const [showScore, setShowScore] = useState(false);

  // Handler when user selects an option
  const handleOptionSelect = (qIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  // Calculate the total score based on correct answers
  const calculateScore = () => {
    let score = 0;
    mcqs.forEach((q, i) => {
      if (answers[i] === q.answer_index) score++;
    });
    return score;
  };

  if (!mcqs.length) {
    return <p>No MCQs available for this day.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Loop through all questions */}
      {mcqs.map((q, qIndex) => (
        <div key={qIndex} className="border p-4 rounded-lg">
          {/* Question text */}
          <p className="font-semibold mb-2">{`Q${qIndex + 1}: ${q.question}`}</p>

          {/* Options list */}
          <div className="space-y-1">
            {q.options.map((opt, oIndex) => (
              <label
                key={oIndex}
                className={`flex items-center cursor-pointer p-2 rounded-md border
                  ${answers[qIndex] === oIndex ? "bg-indigo-100 border-indigo-500" : "border-gray-300"}`}
              >
                {/* Radio input for selecting the option */}
                <input
                  type="radio"
                  name={`q${qIndex}`}
                  value={oIndex}
                  checked={answers[qIndex] === oIndex}
                  onChange={() => handleOptionSelect(qIndex, oIndex)}
                  className="mr-2"
                />
                {/* Option text */}
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Submit button appears only when all questions are answered and score is not shown yet */}
      {Object.keys(answers).length === mcqs.length && !showScore && (
        <button
          onClick={() => setShowScore(true)}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit & Show Score
        </button>
      )}

      {/* Display total score after submission */}
      {showScore && (
        <p className="mt-4 font-bold text-xl text-green-700">
          Your Score: {calculateScore()} / {mcqs.length}
        </p>
      )}
    </div>
  );
}
