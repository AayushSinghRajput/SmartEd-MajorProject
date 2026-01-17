"use client";

import { useEffect, useState } from "react";
import StudyBookCard from "../components/ui/Card";
import { getUserBooks } from "../api/pdf";
import Loader from "../components/ui/Loader";
import { TAB_HEADERS } from "../lib/studygridconstants";

interface StudyBook {
  id: number;
  pdf_hash: string;
  name: string;
  image?: string;
  performance_progress?: number;
  study_progress?:number;
  pdf_url: string;
}

interface StudyBooksGridProps {
  activeTab?: "dashboard" | "performance" | "mcq" | "notes";
  onBookClick?: (book: StudyBook) => void;
}

export default function StudyBooksGrid({
  activeTab = "dashboard",
  onBookClick,
}: StudyBooksGridProps) {
  const [books, setBooks] = useState<StudyBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserBooks()
      .then((data) => {
        const mappedBooks = (data.books || []).map((book: StudyBook) => ({
          id: book.id,
          pdf_hash: book.pdf_hash,
          name: book.name || "Untitled Book",
          image: book.image || "/images/Company_Logo.png",
          performance_progress: book.performance_progress ?? 0,
          study_progress: book.study_progress ?? 0,
          pdf_url: book.pdf_url || "#",
        }));
        setBooks(mappedBooks);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const { heading, subheading, icon } = TAB_HEADERS[activeTab] || TAB_HEADERS.dashboard;
  const cardVariant = activeTab === "performance" ? "performance" : "dashboard";

  // hide edit for mcq / notes
  const allowImageEdit = activeTab === "dashboard";

  if (loading) return <Loader />;

  return (
    <div className="mt-20 mb-6">
      <div className="mb-4">
        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          {icon} {heading}
        </h2>
        {subheading && <p className="text-gray-600 mt-1">{subheading}</p>}
      </div>

      {books.length === 0 ? (
        <p className="text-gray-500">No books uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {books.map((book) => (
            <StudyBookCard
              key={book.id}
              book={book}
              variant={cardVariant}
              allowImageEdit={allowImageEdit} // ✅ pass this prop
              onClick={() => onBookClick?.(book)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
