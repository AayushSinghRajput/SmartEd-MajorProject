// ---------------------------
// Generate welcome text for dashboard / study interface
// ---------------------------

/**
 * Returns a heading and description for the welcome panel
 * based on the current mode and selected day/subtopic.
 *
 * @param {Object} params
 * @param {string} params.mode - current mode ("mcq", "notes", "study", etc.)
 * @param {Object} params.state - current state of user selection
 *   - selectedDay: number (optional) - currently selected day
 *   - selectedSubtopic: object (optional) - currently selected subtopic with 'title'
 * @returns {Object} { welcomeHeading, welcomeDescription }
 */
export function getWelcomeText({ mode, state }) {
  // Default welcome messages
  let welcomeHeading = "Your Study Plan is Ready";
  let welcomeDescription = "Select a Day or a Lesson to begin.";

  // MCQ mode
  if (mode === "mcq") {
    welcomeHeading = "MCQs are Ready!";
    welcomeDescription = state.selectedDay
      ? `Start attempting MCQs for Day ${state.selectedDay}.`
      : "Select a Day to begin MCQs.";
  }
  // Notes mode
  else if (mode === "notes") {
    welcomeHeading = "Your Notes are Ready!";
    welcomeDescription = state.selectedDay
      ? `View notes for Day ${state.selectedDay}.`
      : "Select a Day to view your notes.";
  }
  // Study mode with a specific subtopic selected
  else if (mode === "study" && state.selectedSubtopic) {
    welcomeHeading = state.selectedSubtopic.title; // Show subtopic title as heading
    welcomeDescription = "Start reading this lesson.";
  }

  return { welcomeHeading, welcomeDescription };
}