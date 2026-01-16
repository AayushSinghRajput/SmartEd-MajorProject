import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { generateContent } from "../api/content";

export function useServiceLogic(planData) {
  /* -------------------- STATE -------------------- */
  const [localSchedule, setLocalSchedule] = useState([]);
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [expandedTopics, setExpandedTopics] = useState(new Map());
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);

  /* -------------------- METADATA -------------------- */
  const metaData = {
    subject: planData?.book_name || "Study Material",
    title: planData?.bookTitle || "Your PDF",
    fileHash: planData?.pdf_hash || planData?.fileHash || "default_hash",
    planId: planData?._id || planData?.id || "temp-id",
  };

  /* Prevent duplicate fetch */
  const fetchingRef = useRef({ dayNum: null, topicIdx: null, subtopicIdx: null });

  /* -------------------- INIT -------------------- */
  useEffect(() => {
    if (planData?.schedule) {
      setLocalSchedule(planData.schedule);
    } else {
      setLocalSchedule([]);
    }
  }, [planData]);

  /* -------------------- HELPERS -------------------- */
  const isDayExpanded = (dayIndex) => expandedDays.has(dayIndex);

  const isTopicExpanded = (dayIndex, topicIndex) =>
    expandedTopics.get(dayIndex)?.has(topicIndex) || false;

  /* -------------------- TOGGLES -------------------- */

  // Toggle Day (expand / collapse)
  const toggleDayExpand = (dayIndex) => {
    setExpandedDays((prev) => {
      const updated = new Set(prev);

      if (updated.has(dayIndex)) {
        // Collapse day
        updated.delete(dayIndex);

        // Collapse all topics of this day
        setExpandedTopics((prevTopics) => {
          const map = new Map(prevTopics);
          map.delete(dayIndex);
          return map;
        });

        // Clear selected subtopic if it belongs to this day
        if (selectedSubtopic?.currentDay === dayIndex + 1) {
          setSelectedSubtopic(null);
        }
      } else {
        // Expand day
        updated.add(dayIndex);
      }

      return updated;
    });
  };

  // Toggle Topic (expand / collapse)
  const toggleTopicExpand = (dayIndex, topicIndex) => {
    setExpandedTopics((prev) => {
      const map = new Map(prev);
      const topicSet = map.get(dayIndex) || new Set();

      topicSet.has(topicIndex)
        ? topicSet.delete(topicIndex)
        : topicSet.add(topicIndex);

      map.set(dayIndex, topicSet);
      return map;
    });
  };

  /* -------------------- DATA ACCESS -------------------- */
  const getSubtopic = (dayNum, topicIdx, subtopicIdx) => {
    return (
      localSchedule?.[dayNum - 1]?.topics?.[topicIdx]?.subtopics?.[subtopicIdx] ||
      null
    );
  };

  const isContentEmpty = (subtopic) =>
    !subtopic?.content || subtopic.content.trim() === "";

  /* -------------------- FETCH CONTENT -------------------- */
  const fetchSubtopicContent = async (dayNum, topicIdx, subtopicIdx) => {
    if (
      fetchingRef.current.dayNum === dayNum &&
      fetchingRef.current.topicIdx === topicIdx &&
      fetchingRef.current.subtopicIdx === subtopicIdx
    )
      return;

    const subtopic = getSubtopic(dayNum, topicIdx, subtopicIdx);
    if (!subtopic) return toast.error("Subtopic not found");

    fetchingRef.current = { dayNum, topicIdx, subtopicIdx };
    setLoadingContent(true);

    try {
      const res = await generateContent({
        book_id: metaData.fileHash,
        day_number: dayNum,
        topic_index: topicIdx,
        subtopic_index: subtopicIdx,
      });

      const updatedSubtopic = {
        ...subtopic,
        content: res?.content || "No content available.",
        currentDay: dayNum,
        topicIdx,
        subtopicIdx,
      };

      const updatedSchedule = [...localSchedule];
      updatedSchedule[dayNum - 1].topics[topicIdx].subtopics[subtopicIdx] =
        updatedSubtopic;

      setLocalSchedule(updatedSchedule);
      setSelectedSubtopic(updatedSubtopic);
    } catch {
      toast.error("Failed to load content");
    } finally {
      setLoadingContent(false);
      fetchingRef.current = {};
    }
  };

  /* -------------------- SUBTOPIC CLICK -------------------- */
  const handleSubtopicClick = async (dayNum, topicIdx, subtopicIdx) => {
    const subtopic = getSubtopic(dayNum, topicIdx, subtopicIdx);
    if (!subtopic) return;

    if (isContentEmpty(subtopic)) {
      await fetchSubtopicContent(dayNum, topicIdx, subtopicIdx);
    } else {
      setSelectedSubtopic({
        ...subtopic,
        currentDay: dayNum,
        topicIdx,
        subtopicIdx,
      });
    }
  };

  /* -------------------- NAVIGATION -------------------- */
  const goToSubtopic = async (direction) => {
    if (!selectedSubtopic) return;

    const { currentDay, topicIdx, subtopicIdx } = selectedSubtopic;
    const day = localSchedule[currentDay - 1];

    let d = currentDay,
      t = topicIdx,
      s = subtopicIdx;

    if (direction === "next") {
      if (s + 1 < day.topics[t].subtopics.length) s++;
      else if (t + 1 < day.topics.length) (t++, (s = 0));
      else if (d < localSchedule.length) (d++, (t = 0), (s = 0));
    } else {
      if (s > 0) s--;
      else if (t > 0) {
        t--;
        s = day.topics[t].subtopics.length - 1;
      } else if (d > 1) {
        d--;
        const prev = localSchedule[d - 1];
        t = prev.topics.length - 1;
        s = prev.topics[t].subtopics.length - 1;
      }
    }

    await handleSubtopicClick(d, t, s);
  };

  const computeNavigation = () => {
    if (!selectedSubtopic) return { hasNext: false, hasPrevious: false };
    const { currentDay, topicIdx, subtopicIdx } = selectedSubtopic;
    const day = localSchedule[currentDay - 1];
    const topic = day?.topics?.[topicIdx];

    return {
      hasNext:
        subtopicIdx + 1 < topic.subtopics.length ||
        topicIdx + 1 < day.topics.length ||
        currentDay < localSchedule.length,
      hasPrevious:
        subtopicIdx > 0 || topicIdx > 0 || currentDay > 1,
    };
  };

  const { hasNext, hasPrevious } = computeNavigation();

  return {
    state: {
      localSchedule,
      expandedDays,
      expandedTopics,
      isDayExpanded,
      isTopicExpanded,
      selectedSubtopic,
      loadingContent,
      metaData,
      hasNext,
      hasPrevious,
    },
    actions: {
      toggleDayExpand,
      toggleTopicExpand,
      handleSubtopicClick,
      goToSubtopic,
    },
  };
}
