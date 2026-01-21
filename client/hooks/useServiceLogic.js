import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { generateContent } from "../api/content";
import { summarizeDayNotes } from "../api/note";
import { generateMCQs } from "../api/mcq";
import { updateProgress } from "../api/progress";

//  Add `mode` to distinguish "study" vs "mcq" / "notes"
export function useServiceLogic(planData, mode = "study") {
  /* -------------------- STATE -------------------- */
  const [localSchedule, setLocalSchedule] = useState([]);
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [expandedTopics, setExpandedTopics] = useState(new Map());
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  // ✅ For MCQ / Notes: store selected day
  const [selectedDay, setSelectedDay] = useState(null);

  /* -------------------- METADATA -------------------- */
  const metaData = {
    subject: planData?.book_name || "Study Material",
    title: planData?.bookTitle || "Your PDF",
    fileHash: planData?.pdf_hash || planData?.fileHash || "default_hash",
    planId: planData?._id || planData?.id || "temp-id",
  };

  /* Prevent duplicate fetch */
  const fetchingRef = useRef({
    dayNum: null,
    topicIdx: null,
    subtopicIdx: null,
  });

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
      localSchedule?.[dayNum - 1]?.topics?.[topicIdx]?.subtopics?.[
        subtopicIdx
      ] || null
    );
  };

  const isContentEmpty = (subtopic) =>
    !subtopic?.content ||
    (typeof subtopic.content === "string" && subtopic.content.trim() === "");

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
    //set selectedSubtopic First so SubtopicViewer mounts
    setSelectedSubtopic({
      ...subtopic,
      content: null,
      images: [],
      currentDay: dayNum,
      topicIdx,
      subtopicIdx,
    });

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
        images: Array.isArray(res?.images) ? res.images : [], //for images
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
      const isLastSubtopic =
        subtopicIdx === day.topics[topicIdx].subtopics.length - 1;

      const isLastTopic = topicIdx === day.topics.length - 1;

      // ✅ CASE 1: Still inside same topic
      if (!isLastSubtopic) {
        s++;
      }

      // ✅ CASE 2: Move to next topic
      else if (!isLastTopic) {
        t++;
        s = 0;
      }

      // ✅ CASE 3: DAY COMPLETED (last subtopic of last topic)
      else {
        try {
          const completedDays = currentDay;
          const totalDays = localSchedule.length;

          await updateProgress({
            pdf_hash: metaData.fileHash,
            completed_days: completedDays,
            total_days: totalDays,
          });

          toast.success(`Day ${currentDay} completed 🎉`);
        } catch (err) {
          console.error(err);
          toast.error("Failed to update progress");
        }

        // Move to next day if exists
        if (currentDay < localSchedule.length) {
          d = currentDay + 1;
          t = 0;
          s = 0;
        } else {
          // Last day of entire schedule → stop navigation
          return;
        }
      }
    } else {
      // ⬅️ PREVIOUS logic (unchanged)
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

    // If it's notes/MCQ, no subtopics exist
    if (mode === "notes" || mode === "mcq") {
      return { hasNext: false, hasPrevious: false };
    }
    const { currentDay, topicIdx, subtopicIdx } = selectedSubtopic;
    const day = localSchedule[currentDay - 1];
    const topic = day?.topics?.[topicIdx];

    if (!topic || !topic.subtopics)
      return { hasNext: false, hasPrevious: false };

    return {
      hasNext:
        subtopicIdx + 1 < topic.subtopics.length ||
        topicIdx + 1 < day.topics.length ||
        currentDay < localSchedule.length,
      hasPrevious: subtopicIdx > 0 || topicIdx > 0 || currentDay > 1,
    };
  };

  const { hasNext, hasPrevious } = computeNavigation();

  // -------------------- MCQ / Notes Day Click --------------------
  const handleDayClick = async (dayNumber) => {
    setSelectedDay(dayNumber); //mark selected day
    if (mode === "mcq") {
      // Load MCQs for the day
      console.log("MCQ mode: clicked day", dayNumber);
      setSelectedSubtopic({
        title: `Day ${dayNumber} MCQs`,
        content: null,
        currentDay: dayNumber,
      });

      setLoadingContent(true);
      try {
        //call the api
        const mcqs = await generateMCQs({
          pdf_hash: metaData.fileHash, //pdf_hash
          day_number: dayNumber,
        });
        console.log("Calling generateMCQs with:", {
          pdf_hash: metaData.fileHash, //pdf_hash
          day_number: dayNumber,
        });
        // If mcqs is an object { mcqs, cached }, use mcqs
        setSelectedSubtopic({
          title: `Day ${dayNumber} MCQs`,
          content: mcqs || [], //always an array
          currentDay: dayNumber,
        });
      } catch (error) {
        toast.error("Complete your study plan for this day");
        console.error(error);
      } finally {
        setLoadingContent(false);
      }
    } else if (mode === "notes") {
      setSelectedSubtopic({
        title: `Day ${dayNumber} Notes`,
        content: null, //enables loader
        currentDay: dayNumber,
      });
      setLoadingContent(true);
      // Load Notes for the day
      try {
        //call the api
        const notesContent = await summarizeDayNotes({
          book_id: metaData.fileHash, //pdf_hash
          day_number: dayNumber,
        });
        console.log("Calling summarizeDayNotes with:", {
          book_id: metaData.fileHash,
          day_number: dayNumber,
        });
        // If notesContent is an object { notes, cached }, use notes
        setSelectedSubtopic({
          title: `Day ${dayNumber} Notes`,
          content: notesContent?.notes || "No notes available for this day.",
          currentDay: dayNumber,
        });
      } catch (error) {
        toast.error("Complete your study plan for this day");
        console.error(error);
      } finally {
        setLoadingContent(false);
      }
    }
  };

  // ✅ Move to next day and load notes
  const goToNextDay = async () => {
    if (!selectedDay) return;
    const nextDay = selectedDay + 1;
    if (nextDay > localSchedule.length) return; // no more days
    await handleDayClick(nextDay); // reuse handleDayClick to load notes
    console.log("Going to next day:", nextDay, "selectedDay:", selectedDay);
  };

  // ✅ Move to previous day and load notes
  const goToPreviousDay = async () => {
    if (!selectedDay || selectedDay <= 1) return;
    const prevDay = selectedDay - 1;
    //call handleDayclick firs
    await handleDayClick(prevDay); // reuse handleDayClick to load notes
    console.log("Going to previous day:", prevDay, "selectedDay:", selectedDay);
  };

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
      selectedDay, // ✅ for MCQ / Notes
    },
    actions: {
      toggleDayExpand,
      toggleTopicExpand,
      handleSubtopicClick,
      goToSubtopic,
      handleDayClick, // ✅ for MCQ / Notes
      goToNextDay, // ✅ for MCQ / Notes
      goToPreviousDay, // ✅ for MCQ / Notes
    },
  };
}
