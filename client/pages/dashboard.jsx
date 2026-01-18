"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";

import ProtectedRoute from "../components/ProtectedRoute";
import Sidebar from "../components/Sidebar";
import DashboardContent from "../components/dashboardcontent";
import StudyBooksGrid from "../components/StudyBooksGrid";
import Service from "./service";
import MockTest from "../components/MockTest";
import { useAuth } from "../context/AuthContext";
import { getBookSchedule } from "../api/pdf";

export default function Dashboard() {
  // -----------------------------
  // STATE
  // -----------------------------
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showServiceView, setShowServiceView] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [aiPlan, setAiPlan] = useState(null);

  const { user } = useAuth();

  // -----------------------------
  // HANDLERS
  // -----------------------------

  // After successful upload → open Service
  const handleUploadSuccess = (data) => {
    setAiPlan(data);
    setShowServiceView(true);
    setShowUploadPopup(false);

    if (data?.pdf_hash) {
      localStorage.setItem("lastBookHash", data.pdf_hash);
    }
  };

  // Fetch schedule ONLY when user clicks a book
  const fetchBookSchedule = async (pdf_hash) => {
    if (!pdf_hash) return;

    const toastId = toast.loading("Fetching schedule...");

    try {
      const { success, schedule, book_name, image, pdf_url, message } =
        await getBookSchedule(pdf_hash);

      if (!success) {
        toast.error(message || "Failed to fetch schedule", { id: toastId });
        return;
      }

      setAiPlan({
        pdf_hash,
        book_name,
        image,
        pdf_url,
        schedule: schedule || [],
      });

      setShowServiceView(true);
      localStorage.setItem("lastBookHash", pdf_hash);
      toast.success("Schedule loaded!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  // Book card click → open Service
  const handleBookClick = (book) => {
    if (!book?.pdf_hash) {
      toast.error("PDF not found");
      return;
    }
    fetchBookSchedule(book.pdf_hash);
  };

  // -----------------------------
  // RENDER HELPERS
  // -----------------------------
  const renderContent = () => {
    // Service View (opened only after click/upload)
    if (showServiceView && aiPlan) {
      return (
        <Service
          planData={aiPlan}
          activeTab={activeTab}
        />
      );
    }

    // Mock Test Tab
    if (activeTab === "mock") {
      return <MockTest />;
    }

    // Default: Study Grid
    return (
      <StudyBooksGrid
        activeTab={activeTab}
        onBookClick={handleBookClick}
      />
    );
  };

  const showUploadButton =
    activeTab === "dashboard" && !showServiceView;

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <ProtectedRoute>
      <div className="pt-16">
        <div className="flex min-h-[calc(100vh-4rem)]">
          <Sidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setShowServiceView={setShowServiceView}
          />

          <div className="flex-1 px-6 py-6 relative mt-10">
            {/* Upload Button */}
            {showUploadButton && (
              <button
                onClick={() => setShowUploadPopup(true)}
                className="absolute top-2 right-6 flex items-center gap-2
                           bg-indigo-600 text-white px-4 py-2 rounded-full
                           hover:bg-indigo-700 transition z-10"
              >
                <FiPlus />
                Upload New Book
              </button>
            )}

            {renderContent()}
          </div>
        </div>

        {/* Upload Popup */}
        {showUploadPopup && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-3xl w-full max-w-3xl
                            max-h-[90vh] overflow-y-auto p-6 md:p-8">
              <DashboardContent
                onUploadSuccess={handleUploadSuccess}
                onClose={() => setShowUploadPopup(false)}
              />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
