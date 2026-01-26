"use client";

import Sidebar from "../components/Service/Sidebar";
import SubtopicViewer from "../components/Service/SubtopicViewer";
import WelcomeState from "../components/Service/WelcomeState";
import { useServiceLogic } from "../hooks/useServiceLogic";
import { getWelcomeText } from "../constants/getWelcomeText";
import ChatWidget from "../components/ChatWidget";
import { useEffect } from "react";

export default function Service({
  planData,
  onScheduleUpdate,
  activeTab = "dashboard",
}) {
  // ✅ Determine service mode: "study" (default) or "mcq"/"notes"
  const mode =
    activeTab === "mcq" || activeTab === "notes" ? activeTab : "study";

  // ✅ Pass mode to your hook
  const { state, actions } = useServiceLogic(planData, mode);

  // Get dynamic text
  const { welcomeHeading, welcomeDescription } = getWelcomeText({
    mode,
    state,
  });

  // Notify parent of schedule updates
  useEffect(() => {
    if (state.localSchedule && state.localSchedule.length > 0) {
      onScheduleUpdate?.(state.localSchedule);
    }
  }, [state.localSchedule, onScheduleUpdate]);

  // Empty state
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

  return (
    <div className="flex w-full h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        localSchedule={state.localSchedule}
        expandedDays={state.expandedDays}
        expandedTopics={state.expandedTopics}
        isDayExpanded={state.isDayExpanded}
        isTopicExpanded={state.isTopicExpanded}
        selectedSubtopic={state.selectedSubtopic}
        loadingContent={state.loadingContent}
        metaData={state.metaData}
        actions={actions}
        mode={mode}
        selectedDay={state.selectedDay}
      />

      {/* Main Content Area */}
      <div className="w-3/4 h-full overflow-y-auto bg-white relative">
        {state.selectedSubtopic ? (
          // ✅ Compute previous/next dynamically for MCQ/Notes mode
          (() => {
            const hasPreviousDay = state.selectedDay && state.selectedDay > 1;
            const hasNextDay =
              state.selectedDay &&
              state.selectedDay < state.localSchedule.length;

            return (
              <SubtopicViewer
                subtopic={state.selectedSubtopic}
                loadingContent={state.loadingContent}
                hasPrevious={
                  mode === "notes" || mode === "mcq"
                    ? hasPreviousDay
                    : state.hasPrevious
                }
                hasNext={
                  mode === "notes" || mode === "mcq"
                    ? hasNextDay
                    : state.hasNext
                }
                onPrevious={
                  mode === "notes" || mode === "mcq"
                    ? actions.goToPreviousDay
                    : () => actions.goToSubtopic("previous")
                }
                onNext={
                  mode === "notes" || mode === "mcq"
                    ? actions.goToNextDay
                    : () => actions.goToSubtopic("next")
                }
                mode={mode} //pass the variable
                pdfHash={state.metaData.fileHash}
                day={state.selectedDay}
                actions={actions}
              />
            );
          })()
        ) : (
          <WelcomeState
            heading={welcomeHeading}
            description={welcomeDescription}
          />
        )}
      </div>

      {/* Chat Button */}
      {mode === "study" && (
        <ChatWidget
          metaData={state.metaData}
          selectedSubtopic={state.selectedSubtopic}
        />
      )}
    </div>
  );
}
