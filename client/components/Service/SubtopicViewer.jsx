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
  pdfHash,
  day,
}) {
  return (
    <div className="max-w-5xl mx-auto py-16 px-8 md:px-12 min-h-[70vh]">
      
      {/* 📘 Subtopic Title */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          {subtopic?.title || "Select a subtopic"}
        </h1>
        <div className="mt-4 h-1 w-24 bg-indigo-600 rounded-full" />
      </div>

      {/* 📖 Content Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 md:p-14 mb-14 transition-all">
        {loadingContent ? (
          <Loader />
        ) : mode === "mcq" && Array.isArray(subtopic?.content) ? (
          <MCQViewer mcqs={subtopic.content} pdfHash={pdfHash} day={day} />
        ) : typeof subtopic?.content === "string" ? (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-900 flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-gray-700 leading-relaxed text-[17px] mb-5">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-7 mb-6 space-y-2 text-gray-700 text-[17px]">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-indigo-700">
                  {children}
                </strong>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-indigo-500 bg-indigo-50 px-6 py-4 my-6 rounded-r-lg text-gray-800 italic">
                  {children}
                </blockquote>
              ),
              hr: () => (
                <hr className="my-12 border-gray-200" />
              ),
            }}
          >
            {subtopic.content}
          </ReactMarkdown>
        ) : (
          <p>No content available.</p>
        )}
      </div>

      {/* ⏮️ Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious || loadingContent}
          className={`px-7 py-3 rounded-full font-semibold transition-all shadow-sm
            ${
              hasPrevious && !loadingContent
                ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                : "bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed"
            }`}
        >
          ← Previous
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext || loadingContent}
          className={`px-8 py-3 rounded-full font-semibold transition-all shadow-md
            ${
              hasNext && !loadingContent
                ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02]"
                : "bg-gray-200 text-gray-500 opacity-60 cursor-not-allowed"
            }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
