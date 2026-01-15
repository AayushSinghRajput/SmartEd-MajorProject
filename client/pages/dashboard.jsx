"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

import Service from "./service";
import MCQSection from "./mcqsection";
import NotesSection from "./notesection";
import ChatPage from "./chatpage";
import DashboardContent from "../components/dashboardcontent";
import MockTest from "../components/MockTest";
import StudyBooksGrid from "../components/StudyBooksGrid";
import DashboardShell from "../components/DashboardShell";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard"); // current active tab
  const [showServiceView, setShowServiceView] = useState(false); // whether Service view is active
  const [showUploadPopup, setShowUploadPopup] = useState(false); // Upload popup state
  const [aiPlan, setAiPlan] = useState(null); // Data from AI plan
  const { user } = useAuth();

  // Handle successful upload
  const handleUploadSuccess = (data) => {
    setAiPlan(data);
    setShowServiceView(true);
    setShowUploadPopup(false);
  };

  /**
   * Renders content for tabs other than StudyBooksGrid.
   * For performance, we no longer render ProgressTracker.
   */
  const renderContent = () => {
    if (showServiceView && aiPlan) {
      return <Service planData={aiPlan} />;
    }

    switch (activeTab) {
      case "mcq":
        return (
          <DashboardShell
            title="MCQ Section"
            subtitle="Take MCQ tests to improve your knowledge"
          >
            <MCQSection />
          </DashboardShell>
        );
      case "notes":
        return (
          <DashboardShell
            title="Notes Section"
            subtitle="Take notes to improve your knowledge"
          >
            <NotesSection />
          </DashboardShell>
        );
      case "mock":
        return (
          <DashboardShell
            title="Mock Test Section"
            subtitle="Take Mock Tests to improve your knowledge"
          >
            <MockTest />
          </DashboardShell>
        );
      default:
        // For dashboard and performance, we don't render additional content here.
        return null;
    }
  };

  // Show Upload button and StudyBooksGrid for all tabs except "mock"
  const showUploadSection = activeTab !== "mock";

  return (
    <ProtectedRoute>
      <div className="pt-16">
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <Sidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setShowServiceView={setShowServiceView}
          />

          {/* Main content area */}
          <div className="flex-1 px-6 py-6 relative mt-10">
            {/* Upload button */}
            {showUploadSection && (
              <button
                onClick={() => setShowUploadPopup(true)}
                className="absolute top-2 right-6 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition z-10"
              >
                <FiPlus />
                Upload New Book
              </button>
            )}

            {/* StudyBooksGrid */}
            {showUploadSection && (
              <div className="mt-20 mb-6">
                <StudyBooksGrid activeTab={activeTab} />
              </div>
            )}

            {/* Render other tab content if applicable */}
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Upload popup modal */}
      {showUploadPopup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
            <DashboardContent
              onUploadSuccess={handleUploadSuccess}
              onClose={() => setShowUploadPopup(false)}
            />
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
