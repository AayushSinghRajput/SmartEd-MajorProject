"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { createPost } from "../../api/community"; // API function to create post

/**
 * Popup modal to submit a new post with optional images
 */
export default function PostPopup({ onClose, onPostSuccess }) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // store selected files
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files)); // convert FileList to array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && images.length === 0) {
      toast.error("Post cannot be empty");
      return;
    }

    setLoading(true);

    try {
      // Prepare FormData to send content + images
      const formData = new FormData();
      formData.append("content", content);
      images.forEach((img) => formData.append("images", img)); // multiple images support

      const data = await createPost(formData); // API expects FormData
      toast.success("Post created successfully!");
      onPostSuccess(data);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8">
        <h2 className="text-xl font-bold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Post content */}
          <textarea
            placeholder="Write your post..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
          />

          {/* Image upload */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>

        {/* Preview selected images */}
        {images.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="w-20 h-20 overflow-hidden rounded-md border">
                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
