"use client";

import { useState, useEffect } from "react";
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
  // EFFECT: Restore last opened book
  // -----------------------------
  useEffect(() => {
    const lastBookHash = localStorage.getItem("lastBookHash");
    if (lastBookHash) {
      fetchBookSchedule(lastBookHash);
    }
  }, []);

  // -----------------------------
  // HANDLERS
  // -----------------------------

  const handleUploadSuccess = (data) => {
    setAiPlan(data);
    setShowServiceView(true);
    setShowUploadPopup(false);

    if (data?.pdf_hash) localStorage.setItem("lastBookHash", data.pdf_hash);
  };

  const fetchBookSchedule = async (pdf_hash) => {
    if (!pdf_hash) return;

    const toastId = toast.loading("Fetching schedule for this book...");

    try {
      const { success, schedule, book_name, image, pdf_url, message } = await getBookSchedule(pdf_hash);

      if (success) {
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
      } else {
        toast.error(message || "Failed to fetch schedule", { id: toastId });
      }
    } catch (error) {
      console.error("Error fetching book schedule:", error);
      toast.error("Failed to fetch schedule", { id: toastId });
    }
  };

  const handleBookClick = (book) => {
    if (!book?.pdf_hash) {
      toast.error("PDF not found for this book");
      return;
    }
    fetchBookSchedule(book.pdf_hash);
  };

  // -----------------------------
  // RENDER HELPERS
  // -----------------------------
  const renderContent = () => {
    if (showServiceView && aiPlan) {
      return <Service planData={aiPlan} />;
    }
    if (activeTab === "mock") {
      return <MockTest />;
    }
    return <StudyBooksGrid activeTab={activeTab} onBookClick={handleBookClick} />;
  };

  const showUploadSection = activeTab !== "mock"; 
  const shouldShowStudyGrid = showUploadSection && !showServiceView;

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
            {shouldShowStudyGrid && activeTab === "dashboard" && (
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
