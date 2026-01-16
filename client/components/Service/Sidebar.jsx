import { ChevronDown, ChevronRight, Check } from "lucide-react";
import { getTotalSubtopics } from "../../utils/getsubtopics";

export default function Sidebar({
  localSchedule = [],
  isDayExpanded = () => false,
  isTopicExpanded = () => false,
  selectedSubtopic = null,
  loadingContent = false,
  metaData = {},
  actions = {},
  mode = "study", //  new: "study" | "mcq" | "notes"
  selectedDay = null, //  new: selected day in mcq/notes mode
}) {
  const {
    toggleDayExpand,
    toggleTopicExpand,
    handleSubtopicClick,
    handleDayClick,
  } = actions;
  // ✅ handleDayClick will be used for mcq / notes

  return (
    <div className="w-1/4 border-r p-4 overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="mb-6 p-4 bg-indigo-600 rounded-2xl text-white shadow-lg">
        <h2 className="text-lg font-bold truncate">
          {metaData.subject || "Study Material"}
        </h2>
        <p className="text-xs opacity-75 mt-1">
          {localSchedule.length} days • {getTotalSubtopics(localSchedule)}{" "}
          subtopics
        </p>
      </div>

      <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Course Content
      </h3>

      <div className="space-y-2">
        {localSchedule.map((dayItem, dayIndex) => {
          const dayExpanded = isDayExpanded(dayIndex);

          return (
            <div key={dayIndex} className="mb-2">
              {/* Day Button */}
              <button
                onClick={() => {
                  if (mode === "mcq" || mode === "notes") {
                    handleDayClick(dayItem.day); // ✅ mcq/notes: only select day
                  } else {
                    toggleDayExpand(dayIndex); // ✅ study: expand/collapse topics
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  dayExpanded
                    ? "bg-white border border-indigo-200 shadow-sm text-indigo-600"
                    : "hover:bg-indigo-50 text-gray-700"
                }`}
                disabled={loadingContent}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      (mode === "study" && dayExpanded) ||
                      (mode !== "study" && selectedDay === dayItem.day)
                        ? "bg-indigo-600"
                        : "bg-gray-300"
                    }`}
                  />
                  <div className="text-left">
                    <span className="font-bold text-sm block">
                      DAY {dayItem.day}
                    </span>
                    {mode === "study" && (
                      <span className="text-xs text-gray-500">
                        {dayItem.topics?.length || 0} topics
                      </span>
                    )}
                  </div>
                </div>
                {dayExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {/* Topics & Subtopics - Only show if day is expanded */}
              {mode === "study" &&
                dayExpanded &&
                dayItem.topics?.map((topic, topicIndex) => {
                  const topicExpanded = isTopicExpanded(dayIndex, topicIndex);

                  return (
                    <div
                      key={topicIndex}
                      className="mt-2 ml-4 space-y-1 border-l-2 border-indigo-100 pl-2"
                    >
                      {/* Topic Button */}
                      <button
                        onClick={() => toggleTopicExpand(dayIndex, topicIndex)}
                        className={`w-full text-left px-3 py-2 text-sm font-semibold flex justify-between items-center ${
                          topicExpanded
                            ? "text-indigo-600"
                            : "text-gray-600 hover:text-indigo-600"
                        }`}
                        disabled={loadingContent}
                      >
                        <span className="truncate">
                          {topic.topic || topic.title}
                        </span>
                        <ChevronRight
                          size={14}
                          className={`transition-transform ${
                            topicExpanded ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {/* Subtopics - Only show if topic is expanded */}
                      {topicExpanded &&
                        topic.subtopics?.map((subtopic, subtopicIndex) => {
                          const isSelected =
                            selectedSubtopic?.title === subtopic.title &&
                            selectedSubtopic?.currentDay === dayItem.day;

                          return (
                            <button
                              key={subtopicIndex}
                              onClick={() =>
                                handleSubtopicClick(
                                  dayItem.day,
                                  topicIndex,
                                  subtopicIndex
                                )
                              }
                              className={`w-full text-left px-3 py-2 text-xs transition-all rounded-lg flex items-center justify-between ${
                                isSelected
                                  ? "bg-indigo-100 text-indigo-700 font-bold"
                                  : "text-gray-500 hover:bg-gray-100"
                              }`}
                              disabled={loadingContent}
                            >
                              <span
                                className={
                                  subtopic.completed
                                    ? "line-through opacity-50"
                                    : ""
                                }
                              >
                                {subtopic.title}
                              </span>
                              {subtopic.completed && (
                                <Check size={12} className="text-emerald-600" />
                              )}
                            </button>
                          );
                        })}
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
