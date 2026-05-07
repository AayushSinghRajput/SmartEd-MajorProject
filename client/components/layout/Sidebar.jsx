import { useState } from "react";
import { DASHBOARD_TABS } from "../../lib/constants"; // Predefined tabs for dashboard navigation
import { formatAcademicId, getCleanUsername } from "../../lib/utils"; // Utility functions for formatting

// Sidebar component props
export default function Sidebar({
  user, // User object containing profile info
  activeTab, // Currently active tab
  setActiveTab, // Function to update active tab
  setShowServiceView, // Function to toggle service view
}) {
  const [collapsed, setCollapsed] = useState(false); // State to track sidebar collapse/expand

  return (
    <aside
      className={`
        sticky top-16 left-0
        ${collapsed ? "w-20" : "w-72"}   // Sidebar width changes based on collapsed state
        h-[calc(100vh-4rem)]              // Full height minus top offset
        bg-white
        border-r border-slate-100
        transition-all duration-300       // Smooth expand/collapse animation
        flex-shrink-0
        z-40
      `}
    >
      <div className="flex flex-col h-full px-4 py-5">
        {/* SIDEBAR TOGGLE BUTTON */}
        <div
          className={`flex items-center mb-6 ${collapsed ? "justify-center" : "justify-end"}`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)} // Toggle collapsed state
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {/* Minimalist 3-line hamburger icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>

        {/* USER PROFILE SECTION */}
        <div className="text-center mb-8">
          {/* User avatar circle with initial */}
          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-700">
            {getCleanUsername(user).charAt(0)}{" "}
            {/* Display first letter of username */}
          </div>

          {!collapsed && ( // Show user details only if sidebar is expanded
            <div className="mt-3 animate-in fade-in duration-500">
              <h3 className="font-bold text-slate-800">
                {getCleanUsername(user)} {/* Display cleaned username */}
              </h3>
              <p className="text-xs text-indigo-600 font-medium">
                {user?.publicMetadata?.role || "Student"}{" "}
                {/* Display role or default */}
              </p>
              <p className="mt-2 text-[10px] font-mono text-slate-400">
                {formatAcademicId(user?._id || user?.id, user?.createdAt)}{" "}
                {/* Display formatted academic ID */}
              </p>
            </div>
          )}
        </div>

        {/* NAVIGATION / TAB BUTTONS */}
        <nav className="flex-1 space-y-2">
          {DASHBOARD_TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setShowServiceView(false); // Hide service view when switching tabs
                setActiveTab(tab.name); // Set active tab
              }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${
                  activeTab === tab.name
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" // Highlight active tab
                    : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600" // Default style for inactive tabs
                } ${collapsed ? "justify-center px-0" : ""}`} // Center icons if collapsed
            >
              <span className="text-xl">{tab.icon}</span> {/* Tab icon */}
              {!collapsed && ( // Show tab label only when expanded
                <span className="truncate whitespace-nowrap">{tab.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* FOOTER / STANDARD INFO */}
        {!collapsed && (
          <div className="pt-4 mt-6 text-center text-[10px] uppercase tracking-wider font-semibold text-slate-300">
            Academic Standard 2026 {/* Footer text */}
          </div>
        )}
      </div>
    </aside>
  );
}
