"use client";

export default function ProgressBar({ progress }) {
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
