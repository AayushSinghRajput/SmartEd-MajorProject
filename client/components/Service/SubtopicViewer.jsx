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
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          {subtopic?.title || "Select a subtopic"}
        </h1>
        <div className="mt-4 h-1 w-24 bg-indigo-600 rounded-full" />
      </div>

      {/* 📖 Content Card */}
      <div className="bg-white rounded-2xl shadow-lg border p-10 md:p-14 mb-14">

        {/* Loader */}
        {loadingContent ? (
          <Loader />
        ) : mode === "mcq" && Array.isArray(subtopic?.content) ? (
          <MCQViewer mcqs={subtopic.content} pdfHash={pdfHash} day={day} />
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
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold mt-8 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 leading-relaxed text-[17px] mb-5">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-7 mb-6 space-y-2">
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
                  <blockquote className="border-l-4 border-indigo-500 bg-indigo-50 px-6 py-4 my-6 rounded-r-lg italic">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="my-12 border-gray-200" />,
              }}
            >
              {subtopic.content}
            </ReactMarkdown>

            {/* 🖼️ Images Section */}
            {Array.isArray(subtopic?.images) && subtopic.images.length > 0 && (
              <div className="mt-14">
                <h2 className="text-2xl font-bold mb-6">
                  Related Images
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subtopic.images.map((img, index) => (
                    <div
                      key={index}
                      className="rounded-xl overflow-hidden shadow-md border"
                    >
                      {/* ✅ FIX: use img.url */}
                      <img
                        src={img.url}
                        alt={`Subtopic Image ${index + 1}`}
                        className="w-full h-60 object-cover hover:scale-105 transition-transform"
                        loading="lazy"
                      />

                      {/* Optional photographer credit */}
                      {/* {img.photographerName && (
                        <div className="text-xs text-gray-500 px-3 py-2 bg-gray-50">
                          Image:{" "}
                          <a
                            href={img.photographerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {img.photographerName}
                          </a>
                        </div>
                      )} */}
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
          className={`px-7 py-3 rounded-full font-semibold
            ${
              hasPrevious && !loadingContent
                ? "bg-gray-100 hover:bg-gray-200"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          ← Previous
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext || loadingContent}
          className={`px-8 py-3 rounded-full font-semibold
            ${
              hasNext && !loadingContent
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
