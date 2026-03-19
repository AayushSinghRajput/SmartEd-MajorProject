"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import books from "../assets/data/topviewedbooks.json";
import { getGlobalPlan } from "../api/predefined";
import StudyPlanModal from "./PredefinedPlan/StudyPlanModal";
import toast from "react-hot-toast";
import { colors } from "../constants/colors";
import { FaBookOpen, FaStar } from "react-icons/fa";

export default function PredefinedStudyPlan() {
  const [showAll, setShowAll] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCardId, setLoadingCardId] = useState(null);

  const visibleBooks = showAll ? books : books.slice(0, 3);

  const handleViewDetails = async (subject, id) => {
    if (!subject) {
      toast.error("Subject name is missing for this card.");
      return;
    }

    setLoading(true);
    setLoadingCardId(id);
    try {
      const data = await getGlobalPlan(subject);
      setSelectedPlan(data);
      setIsModalOpen(true);
      toast.success(`${subject} plan loaded successfully!`);
    } catch (error) {
      console.error("Failed to fetch plan:", error);
      toast.error("Study plan not found for this subject yet.");
    } finally {
      setLoading(false);
      setLoadingCardId(null);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="p-6 md:p-8 lg:p-12"
      style={{ background: colors.gradients.subtle }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6
                        shadow-lg transition-transform duration-300 "
            style={{
              background: "linear-gradient(145deg, #6b73ff, #000dff)",
              boxShadow:
                "8px 8px 15px rgba(0,0,0,0.2), -8px -8px 15px rgba(255,255,255,0.3)",
            }}
          >
            <span className="text-2xl text-white">
              <FaBookOpen />
            </span>
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: colors.primary[900] }}
          >
            30-Day Smart Study Plans
          </h2>

          <p
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto"
            style={{ color: colors.primary[600] }}
          >
            AI-curated daily roadmaps designed to maximize your entrance exam
            preparation efficiency
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {visibleBooks.map((book) => {
              return (
                <motion.div
                  key={book.id}
                  variants={cardVariants}
                  whileHover="hover"
                  layout
                  className="group relative"
                >
                  <div className="h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col transform hover:scale-[1.02]">
                    {/* Level Badge */}
                    {book.level && (
                      <div className="absolute top-4 left-4 z-10">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: colors.accent.amber[100],
                            color: colors.accent.amber[500],
                          }}
                        >
                          {book.level}
                        </span>
                      </div>
                    )}

                    {/* Rating & Views */}
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                        <span className="text-amber-500 text-2xl">
                          <FaStar />
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: colors.neutral[800] }}
                        >
                          {book.rating || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Book Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={book.img}
                        alt={book.subject}
                        className="w-full h-full object-cover "
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                      {/* Progress Bar - if completion exists */}
                      {book.completion && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="mb-1 flex justify-between">
                            <span className="text-xs font-medium text-white">
                              Progress
                            </span>
                            <span className="text-xs font-bold text-white">
                              {book.completion}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: colors.gradients.primary }}
                              initial={{ width: 0 }}
                              animate={{ width: `${book.completion}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="mb-4">
                        <h3
                          className="text-xl font-bold mb-2"
                          style={{ color: colors.neutral[900] }}
                        >
                          {book.subject}
                        </h3>
                        <p
                          className="text-sm mb-4"
                          style={{ color: colors.neutral[600] }}
                        >
                          Complete {book.duration || "30 Days"} roadmap with
                          daily targets and practice sessions
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
                              <div
                                className="w-full h-full flex items-center justify-center text-xs font-bold"
                                style={{
                                  background: colors.primary[100],
                                  color: colors.primary[700],
                                }}
                              >
                                {book.author
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "?"}
                              </div>
                            </div>
                            <div>
                              <p
                                className="text-xs"
                                style={{ color: colors.neutral[500] }}
                              >
                                Author
                              </p>
                              <p
                                className="text-sm font-medium"
                                style={{ color: colors.neutral[800] }}
                              >
                                {book.author || "Unknown"}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p
                              className="text-xs"
                              style={{ color: colors.neutral[500] }}
                            >
                              Duration
                            </p>
                            <p
                              className="text-sm font-semibold"
                              style={{ color: colors.primary[600] }}
                            >
                              {book.duration || "30 Days"}
                            </p>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() =>
                            handleViewDetails(book.subject, book.id)
                          }
                          disabled={loading && loadingCardId === book.id}
                          className="w-full bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-[3px_3px_6.4px_1px_#9E9999] transition-shadow duration-300 hover:shadow-[5px_5px_8px_2px_rgba(139,92,246,0.75)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading && loadingCardId === book.id ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Loading...
                            </>
                          ) : (
                            <>
                              <span className="text-2xl text-white">
                                <FaBookOpen />
                              </span>
                              View 30-Day Plan
                              <span className="ml-auto">→</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* View More Button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 mx-auto shadow-lg hover:shadow-xl active:scale-95"
            style={{
              background: showAll ? colors.neutral[100] : colors.primary[50],
              color: showAll ? colors.neutral[700] : colors.primary[700],
              border: `2px solid ${showAll ? colors.neutral[200] : colors.primary[200]}`,
            }}
          >
            {showAll ? (
              <>Show Less Plans</>
            ) : (
              <>
                View More Plans ({books.length - 3})
                <span
                  className="ml-2 px-2 py-1 text-xs rounded-full"
                  style={{
                    background: colors.primary[100],
                    color: colors.primary[700],
                  }}
                >
                  +{books.length - 3}
                </span>
              </>
            )}
          </button>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: colors.primary[700] }}
              >
                {books.length}+
              </div>
              <div className="text-sm" style={{ color: colors.neutral[600] }}>
                Study Plans
              </div>
            </div>
            <div
              className="w-px h-8"
              style={{ background: colors.neutral[200] }}
            ></div>
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: colors.primary[700] }}
              >
                4.7
              </div>
              <div className="text-sm" style={{ color: colors.neutral[600] }}>
                Avg Rating
              </div>
            </div>
            <div
              className="w-px h-8"
              style={{ background: colors.neutral[200] }}
            ></div>
            <div className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: colors.primary[700] }}
              >
                75%
              </div>
              <div className="text-sm" style={{ color: colors.neutral[600] }}>
                Success Rate
              </div>
            </div>
          </div>
        </motion.div>

        {/* Study Plan Modal */}
        <AnimatePresence>
          {isModalOpen && selectedPlan && (
            <StudyPlanModal
              plan={selectedPlan}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
