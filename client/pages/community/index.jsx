import { useEffect, useState } from "react";
import PostCard from "../../components/Community/PostCard"; // Component to display individual posts
import { getAllPosts } from "../../api/community"; // API call to fetch all posts
import { useAuth } from "../../context/AuthContext"; // Auth context for user info

export default function CommunityPage() {
  // State to store all posts fetched from the API
  const [posts, setPosts] = useState([]);
  
  // Get current user and loading state from AuthContext
  const { user, loading } = useAuth();
  const currentUser = user; // Make a clear reference to current user

  // Fetch posts once user is available
  useEffect(() => {
    if (!user) return; // Only fetch posts if user is logged in

    const fetchPosts = async () => {
      try {
        const data = await getAllPosts(); // Fetch posts from backend
        setPosts(data); // Store posts in state
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [user]); // Re-run if the user changes

  // Show loading / login prompt while checking auth
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">
          Please Login to view the posts.
        </p>
      </div>
    );
  }

  // If there are no posts, show a friendly message
  if (posts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen px-4">
        <p className="text-gray-500 text-lg font-medium text-center">
          No posts yet!
        </p>
      </div>
    );
  }

  // Otherwise render posts in a responsive grid
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Community Feed</h1>
      
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={`post-${post.id || post._id}`} // Unique key for each post
            post={post} // Pass the post data
            currentUser={currentUser} // Pass the current user for actions like edit/delete
          />
        ))}
      </div>
    </div>
  );
}