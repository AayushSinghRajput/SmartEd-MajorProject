

export function getWelcomeText({ mode, state }) {
  let welcomeHeading = "Your Study Plan is Ready";
  let welcomeDescription = "Select a Day or a Lesson to begin.";

  if (mode === "mcq") {
    welcomeHeading = "MCQs are Ready!";
    welcomeDescription = state.selectedDay
      ? `Start attempting MCQs for Day ${state.selectedDay}.`
      : "Select a Day to begin MCQs.";
  } else if (mode === "notes") {
    welcomeHeading = "Your Notes are Ready!";
    welcomeDescription = state.selectedDay
      ? `View notes for Day ${state.selectedDay}.`
      : "Select a Day to view your notes.";
  } else if (mode === "study" && state.selectedSubtopic) {
    welcomeHeading = state.selectedSubtopic.title;
    welcomeDescription = "Start reading this lesson.";
  }

  return { welcomeHeading, welcomeDescription };
}
