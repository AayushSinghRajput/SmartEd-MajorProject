"use client";

import Sidebar from "../components/Service/Sidebar";
import SubtopicViewer from "../components/Service/SubtopicViewer";
import WelcomeState from "../components/Service/WelcomeState";
import { useServiceLogic } from "../hooks/useServiceLogic";
import { useEffect } from "react";

export default function Service({ planData, onScheduleUpdate }) {
  // Initialize service logic hook
  const { state, actions } = useServiceLogic(planData);

  // Notify parent of schedule updates
  useEffect(() => {
    if (planData?.schedule) {
      onScheduleUpdate?.(planData.schedule);
    }
  }, [planData, onScheduleUpdate]);

  // Empty state
  if (!planData || !planData.schedule || planData.schedule.length === 0) {
    return (
      <div className="flex w-full h-screen bg-white overflow-hidden items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">📚</div>
          <h3 className="text-2xl font-bold text-slate-900">
            No Schedule Available
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
      />

      {/* Main Content Area */}
      <div className="w-3/4 h-full overflow-y-auto bg-white relative">
        {state.selectedSubtopic ? (
          <SubtopicViewer
            subtopic={state.selectedSubtopic}
            loadingContent={state.loadingContent}
            hasPrevious={state.hasPrevious}
            hasNext={state.hasNext}
            onPrevious={() => actions.goToSubtopic("previous")}
            onNext={() => actions.goToSubtopic("next")}
          />
        ) : (
          <WelcomeState />
        )}
      </div>
    </div>
  );
}