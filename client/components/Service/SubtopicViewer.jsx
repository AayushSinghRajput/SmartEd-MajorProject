import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
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
}) {
  // ✅ Debug logs
  console.log("SubtopicViewer Render");
  console.log("Mode:", mode);
  console.log("Subtopic content type:", typeof subtopic?.content);
  console.log("Subtopic content:", subtopic?.content);

  // Wrapped click handlers to prevent multiple clicks during loading
  const handlePrevious = () => {
    if (!loadingContent && hasPrevious) onPrevious();
  };

  const handleNext = () => {
    if (!loadingContent && hasNext) onNext();
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-10 flex flex-col justify-between min-h-[60vh]">
      {/* Title */}
      <h1 className="text-4xl font-black text-gray-900 mb-8 leading-tight">
        {subtopic?.title || "Select a subtopic"}
      </h1>

      {/* Description */}
      <div className="prose prose-indigo max-w-none flex-1 mb-12">
        {loadingContent ? (
          <Loader />
        ) : mode === "mcq" && Array.isArray(subtopic?.content) ? (
          <MCQViewer mcqs={subtopic.content} />
        ) : typeof subtopic?.content === "string" ? (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {subtopic.content}
          </ReactMarkdown>
        ) : (
          <p>No content available for this subtopic.</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={!hasPrevious || loadingContent}
          className={`px-6 py-3 rounded-full font-bold transition-all 
            ${
              hasPrevious && !loadingContent
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-200 text-gray-500 pointer-events-none opacity-60 cursor-not-allowed"
            }`}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!hasNext || loadingContent}
          className={`px-6 py-3 rounded-full font-bold transition-all 
            ${
              hasNext && !loadingContent
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-200 text-gray-500 pointer-events-none opacity-60 cursor-not-allowed"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
