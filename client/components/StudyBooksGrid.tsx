"use client";

import StudyBookCard from "./ui/Card";
import { DUMMY_BOOKS } from "../assets/data/studybooksgriddata";
import { FaBookOpen } from "react-icons/fa";

const TAB_HEADERS = {
  dashboard: {
    heading: "My Study Books",
    subheading: null,
    icon: <FaBookOpen className="text-indigo-600" />,
  },
  performance: {
    heading: "Academic Performance",
    subheading: "Track your academic progress and stay on top of your studies",
    icon: <FaBookOpen className="text-indigo-600" />,
  },
  mcq: {
    heading: "MCQ Section",
    subheading: "Take MCQ tests to improve your knowledge",
    icon: <FaBookOpen className="text-indigo-600" />,
  },
  notes: {
    heading: "Notes Section",
    subheading: "Take notes to improve your knowledge",
    icon: <FaBookOpen className="text-indigo-600" />,
  },
};

interface StudyBooksGridProps {
  activeTab?: "dashboard" | "performance" | "mcq" | "notes";
}

export default function StudyBooksGrid({ activeTab = "dashboard" }: StudyBooksGridProps) {
  const { heading, subheading, icon } = TAB_HEADERS[activeTab] || TAB_HEADERS.dashboard;

  const cardVariant = activeTab === "performance" ? "performance" : "dashboard";

  return (
    <div className="mt-20 mb-6">
      <div className="mb-4">
        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          {icon} {heading}
        </h2>
        {subheading && <p className="text-gray-600 mt-1">{subheading}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {DUMMY_BOOKS.map((book) => (
          <StudyBookCard key={book.id} book={book} variant={cardVariant} />
        ))}
      </div>
    </div>
  );
}
