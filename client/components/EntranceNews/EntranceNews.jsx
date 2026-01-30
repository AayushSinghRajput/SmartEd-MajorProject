import React, { useState } from "react";
import { fetchIOENews, fetchIOMNews } from "../../api/entrance_news";
import NewsPopup from "./NewsPopup";

const EntranceNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeExam, setActiveExam] = useState("");

  // Popup state
  const [selectedNews, setSelectedNews] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch news
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

  // Source fallback
  const getSourceName = (source) =>
    source && source.trim() !== "" ? source : activeExam;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Entrance Exam News
        </h1>
        <p className="text-gray-600">
          Latest updates for IOE and IOM entrance examinations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {["IOE", "IOM"].map((exam) => (
          <button
            key={exam}
            onClick={() => handleFetchNews(exam)}
            className={`flex-1 py-3 px-6 font-medium ${
              activeExam === exam
                ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {exam} News
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {loading && <p className="text-center">Fetching latest news...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {!loading && news.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {news.map((item) => (
              <div
                key={item._id}
                className="bg-gray-50 rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all"
              >
                {/* CARD LINK (unchanged behavior) */}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="flex justify-between mt-4 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                      {getSourceName(item.source)}
                    </span>

                    <span>
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )
                        : "N/A"}
                    </span>
                  </div>
                </a>

                {/* VIEW NEWS BUTTON (NEW) */}
                <button
                  onClick={(e) => {
                    e.preventDefault();     // stop link navigation
                    e.stopPropagation();    // stop card click
                    setSelectedNews(item);
                    setIsPopupOpen(true);
                  }}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  View News →
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && news.length === 0 && activeExam && !error && (
          <p className="text-center text-gray-500 py-12">
            No news available for {activeExam}.
          </p>
        )}

        {!activeExam && !loading && (
          <p className="text-center text-gray-500 py-12">
            Select IOE or IOM to view the latest news.
          </p>
        )}
      </div>

      {/* Popup */}
      <NewsPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        news={selectedNews}
      />
    </div>
  );
};

export default EntranceNews;
