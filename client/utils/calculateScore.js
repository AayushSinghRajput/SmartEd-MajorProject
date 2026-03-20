// ---------------------------
// Calculate total score
// ---------------------------
// Calculates the total score based on user's answers.
// Parameters:
//   - questions: array of question objects
//       each question should contain:
//         - correct_option: correct answer value
//         - marks: marks assigned to the question
//   - answers: array of user's selected answers (indexed same as questions)
// Returns:
//   - total score (number)
export const calculateScore = (questions, answers) => {
  let total = 0; // Initialize total score

  // Loop through each question
  questions.forEach((q, index) => {
    // Check if user's answer matches the correct option
    if (answers[index] === q.correct_option) {
      total += q.marks; // Add marks for correct answer
    }
  });

  return total; // Return final calculated score
};