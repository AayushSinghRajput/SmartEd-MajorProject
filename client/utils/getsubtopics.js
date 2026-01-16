// -----------------------------
// Helpers for Sidebar / Service
// -----------------------------

/**
 * Calculate total number of subtopics across all days
 * @param {Array} schedule - array of days with topics & subtopics
 * @returns {number} total subtopics
 */
export function getTotalSubtopics(schedule) {
  if (!Array.isArray(schedule)) return 0;

  return schedule.reduce((total, day) => {
    if (!Array.isArray(day.topics)) return total;

    return (
      total +
      day.topics.reduce((topicTotal, topic) => {
        if (!Array.isArray(topic.subtopics)) return topicTotal;
        return topicTotal + topic.subtopics.length;
      }, 0)
    );
  }, 0);
}
