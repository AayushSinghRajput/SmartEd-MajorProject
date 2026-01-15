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
        transition-all duration-300
        flex-shrink-0
      `}
    >
      <div className="flex flex-col h-full px-4 py-5">
        {/* TOGGLE */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`relative w-12 h-6 rounded-full transition-colors
              ${collapsed ? "bg-indigo-600" : "bg-slate-300"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                transition-transform duration-300
                ${collapsed ? "translate-x-6" : ""}`}
            />
          </button>
        </div>

        {/* PROFILE */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold">
            {getCleanUsername(user).charAt(0)}
          </div>

          {!collapsed && (
            <>
              <h3 className="mt-3 font-bold text-slate-800">
                {getCleanUsername(user)}
              </h3>
              <p className="text-xs text-indigo-600">
                {user?.publicMetadata?.role || "Student"}
              </p>
              <p className="mt-2 text-[10px] font-mono text-slate-400">
                {formatAcademicId(user?._id || user?.id, user?.createdAt)}
              </p>
            </>
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
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-semibold transition
                ${
                  activeTab === tab.name
                    ? "bg-indigo-600 text-white"
                    : "text-slate-600 hover:bg-indigo-50"
                }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {!collapsed && tab.label}
            </button>
          ))}
        </nav>

        {!collapsed && (
          <div className="pt-4 mt-6 text-center text-xs text-slate-400">
            Academic Standard 2026
          </div>
        )}
      </div>
    </aside>
  );
}
