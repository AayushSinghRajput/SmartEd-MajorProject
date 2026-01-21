import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Loader from "../ui/Loader";
import MCQViewer from "../MCQViewer";

export default function SubtopicViewer({
  loadingContent,
  subtopic,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  mode,
  pdfHash,
  day,
}) {
  /* -------------------- Image Viewer State -------------------- */
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const images = Array.isArray(subtopic?.images) ? subtopic.images : [];

  /* -------------------- Helpers -------------------- */

  // ✅ Remove markdown symbols like ##, -, *, etc. from MCQ text
  const cleanText = (text = "") =>
    text
      .replace(/^#+\s*/g, "") // remove headings (##, ###)
      .replace(/^-\s*/g, "") // remove bullet points (- )
      .replace(/\*\*/g, "") // remove bold (**)
      .trim();

  // ✅ Sanitize MCQs before rendering
  const sanitizedMCQs = Array.isArray(subtopic?.content)
    ? subtopic.content.map((mcq) => ({
        ...mcq,
        question: cleanText(mcq.question),
        options: Array.isArray(mcq.options)
          ? mcq.options.map((opt) => cleanText(opt))
          : mcq.options,
      }))
    : [];

  const closeViewer = () => setActiveImageIndex(null);

  const showNextImage = () =>
    setActiveImageIndex((prev) =>
      prev < images.length - 1 ? prev + 1 : prev
    );

  const showPrevImage = () =>
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <div className="max-w-5xl mx-auto py-16 px-8 md:px-12 min-h-[70vh]">
      {/* 📘 Title */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          {subtopic?.title || "Select a subtopic"}
        </h1>
        <div className="mt-4 h-1 w-24 bg-indigo-600 rounded-full" />
      </div>

      {/* 📖 Content */}
      <div className="bg-white rounded-2xl shadow-lg border p-10 md:p-14 mb-14">
        {loadingContent ? (
          <Loader />
        ) : mode === "mcq" ? (
          // ✅ MCQ Viewer with cleaned questions
          <MCQViewer
            mcqs={sanitizedMCQs}
            pdfHash={pdfHash}
            day={day}
          />
        ) : typeof subtopic?.content === "string" ? (
          <>
            {/* Markdown Content */}
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold mt-12 mb-4 flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 leading-relaxed text-[17px] mb-5">
                    {children}
                  </p>
                ),
              }}
            >
              {subtopic.content}
            </ReactMarkdown>

            {/* 🖼️ Images Grid */}
            {images.length > 0 && (
              <div className="mt-14">
                <h2 className="text-2xl font-bold mb-6">Related Images</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className="cursor-pointer rounded-xl overflow-hidden shadow-md border"
                    >
                      <img
                        src={img.url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-60 object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p>No content available.</p>
        )}
      </div>

      {/* ⏮️ Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious || loadingContent}
          className="px-7 py-3 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          ← Previous
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext || loadingContent}
          className="px-8 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {/* ================= FULLSCREEN IMAGE VIEWER ================= */}
      {activeImageIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          {/* ❌ Close */}
          <button
            onClick={closeViewer}
            className="absolute top-6 right-6 text-white text-3xl hover:scale-110 transition"
          >
            <FiX />
          </button>

          {/* ⬅️ Previous */}
          {activeImageIndex > 0 && (
            <button
              onClick={showPrevImage}
              className="absolute left-6 text-white text-4xl hover:scale-110 transition"
            >
              <FiChevronLeft />
            </button>
          )}

          {/* ➡️ Next */}
          {activeImageIndex < images.length - 1 && (
            <button
              onClick={showNextImage}
              className="absolute right-6 text-white text-4xl hover:scale-110 transition"
            >
              <FiChevronRight />
            </button>
          )}

          {/* ✅ Fullscreen Image */}
          <img
            src={images[activeImageIndex].url}
            alt="Fullscreen"
            className="max-h-[95vh] max-w-[95vw] rounded-xl shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
