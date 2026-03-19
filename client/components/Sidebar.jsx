import { useState } from "react";
import { DASHBOARD_TABS } from "../lib/constants";
import { formatAcademicId, getCleanUsername } from "../lib/utils";

export default function Sidebar({
  user,
  activeTab,
  setActiveTab,
  setShowServiceView,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        sticky top-16 left-0
        ${collapsed ? "w-20" : "w-72"}
        h-[calc(100vh-4rem)]
        bg-white
        border-r border-slate-100
        transition-all duration-300
        flex-shrink-0
        z-40
      `}
    >
      <div className="flex flex-col h-full px-4 py-5">
        
        {/* NEW ICON TOGGLE */}
        <div className={`flex items-center mb-6 ${collapsed ? "justify-center" : "justify-end"}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {/* Minimalist 3-line horizontal icon */}
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

        {/* PROFILE */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-700">
            {getCleanUsername(user).charAt(0)}
          </div>

          {!collapsed && (
            <div className="mt-3 animate-in fade-in duration-500">
              <h3 className="font-bold text-slate-800">
                {getCleanUsername(user)}
              </h3>
              <p className="text-xs text-indigo-600 font-medium">
                {user?.publicMetadata?.role || "Student"}
              </p>
              <p className="mt-2 text-[10px] font-mono text-slate-400">
                {formatAcademicId(user?._id || user?.id, user?.createdAt)}
              </p>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-2">
          {DASHBOARD_TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setShowServiceView(false);
                setActiveTab(tab.name);
              }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${
                  activeTab === tab.name
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                } ${collapsed ? "justify-center px-0" : ""}`}
            >
              <span className="text-xl">{tab.icon}</span>
              {!collapsed && (
                <span className="truncate whitespace-nowrap">
                  {tab.label}
                </span>
              )}
            </button>
          ))}
        </nav>

        {!collapsed && (
          <div className="pt-4 mt-6 text-center text-[10px] uppercase tracking-wider font-semibold text-slate-300">
            Academic Standard 2026
          </div>
        )}
      </div>
    </aside>
  );
}