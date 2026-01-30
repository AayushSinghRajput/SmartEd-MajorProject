"use client";

import Image from "next/image";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { updateBookImage, deletePdfAndData } from "../../api/pdf";
import CylindricalProgress from "./CylindricalProgress";
import DayPerformaceBar from "./DayPerformanceBar";

interface DayWiseScore {
  day: number;
  score: number;
  total_questions: number;
}
interface StudyBookCardProps {
  book?: {
    id?: number;
    pdf_hash?: string;
    name?: string;
    image?: string;
    performance_progress?: number; // performance progress
    study_progress?: number; //for dashboard progress
    day_wise_scores?: DayWiseScore[];
  };
  variant?: "dashboard" | "performance";
  onClick?: () => void;
  allowImageEdit?: boolean; // controls whether the edit icon is shown
  onDelete?: (pdf_hash: string) => void; // callback for delete
}

export default function StudyBookCard({
  book,
  variant = "dashboard",
  onClick,
  allowImageEdit = true, // default: allow editing
  onDelete, // callback for delete
}: StudyBookCardProps) {
  const fallbackImage = "/images/Company_Logo.png";

  const [currentImage, setCurrentImage] = useState<string>(
    book?.image || fallbackImage,
  );
  const [uploading, setUploading] = useState(false);

  const performance_progress = book?.performance_progress ?? 0;
  const studyProgress = book?.study_progress ?? 0;
  const name = book?.name ?? "Untitled Book";
  const pdf_hash = book?.pdf_hash ?? "";

  const isLocalImage = currentImage.startsWith("/");

  // ================= IMAGE UPLOAD HANDLER =================
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.stopPropagation();

    const file = event.target.files?.[0];
    if (!file || !pdf_hash) return;

    try {
      setUploading(true);
      const result = await updateBookImage(pdf_hash, file);

      if (result?.image_url) {
        setCurrentImage(result.image_url);
      } else {
        alert("Failed to update image");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!pdf_hash) return;

    const confirmed = confirm("Are you sure you want to delete this book?");
    if (!confirmed) return;

    try {
      await deletePdfAndData(pdf_hash);
      onDelete?.(pdf_hash); // 🔥 update UI from parent
    } catch (error) {
      console.error(error);
      alert("Failed to delete book");
    }
  };

  // ================= PERFORMANCE VARIANT =================
  if (variant === "performance") {
    const size = 140;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - performance_progress / 100);

    return (
      <div className="flex flex-col items-center gap-4 bg-white rounded-2xl shadow-md p-6">
        <div className="relative w-[140px] h-[140px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[80px] h-[80px] rounded-full overflow-hidden">
              <Image
                src={currentImage}
                alt={name}
                fill
                className="object-cover"
                unoptimized={isLocalImage}
              />
            </div>
          </div>

          <svg
            width={size}
            height={size}
            className="absolute top-0 left-0 -rotate-90"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#6366F1"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-gray-800 text-center">{name}</h3>
        <DayPerformaceBar data={book?.day_wise_scores || []} />
      </div>
    );
  }

  // ================= DASHBOARD VARIANT =================
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition
                 p-2 flex flex-col gap-4 cursor-pointer relative"
    >
      <div className="relative w-full h-52 rounded-xl overflow-hidden">
        <Image
          src={currentImage}
          alt={name}
          fill
          className="object-cover"
          unoptimized={isLocalImage}
        />

        {/* Only show edit if allowed */}
        {allowImageEdit && (
          <>
            {/* Image upload input */}
            <input
              type="file"
              id={`file-input-${pdf_hash}`}
              accept="image/*"
              className="hidden"
              onClick={(e) => e.stopPropagation()}
              onChange={handleFileChange}
            />

            <div className="absolute top-2 right-2 flex gap-2">
              {/* EDIT ICON */}
              <button
                type="button"
                title="Change book image"
                className="bg-white/90 p-2 rounded-full shadow
                   hover:bg-indigo-600 hover:text-white transition"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  document.getElementById(`file-input-${pdf_hash}`)?.click();
                }}
              >
                {uploading ? "..." : <FiEdit size={14} />}
              </button>

              {/* DELETE ICON */}
              <button
                type="button"
                title="Delete book"
                className="bg-white/90 p-2 rounded-full shadow
                   hover:bg-red-600 hover:text-white transition"
                onClick={handleDelete}
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-800 truncate px-1">{name}</h3>
      {studyProgress > 0 && <CylindricalProgress value={studyProgress} />}
    </div>
  );
}
