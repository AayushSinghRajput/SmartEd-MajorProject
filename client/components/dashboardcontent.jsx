"use client";

import { FiX } from "react-icons/fi";
import UploadUI from "./uploadui";

export default function DashboardContent({ onUploadSuccess, onClose }) {
  return (
    <div className="relative w-full min-h-[calc(100vh-10rem)]">
      {/* ❌ CLOSE ICON */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
        aria-label="Close"
      >
        <FiX size={22} />
      </button>

      <div className="flex justify-center items-center h-full px-4 md:px-6 py-8 md:py-12">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome to SmartPrep AI!
          </h2>

          <p className="text-gray-600">
            Start by uploading a textbook or notes to generate an AI study plan.
          </p>

          <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100">
            <UploadUI onUploadSuccess={onUploadSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}
