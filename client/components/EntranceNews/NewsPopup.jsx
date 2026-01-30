import React from "react";

const NewsPopup = ({ isOpen, onClose, news }) => {
  if (!isOpen || !news) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Popup Box */}
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg relative max-h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {news.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] text-gray-700 whitespace-pre-line">
          {news.content || "No detailed content available."}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end">
          <a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Open original source ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsPopup;
