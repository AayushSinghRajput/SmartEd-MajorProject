"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyPosts } from "../../api/community";
=======
import  { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyPosts } from "../../api/community"; // API to get posts by user
>>>>>>> 8df90ed (Dev (#50))
import PostButton from "./PostButton";
import PostPopup from "./PostPopup";
import UserPosts from "./UserPosts";

<<<<<<< HEAD
=======
/**
 * Main Community Component for the Dashboard tab
 */
>>>>>>> 8df90ed (Dev (#50))
export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch posts on mount
  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      try {
<<<<<<< HEAD
        const data = await getMyPosts();
=======
        const data = await getMyPosts(); // API call to fetch user's posts
>>>>>>> 8df90ed (Dev (#50))
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [user]);

<<<<<<< HEAD
  // Add new post
=======
  // After posting successfully, refresh the post list
>>>>>>> 8df90ed (Dev (#50))
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
<<<<<<< HEAD
      {/* Create Post Button */}
      <PostButton onClick={() => setShowPopup(true)} />

      {/* Post Popup */}
=======
      {/* Button to create a post */}
      <PostButton onClick={() => setShowPopup(true)} />

      {/* Popup to create a post */}
>>>>>>> 8df90ed (Dev (#50))
      {showPopup && (
        <PostPopup
          onClose={() => setShowPopup(false)}
          onPostSuccess={handlePostSuccess}
        />
      )}

<<<<<<< HEAD
      {/* User Posts */}
      <UserPosts posts={posts} setPosts={setPosts} />
=======
      {/* User's posts */}
      <UserPosts posts={posts} />
>>>>>>> 8df90ed (Dev (#50))
    </div>
  );
}
