import { useState } from "react";
import { likePost, unlikePost, getComments, addComment } from "../../api/community";

// ---------------------------
// Single Post Card
// ---------------------------
export default function PostCard({ post }) {
  const postId = post.id || post._id;

  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [liked, setLiked] = useState(post.is_liked_by_me || false); // Track user like
  const [loading, setLoading] = useState(false);

  // ---------------------------
  // Toggle comments
  // ---------------------------
  const toggleComments = async () => {
    if (!showComments) {
      try {
        const data = await getComments(postId);
        setComments(data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    }
    setShowComments(!showComments);
  };

  // ---------------------------
  // Handle like/unlike
  // ---------------------------
  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (liked) {
        await unlikePost(postId);
        setLikesCount((prev) => prev - 1);
        setLiked(false);
      } else {
        await likePost(postId);
        setLikesCount((prev) => prev + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error("Like/unlike error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Add a new comment
  // ---------------------------
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      const newComment = await addComment(postId, commentText);
      setComments((prev) => [...prev, newComment]);
      setCommentsCount((prev) => prev + 1);
      setCommentText("");
      setShowComments(true);
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 mt-5">
      {/* Author */}
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700">
          {post.author.username[0].toUpperCase()}
        </div>
        <div className="ml-2 font-semibold">{post.author.username}</div>
      </div>

      {/* Content */}
      <div className="mb-2">{post.content}</div>

      {/* Images Section */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          {post.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Post Image ${idx + 1}`}
              className="w-full h-48 object-cover rounded-md"
            />
          ))}
        </div>
      )}

      {/* Like & Comment buttons */}
      <div className="flex items-center text-gray-600 text-sm mb-2 space-x-4">
        <button
          onClick={handleLike}
          className="hover:text-blue-500 font-semibold"
        >
          {liked ? "💙 Liked" : "🤍 Like"} ({likesCount})
        </button>
        <button
          onClick={toggleComments}
          className="hover:text-blue-500 font-semibold"
        >
          💬 Comment ({commentsCount})
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-2 border-t border-gray-200 pt-2">
          {comments.map((c) => (
            <div key={c.id || c._id} className="flex items-start space-x-2 mb-2">
              <div className="w-10 h-10 p-3 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-700">
                {c.user.username[0].toUpperCase()}
              </div>
              <div>
                <span className="font-semibold">{c.user.username}</span>: {c.text}
              </div>
            </div>
          ))}

          {/* Add Comment */}
          <div className="flex items-center mt-2 space-x-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-300 rounded-full px-3 py-1 focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
