"use client";

import Image, { StaticImageData } from "next/image";
import { FiEdit } from "react-icons/fi";

interface StudyBookCardProps {
  book: {
    id: number;
    name: string;
    image: string | StaticImageData;
    progress?: number;
  };
  variant?: "dashboard" | "performance";
}

export default function StudyBookCard({ book, variant = "dashboard" }: StudyBookCardProps) {
  const progress = book.progress ?? 0;

  if (variant === "performance") {
    const size = 140; // total SVG size
    const imageSize = 80; // size of the image in the center
    const strokeWidth = 8; 
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - progress / 100);

    return (
      <div className="flex flex-col items-center gap-4 bg-white rounded-2xl shadow-md p-6">
        <div className="relative w-[140px] h-[140px]">
          {/* CENTER IMAGE */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                       w-[80px] h-[80px] rounded-full overflow-hidden"
          >
            <Image
              src={book.image}
              alt={book.name}
              fill
              className="object-cover"
            />
          </div>

          {/* PROGRESS RING */}
          <svg width={size} height={size} className="absolute top-0 left-0 transform -rotate-90">
            {/* BACKGROUND CIRCLE */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E5E7EB" // gray-200
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* PROGRESS CIRCLE */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#6366F1" // indigo-600
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
        </div>

        {/* BOOK NAME */}
        <h3 className="text-lg font-bold text-gray-800 text-center">{book.name}</h3>
      </div>
    );
  }

  // DASHBOARD STYLE (default)
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-2 flex flex-col gap-4">
      <div className="relative w-full h-50 rounded-xl overflow-hidden">
        <Image src={book.image} alt={book.name} fill className="object-cover" />

        <button
          className="absolute top-2 right-2 bg-white/90 p-2 rounded-full shadow hover:bg-indigo-600 hover:text-white transition"
          title="Change book image"
        >
          <FiEdit size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-gray-800 truncate">{book.name}</h3>
        {/* Keep horizontal progress bar */}
      </div>
    </div>
  );
}
