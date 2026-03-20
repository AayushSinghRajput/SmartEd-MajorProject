// ---------------------------
// Dashboard tab definitions
// ---------------------------
// Each object represents a tab in the main dashboard:
// - name: internal identifier used in routing or state
// - label: visible text for the user
// - icon: emoji for a quick visual cue
export const DASHBOARD_TABS = [
  { name: "dashboard", label: "Dashboard", icon: "📊" },
  { name: "performance", label: "Performance Tracker", icon: "📈" },
  { name: "mcq", label: "Practice MCQs", icon: "✍️" },
  { name: "notes", label: "Study Notes", icon: "📝" },
  { name: "mock", label: "Mock Test", icon: "📋" },
  { name: "community", label: "Community", icon: "👥" },
  { name: "entranceNews", label: "Entrance News", icon: "📰" },
];

// ---------------------------
// Test durations in seconds
// ---------------------------
// Standard durations for entrance exams
export const ENGINEERING_TEST_DURATION = 120 * 60; // 120 minutes → 2 hours
export const MEDICAL_TEST_DURATION = 180 * 60;     // 180 minutes → 3 hours