// -----------------------------
// Helpers for Sidebar / Service
// -----------------------------

/**
 * Calculate total number of subtopics across all days
 *
 * Iterates through the schedule array, counting all subtopics
 * in each topic of each day. Handles missing or malformed arrays safely.
 *
 * @param {Array} schedule - array of days, each day contains:
 *   - topics: array of topic objects, each topic contains:
 *       - subtopics: array of subtopic objects
 * @returns {number} total number of subtopics across the entire schedule
 */
export function getTotalSubtopics(schedule) {
  if (!Array.isArray(schedule)) return 0; // safety check

  return schedule.reduce((total, day) => {
    if (!Array.isArray(day.topics)) return total; // skip if topics missing

    return (
      total +
      day.topics.reduce((topicTotal, topic) => {
        if (!Array.isArray(topic.subtopics)) return topicTotal; // skip if subtopics missing
        return topicTotal + topic.subtopics.length; // add number of subtopics
      }, 0)
    );
  }, 0);
}