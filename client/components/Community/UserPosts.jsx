"use client";


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
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id || post._id} post={post} />
      ))}
    </div>
  );
}
