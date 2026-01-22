import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiVolume2,
  FiPause,
} from "react-icons/fi";
import Loader from "../ui/Loader";
import MCQViewer from "../MCQViewer";
import { cleanTextForSpeech, cleanText } from "../../utils/cleanTextForSpeech";

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
  /* -------------------- Image State -------------------- */

  const [validImages, setValidImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(null);

  /* -------------------- Voice State -------------------- */

  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  /* -------------------- Sync Images & Voice -------------------- */

  useEffect(() => {
    setValidImages(Array.isArray(subtopic?.images) ? subtopic.images : []);
    setActiveImageIndex(null);

    // Stop voice when subtopic changes
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [subtopic]);

  const sanitizedMCQs = Array.isArray(subtopic?.content)
    ? subtopic.content.map((mcq) => ({
        ...mcq,
        question: cleanText(mcq.question),
        options: Array.isArray(mcq.options)
          ? mcq.options.map(cleanText)
          : mcq.options,
      }))
    : [];

  const handleImageError = (index) => {
    setValidImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* -------------------- Text To Speech -------------------- */

  const handleVoiceToggle = () => {
    const synth = window.speechSynthesis;

    // Pause only if actively speaking
    if (synth.speaking && isSpeaking) {
      synth.pause();
      setIsSpeaking(false);
      return;
    }

    // Resume ONLY if utterance still exists
    if (synth.paused && utteranceRef.current) {
      synth.resume();
      setIsSpeaking(true);
      return;
    }

    // Clear broken paused state (THIS WAS MISSING)
    if (synth.paused && !utteranceRef.current) {
      synth.cancel();
    }

    // Start fresh speech
    if (typeof subtopic?.content === "string") {
      const text = cleanTextForSpeech(subtopic.content);

      synth.cancel(); // ensure clean queue

      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onend = () => {
          utteranceRef.current = null;
          setIsSpeaking(false);
        };

        utterance.onerror = () => {
          utteranceRef.current = null;
          setIsSpeaking(false);
        };

        utteranceRef.current = utterance;
        synth.speak(utterance);
        setIsSpeaking(true);
      }, 0);
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="max-w-5xl mx-auto py-16 px-8 md:px-12 min-h-[70vh]">
      {/* Title */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          {subtopic?.title || "Select a subtopic"}
        </h1>
        <div className="mt-4 h-1 w-24 bg-indigo-600 rounded-full" />
      </div>

      {/* Content */}
      <div className="relative bg-white rounded-2xl shadow-lg border p-10 md:p-14 mb-14">
        {/* 🔊 Voice Button */}
        {typeof subtopic?.content === "string" && (
          <button
            onClick={handleVoiceToggle}
            className="absolute top-6 right-6 p-3 rounded-full bg-indigo-100 hover:bg-indigo-200"
            title={isSpeaking ? "Pause reading" : "Read content"}
          >
            {isSpeaking ? (
              <FiPause className="text-indigo-700 text-xl" />
            ) : (
              <FiVolume2 className="text-indigo-700 text-xl" />
            )}
          </button>
        )}

        {loadingContent ? (
          <Loader />
        ) : mode === "mcq" ? (
          <MCQViewer mcqs={sanitizedMCQs} pdfHash={pdfHash} day={day} />
        ) : typeof subtopic?.content === "string" ? (
          <>
            {/* Markdown */}
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

            {/* Image Grid */}
            {validImages.length > 0 && (
              <div className="mt-14">
                <h2 className="text-2xl font-bold mb-6">Related Images</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {validImages.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className="cursor-pointer rounded-xl overflow-hidden shadow-md border"
                    >
                      <img
                        src={img.url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-60 object-cover hover:scale-105 transition-transform"
                        onError={() => handleImageError(index)}
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

      {/* Navigation */}
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

      {/* Fullscreen Image Viewer */}
      {activeImageIndex !== null && validImages[activeImageIndex] && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            <FiX />
          </button>

          {activeImageIndex > 0 && (
            <button
              onClick={() => setActiveImageIndex((i) => i - 1)}
              className="absolute left-6 text-white text-4xl"
            >
              <FiChevronLeft />
            </button>
          )}

          {activeImageIndex < validImages.length - 1 && (
            <button
              onClick={() => setActiveImageIndex((i) => i + 1)}
              className="absolute right-6 text-white text-4xl"
            >
              <FiChevronRight />
            </button>
          )}

          <img
            src={validImages[activeImageIndex].url}
            alt="Fullscreen"
            className="max-h-[95vh] max-w-[95vw] rounded-xl shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
