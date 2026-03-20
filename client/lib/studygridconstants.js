import { FaBookOpen } from "react-icons/fa";

// ---------------------------
// Dashboard tab headers
// ---------------------------
// Each key corresponds to a tab in the dashboard.
// Each tab has:
// - heading: main title displayed on the page
// - subheading: optional description shown below the heading
// - icon: React component (from react-icons) for visual representation
export const TAB_HEADERS = {
  dashboard: {
    heading: "My Study Books",
    subheading: null, // no subheading for this tab
    icon: <FaBookOpen className="text-indigo-600" />, // book icon with indigo color
  },
  performance: {
    heading: "Academic Performance",
    subheading: "Track your academic progress and stay on top of your studies",
    icon: <FaBookOpen className="text-indigo-600" />, 
  },
  mcq: {
    heading: "MCQ Section",
    subheading: "Take MCQ tests to improve your knowledge",
    icon: <FaBookOpen className="text-indigo-600" />, 
  },
  notes: {
    heading: "Notes Section",
    subheading: "Take notes to improve your knowledge",
    icon: <FaBookOpen className="text-indigo-600" />, 
  },
};