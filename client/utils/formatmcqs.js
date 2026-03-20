// ---------------------------
// Format MCQs to Markdown
// ---------------------------
// Converts an array of MCQ objects into a nicely formatted markdown string.
// Parameters:
//   - mcqs: array of objects where each object contains:
//       - question: string (the question text)
//       - options: array of strings (list of answer choices)
// Returns:
//   - formatted markdown string for display (e.g., in UI or editor)
export const formatMCQsToMarkdown = (mcqs) => {
  // If no MCQs are provided, return a fallback message
  if (!mcqs || !mcqs.length) return "No MCQs available for this day.";

  return mcqs
    .map((mcq, idx) => {
      // Convert options into labeled format: A. option1, B. option2, etc.
      const options = mcq.options
        .map((opt, i) => `   ${String.fromCharCode(65 + i)}. ${opt}`) // 65 = 'A'
        .join("\n"); // Join all options with new lines

      // Format each question with bold markdown and its options
      return `**Q${idx + 1}: ${mcq.question}**\n${options}\n\n`;
    })
    .join("\n"); // Join all questions into a single markdown string
};