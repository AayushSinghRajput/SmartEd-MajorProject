"use client";

import  { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyPosts } from "../../api/community"; // API to get posts by user
import PostButton from "./PostButton";
import PostPopup from "./PostPopup";
import UserPosts from "./UserPosts";

/**
 * Main Community Component for the Dashboard tab
 */
export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch posts on mount
  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      try {
        const data = await getMyPosts(); // API call to fetch user's posts
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [user]);

  // After posting successfully, refresh the post list
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
    <div className="relative p-4">
      {/* Button to create a post */}
      <PostButton onClick={() => setShowPopup(true)} />

      {/* Popup to create a post */}
      {showPopup && (
        <PostPopup
          onClose={() => setShowPopup(false)}
          onPostSuccess={handlePostSuccess}
        />
      )}

      {/* User's posts */}
      <UserPosts posts={posts} />
    </div>
  );
}
