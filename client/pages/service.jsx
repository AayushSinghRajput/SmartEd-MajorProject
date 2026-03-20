"use client"; // Indicates this file is a client-side React component

// Importing necessary components and hooks
import Sidebar from "../components/Service/Sidebar"; // Sidebar navigation component
import SubtopicViewer from "../components/Service/SubtopicViewer"; // Component to display selected subtopic content
import WelcomeState from "../components/Service/WelcomeState"; // Component to show initial welcome message
import { useServiceLogic } from "../hooks/useServiceLogic"; // Custom hook for handling service state and actions
import { getWelcomeText } from "../constants/getWelcomeText"; // Function to get dynamic welcome text
import ChatWidget from "../components/ChatWidget"; // Chat interface component
import { useEffect } from "react"; // React hook for side effects

// Main Service component
export default function Service({
  planData, // Contains the user's study schedule and related data
  onScheduleUpdate, // Callback function to notify parent component about schedule updates
  activeTab = "dashboard", // Determines the active mode/tab (default is "dashboard")
}) {
  // Determine the current mode of the service:
  // "study" (default), "mcq", or "notes" depending on activeTab
  const mode =
    activeTab === "mcq" || activeTab === "notes" ? activeTab : "study";

  // Use the custom hook to manage local state and actions for this service
  const { state, actions } = useServiceLogic(planData, mode);

  // Get dynamic welcome heading and description based on mode and current state
  const { welcomeHeading, welcomeDescription } = getWelcomeText({
    mode,
    state,
  });

  // Effect to notify parent about any changes to the local schedule
  useEffect(() => {
    if (state.localSchedule && state.localSchedule.length > 0) {
      onScheduleUpdate?.(state.localSchedule);
    }
  }, [state.localSchedule, onScheduleUpdate]);

  // Render an empty state if there is no schedule data available
  if (!planData || !planData.schedule || planData.schedule.length === 0) {
    return (
      <div className="flex w-full h-screen bg-white overflow-hidden items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">📚</div>
          <h3 className="text-2xl font-bold text-slate-900">
            {mode === "study"
              ? "No Schedule Available"
              : `No ${mode.toUpperCase()} data available`}
          </h3>

          <p className="text-slate-600 mt-2">
            Please upload a PDF to generate a study schedule.
          </p>
        </div>
      </div>
    );
  }

  // Render the main interface when schedule data is available
  return (
    <div className="flex w-full h-screen bg-white overflow-hidden">
      {/* Sidebar navigation panel */}
      <Sidebar
        localSchedule={state.localSchedule} // The schedule data for all days
        expandedDays={state.expandedDays} // Tracks which days are expanded in sidebar
        expandedTopics={state.expandedTopics} // Tracks which topics are expanded
        isDayExpanded={state.isDayExpanded} // Checks if a day is expanded
        isTopicExpanded={state.isTopicExpanded} // Checks if a topic is expanded
        selectedSubtopic={state.selectedSubtopic} // Currently selected subtopic
        loadingContent={state.loadingContent} // Indicates if content is loading
        metaData={state.metaData} // Metadata of current plan (like PDF hash)
        actions={actions} // Hook actions to manipulate state
        mode={mode} // Current mode: study/mcq/notes
        selectedDay={state.selectedDay} // Currently selected day
      />

      {/* Main content area */}
      <div className="w-3/4 h-full overflow-y-auto bg-white relative">
        {state.selectedSubtopic ? (
          // Render the SubtopicViewer if a subtopic is selected
          (() => {
            // Compute previous/next navigation dynamically for MCQ/Notes mode
            const hasPreviousDay = state.selectedDay && state.selectedDay > 1;
            const hasNextDay =
              state.selectedDay &&
              state.selectedDay < state.localSchedule.length;

            return (
              <SubtopicViewer
                subtopic={state.selectedSubtopic} // Content of the current subtopic
                loadingContent={state.loadingContent} // Loading state
                hasPrevious={
                  mode === "notes" || mode === "mcq"
                    ? hasPreviousDay
                    : state.hasPrevious
                } // Determines if "Previous" button should be active
                hasNext={
                  mode === "notes" || mode === "mcq"
                    ? hasNextDay
                    : state.hasNext
                } // Determines if "Next" button should be active
                onPrevious={
                  mode === "notes" || mode === "mcq"
                    ? actions.goToPreviousDay
                    : () => actions.goToSubtopic("previous")
                } // Handles click on "Previous"
                onNext={
                  mode === "notes" || mode === "mcq"
                    ? actions.goToNextDay
                    : () => actions.goToSubtopic("next")
                } // Handles click on "Next"
                mode={mode} // Pass mode to subtopic viewer
                pdfHash={state.metaData.fileHash} // PDF hash for reference
                day={state.selectedDay} // Current day number
                actions={actions} // Pass actions for subtopic manipulation
              />
            );
          })()
        ) : (
          // Show welcome state if no subtopic is selected
          <WelcomeState
            heading={welcomeHeading} // Dynamic heading text
            description={welcomeDescription} // Dynamic description text
          />
        )}
      </div>

      {/* Chat widget only visible in study mode */}
      {mode === "study" && (
        <ChatWidget
          metaData={state.metaData} // Metadata for chat context
          selectedSubtopic={state.selectedSubtopic} // Pass currently selected subtopic to chat
        />
      )}
    </div>
  );
}