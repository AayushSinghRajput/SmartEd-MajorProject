"use client"; // Indicates this file is a client-side React component (Next.js convention)

import { useEffect, useState } from "react";
import StudyBookCard from "../ui/Card"; // Card component to display each book
import { getUserBooks } from "../../api/pdf"; // API call to fetch user's books
import Loader from "../ui/Loader"; // Loader component for loading state
import { TAB_HEADERS } from "../../lib/studygridconstants"; // Constant for tab headings and icons
import { fetchPerformance } from "../../api/performance"; // API call to fetch performance data

// Define the shape of a StudyBook object
interface StudyBook {
  id: number;
  pdf_hash: string; // Unique identifier for the PDF
  name: string; // Book title
  image?: string; // Optional cover image
  performance_progress?: number; // Optional overall performance progress %
  study_progress?: number; // Optional study progress %
  pdf_url: string; // Link to the PDF
  day_wise_scores?: {
    // Optional array of scores for each day
    day: number;
    score: number;
    total_questions: number;
  }[];
}

// Props for StudyBooksGrid component
interface StudyBooksGridProps {
  activeTab?: "dashboard" | "performance" | "mcq" | "notes"; // Current tab
  onBookClick?: (book: StudyBook) => void; // Callback when a book is clicked
}

export default function StudyBooksGrid({
  activeTab = "dashboard",
  onBookClick,
}: StudyBooksGridProps) {
  const [books, setBooks] = useState<StudyBook[]>([]); // State to store user's books
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch books and performance data when component mounts
  useEffect(() => {
    const loadBooks = async () => {
      try {
        // Get user's uploaded books from backend
        const data = await getUserBooks();

        // Add performance data to each book
        const booksWithPerformance = await Promise.all(
          (data.books || []).map(async (book: StudyBook) => {
            let dayWiseScores: {
              day: number;
              score: number;
              total_questions: number;
            }[] = [];

            try {
              // Fetch performance for the book
              const perf = await fetchPerformance(book.pdf_hash);
              dayWiseScores = perf?.day_wise_scores || [];
            } catch (err) {
              console.error("Performance fetch failed", err);
            }

            return {
              ...book,
              image: book.image || "/images/Company_Logo.png", // Default image if none provided
              performance_progress: book.performance_progress ?? 0, // Default to 0 if undefined
              study_progress: book.study_progress ?? 0, // Default to 0 if undefined
              day_wise_scores: dayWiseScores, // Attach day-wise scores
            };
          }),
        );

        setBooks(booksWithPerformance); // Update state with books
      } catch (err) {
        console.error(err); // Log any errors
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    loadBooks(); // Trigger data load on mount
  }, []);

  // Remove a book from the list (used in delete action)
  const handleDeleteBook = (pdf_hash: string) => {
    setBooks((prev) => prev.filter((b) => b.pdf_hash !== pdf_hash));
  };

  // Get heading, subheading, and icon for the current tab
  const { heading, subheading, icon } =
    TAB_HEADERS[activeTab] || TAB_HEADERS.dashboard;

  // Decide card variant based on active tab
  const cardVariant = activeTab === "performance" ? "performance" : "dashboard";

  // Only allow image editing on dashboard tab
  const allowImageEdit = activeTab === "dashboard";

  // Show loader while fetching data
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-indigo-50 p-4">
      {/* Header section */}
      <div className="mb-4">
        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          {icon} {heading} {/* Tab icon + heading */}
        </h2>
        {subheading && <p className="text-gray-600 mt-1">{subheading}</p>}
      </div>

      {/* Show message if no books */}
      {books.length === 0 ? (
        <p className="text-gray-500">No books uploaded yet.</p>
      ) : (
        // Grid of book cards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {books.map((book) => (
            <StudyBookCard
              key={book.id}
              book={book}
              variant={cardVariant} // Style card based on tab
              allowImageEdit={allowImageEdit} // Pass edit permission
              onDelete={handleDeleteBook} // Handle delete action
              onClick={() => onBookClick?.(book)} // Handle click action
            />
          ))}
        </div>
      )}
    </div>
  );
}
