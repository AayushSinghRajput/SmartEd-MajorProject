"use client"; // Client-side React component

// -----------------------------
// IMPORTS
// -----------------------------
import { useState } from "react"; // React hook for state
import { FiPlus } from "react-icons/fi"; // Plus icon for upload button
import { toast } from "react-hot-toast"; // Toast notifications

import ProtectedRoute from "../components/ProtectedRoute"; // Wraps content to restrict to logged-in users
import Sidebar from "../components/Sidebar"; // Sidebar navigation
import DashboardContent from "../components/dashboardcontent"; // Upload & dashboard content modal
import StudyBooksGrid from "../components/StudyBooksGrid"; // Grid of study books
import Service from "./service"; // Main learning service component
import MockTest from "../components/MockTest"; // Mock test module
import { useAuth } from "../context/AuthContext"; // User authentication context
import { getBookSchedule } from "../api/pdf"; // API to fetch schedule for a PDF
import CommunityPage from "../components/Community/CommunityPage"; // Community section
import EntranceNews from "../components/EntranceNews/EntranceNews"; // Entrance exam news section

// -----------------------------
// COMPONENT: Dashboard
// -----------------------------
export default function Dashboard() {
  // -----------------------------
  // STATE
  // -----------------------------
  const [activeTab, setActiveTab] = useState("dashboard"); // Current active tab
  const [showServiceView, setShowServiceView] = useState(false); // Whether Service component is visible
  const [showUploadPopup, setShowUploadPopup] = useState(false); // Show/hide book upload modal
  const [aiPlan, setAiPlan] = useState(null); // Current selected/uploaded AI-generated plan

  const { user } = useAuth(); // Get logged-in user info

  // -----------------------------
  // HANDLERS
  // -----------------------------

  // Triggered after a successful PDF upload
  const handleUploadSuccess = (data) => {
    setAiPlan(data); // Store the plan data
    setShowServiceView(true); // Open Service component
    setShowUploadPopup(false); // Close the upload modal

    if (data?.pdf_hash) {
      localStorage.setItem("lastBookHash", data.pdf_hash); // Save last uploaded book
    }
  };

  // Fetch schedule from backend for a clicked book
  const fetchBookSchedule = async (pdf_hash) => {
    if (!pdf_hash) return;

    const toastId = toast.loading("Fetching schedule..."); // Show loading toast

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

      setShowServiceView(true); // Show the service component
      localStorage.setItem("lastBookHash", pdf_hash); // Store last accessed book
      toast.success("Schedule loaded!", { id: toastId }); // Success toast
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  // Handles click on a book in the grid
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
    // Show Service view if plan is selected or uploaded
    if (showServiceView && aiPlan) {
      return <Service planData={aiPlan} activeTab={activeTab} />;
    }

    // Render Mock Test component
    if (activeTab === "mock") {
      return <MockTest />;
    }

    // Render Community page
    if (activeTab === "community") {
      return <CommunityPage />;
    }

    // Render Entrance News page
    if (activeTab === "entranceNews") {
      return <EntranceNews />;
    }

    // Default: Study Books grid
    return (
      <StudyBooksGrid activeTab={activeTab} onBookClick={handleBookClick} />
    );
  };

  // Show upload button only in Dashboard tab and when Service is not open
  const showUploadButton = activeTab === "dashboard" && !showServiceView;

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <ProtectedRoute>
      <div className="pt-4">
        <div className="flex min-h-[calc(100vh-4rem)]">
          {/* Sidebar navigation */}
          <Sidebar
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setShowServiceView={setShowServiceView}
          />

          {/* Main content area */}
          <div className="flex-1 px-6 py-6 relative mt-20">
            {/* Upload Button */}
            {showUploadButton && (
              <button
                onClick={() => setShowUploadPopup(true)}
                className="absolute top-2 right-6 flex items-center gap-2
                           bg-indigo-600 text-white px-4 py-2 rounded-full
                           hover:bg-indigo-700 transition z-10"
              >
                <FiPlus /> {/* Plus icon */}
                Upload New Book
              </button>
            )}

            {/* Render appropriate content based on activeTab and service state */}
            {renderContent()}
          </div>
        </div>

        {/* Upload Popup Modal */}
        {showUploadPopup && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div
              className="bg-white rounded-3xl w-full max-w-3xl
                            max-h-[90vh] overflow-y-auto p-6 md:p-8"
            >
              <DashboardContent
                onUploadSuccess={handleUploadSuccess} // Callback after successful upload
                onClose={() => setShowUploadPopup(false)} // Close modal
              />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}