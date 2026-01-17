export const formatMCQsToMarkdown = (mcqs) => {
  if (!mcqs || !mcqs.length) return "No MCQs available for this day.";

  return mcqs
    .map((mcq, idx) => {
      const options = mcq.options
        .map((opt, i) => `   ${String.fromCharCode(65 + i)}. ${opt}`)
        .join("\n");
      return `**Q${idx + 1}: ${mcq.question}**\n${options}\n\n`;
    })
    .join("\n");
};
