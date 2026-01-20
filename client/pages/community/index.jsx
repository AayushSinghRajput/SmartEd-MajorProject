import { useEffect, useState } from "react";
import PostCard from "../../components/Community/PostCard";
import { getAllPosts } from "../../api/community";
import { useAuth } from "../../context/AuthContext";

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const { user, loading } = useAuth();
  const currentUser = user;

  useEffect(() => {
    if (!user) return; // user must exist

    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [user]);

  // Show loading / login prompt while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Please Login to view the posts.</p>
      </div>
    );
  }

  // If no posts, show message centered both vertically & horizontally
  if (posts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen px-4">
        <p className="text-gray-500 text-lg font-medium text-center">
          No posts yet!
        </p>
      </div>
    );
  }

  // Otherwise render posts in responsive grid
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Community Feed</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={`post-${post.id || post._id}`} // add prefix to make sure key is string and unique
            post={post}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
}
