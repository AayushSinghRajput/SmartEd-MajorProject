import React, { useState } from "react";
import { fetchIOENews, fetchIOMNews } from "../../api/entrance_news";

const EntranceNews = () => {
  const [news, setNews] = useState([]);        // store news items
  const [loading, setLoading] = useState(false); // loading state
  const [error, setError] = useState(null);    // error state
  const [activeExam, setActiveExam] = useState(""); // current exam selected

  // Fetch and set news for selected exam
  const handleFetchNews = async (exam) => {
    setLoading(true);
    setError(null);
    setActiveExam(exam);

    try {
      const data = exam === "IOE" ? await fetchIOENews() : await fetchIOMNews();
      setNews(data.news || []);
    } catch (err) {
      setError(err.toString());
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get source name - use activeExam if source is unknown
  const getSourceName = (source) => {
    // If source exists and is not empty, use it
    if (source && source.trim() !== "") {
      return source;
    }
    // Otherwise, fall back to the active exam name
    return activeExam;
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-4">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Entrance Exam News
        </h1>
        <p className="text-gray-600 text-center">
          Latest updates for IOE and IOM entrance examinations
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => handleFetchNews("IOE")}
          className={`flex-1 py-3 px-6 font-medium text-center transition-all ${
            activeExam === "IOE"
              ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          IOE News
        </button>
        <button
          onClick={() => handleFetchNews("IOM")}
          className={`flex-1 py-3 px-6 font-medium text-center transition-all ${
            activeExam === "IOM"
              ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          IOM News
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[300px]">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Fetching latest news...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* News List */}
        {!loading && news.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {news.map((item) => (
              <div
                key={item._id}
                className="bg-gray-50 rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all duration-200 hover:border-blue-300"
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      {/* Use getSourceName to handle unknown sources */}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getSourceName(item.source)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : "N/A"}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Empty State - when no news available */}
        {!loading && news.length === 0 && activeExam && !error && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No News Available</h3>
            <p className="mt-1 text-gray-500">There are no news items for {activeExam} at the moment.</p>
          </div>
        )}

        {/* Initial State - when no exam selected */}
        {!activeExam && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Select an Exam</h3>
            <p className="mt-1 text-gray-500">Choose IOE or IOM to view the latest news</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>News updates are fetched from official sources. Click on any news item to read more.</p>
      </div>
    </div>
  );
};

export default EntranceNews;