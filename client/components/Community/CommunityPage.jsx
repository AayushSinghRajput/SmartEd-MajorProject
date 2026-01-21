"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyPosts } from "../../api/community";
import PostButton from "./PostButton";
import PostPopup from "./PostPopup";
import UserPosts from "./UserPosts";

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch posts on mount
  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      try {
        const data = await getMyPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [user]);

  // Add new post
  const handlePostSuccess = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Please login to access the community.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-indigo-50 p-4">
      {/* Create Post Button */}
      <PostButton onClick={() => setShowPopup(true)} />

      {/* Post Popup */}
      {showPopup && (
        <PostPopup
          onClose={() => setShowPopup(false)}
          onPostSuccess={handlePostSuccess}
        />
      )}

      {/* User Posts */}
      <UserPosts posts={posts} setPosts={setPosts} />
    </div>
  );
}