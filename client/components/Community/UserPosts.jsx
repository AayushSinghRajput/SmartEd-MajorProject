"use client";

<<<<<<< HEAD
import PostCard from "./PostCard";
import { useAuth } from "../../context/AuthContext";

/**
 * Display all posts by the current user
 * Responsive Facebook-like grid feed
 */
export default function UserPosts({ posts, setPosts }) {
  const { user } = useAuth();
  const currentUser = user;

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500 text-center px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mb-4 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h4l3 6 4-12 3 6h4"
          />
        </svg>
        <div className="text-lg font-medium">No posts yet</div>
        <div className="text-sm mt-1">Be the first to post!</div>
=======

import PostCard from "./PostCard"; // Existing PostCard component

/**
 * Display all posts by the current user
 */
export default function UserPosts({ posts }) {
  if (!posts || posts.length === 0) {
    // Center message vertically and horizontally
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500 text-center">
        No posts yet. Be the first to post!
>>>>>>> 8df90ed (Dev (#50))
      </div>
    );
  }

<<<<<<< HEAD
  // Callbacks for PostCard
  const handlePostUpdate = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id || p._id === updatedPost._id ? updatedPost : p))
    );
  };

  const handlePostDelete = (deletedPostId) => {
    setPosts((prev) =>
      prev.filter((p) => p.id !== deletedPostId && p._id !== deletedPostId)
    );
  };

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-4">
      {posts.map((post) => (
        <PostCard
          key={`post-${post.id || post._id}`}
          post={post}
          currentUser={currentUser}
          onPostUpdate={handlePostUpdate}
          onPostDelete={handlePostDelete}
        />
=======
  return (
    <div className="mt-6 flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id || post._id} post={post} />
>>>>>>> 8df90ed (Dev (#50))
      ))}
    </div>
  );
}
