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
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-gray-500 text-lg font-medium text-center">
          No posts yet!
        </p>
      </div>
    );
  }

  // Otherwise render posts
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Community Feed</h1>
      {posts.map((post) => (
        <PostCard key={post.id || post._id} post={post} currentUser={currentUser} />
      ))}
    </div>
  );
}
