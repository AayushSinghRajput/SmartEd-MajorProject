import { useState } from "react";
<<<<<<< HEAD
import {
  likePost,
  unlikePost,
  getComments,
  addComment,
  updateCommunityPost,
  deleteCommunityPost
} from "../../api/community";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function PostCard({ post, currentUser, onPostUpdate, onPostDelete }) {
=======
import { likePost, unlikePost, getComments, addComment } from "../../api/community";

// ---------------------------
// Single Post Card
// ---------------------------
export default function PostCard({ post }) {
>>>>>>> 8df90ed (Dev (#50))
  const postId = post.id || post._id;

  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
<<<<<<< HEAD
  const [liked, setLiked] = useState(post.is_liked_by_me || false);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [newImages, setNewImages] = useState([]); // track new images

=======
  const [liked, setLiked] = useState(post.is_liked_by_me || false); // Track user like
  const [loading, setLoading] = useState(false);

>>>>>>> 8df90ed (Dev (#50))
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
<<<<<<< HEAD
  // Like/unlike
=======
  // Handle like/unlike
>>>>>>> 8df90ed (Dev (#50))
  // ---------------------------
  const handleLike = async () => {
    if (loading) return;
    setLoading(true);
<<<<<<< HEAD
=======

>>>>>>> 8df90ed (Dev (#50))
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
<<<<<<< HEAD
  // Add comment
=======
  // Add a new comment
>>>>>>> 8df90ed (Dev (#50))
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

<<<<<<< HEAD
  // ---------------------------
  // Save edited post (content + images)
  // ---------------------------
  const handleEditSave = async () => {
    try {
      const updatedPost = await updateCommunityPost(postId, editContent, newImages);
      onPostUpdate?.(updatedPost);
      setEditing(false);
      setNewImages([]);
    } catch (err) {
      console.error("Update post error:", err);
    }
  };

  // ---------------------------
  // Delete post
  // ---------------------------
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteCommunityPost(postId);
      onPostDelete?.(postId);
    } catch (err) {
      console.error("Delete post error:", err);
    }
  };

  // ---------------------------
  // Check author
  // ---------------------------
  const isAuthor = currentUser && currentUser.id === post.author.id;

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 flex flex-col justify-between">
      {/* Top: Author + Edit/Delete */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 flex items-center justify-center font-bold text-gray-700 bg-gray-300 text-lg">
            {post.author.username[0].toUpperCase()}
          </div>
          <div className="ml-3">
            <div className="font-semibold text-gray-800">{post.author.username}</div>
            <div className="text-xs text-gray-500">{post.created_at?.split("T")[0] || "Just now"}</div>
          </div>
        </div>

        {isAuthor && !editing && (
          <div className="flex space-x-2 text-gray-500">
            <button onClick={() => setEditing(true)} className="hover:text-blue-600" title="Edit Post">
              <FaEdit />
            </button>
            <button onClick={handleDelete} className="hover:text-red-600" title="Delete Post">
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      {/* Content + Edit */}
      <div className="mb-3 text-gray-800 min-h-[50px]">
        {editing ? (
          <div className="flex flex-col space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
              rows={3}
            />
            {/* Image input */}
            <input
              type="file"
              multiple
              onChange={(e) => setNewImages(Array.from(e.target.files))}
              className="border border-gray-300 rounded-lg p-1"
            />
            <div className="flex space-x-2">
              <button onClick={handleEditSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-semibold">
                Save
              </button>
              <button onClick={() => setEditing(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 font-semibold">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          post.content || " "
        )}
      </div>

      {/* Images */}
      <div className="mb-3 min-h-[200px]">
        {post.images && post.images.length > 0 ? (
          post.images.length === 1 ? (
            <img src={post.images[0]} alt="Post Image" className="w-full max-h-[350px] object-cover rounded-lg shadow-sm hover:scale-105 transition-transform duration-200" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {post.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Post Image ${idx + 1}`} className="w-full h-60 object-cover rounded-lg hover:scale-105 transition-transform duration-200" />
              ))}
            </div>
          )
        ) : (
          <div className="h-[10px]" />
        )}
      </div>

      {/* Like & Comment */}
      <div className="flex flex-col mt-2">
        <div className="flex items-center text-gray-600 text-sm mb-2 border-t border-b border-gray-200 py-2">
          <button onClick={handleLike} className={`flex-1 flex items-center justify-center space-x-1 font-semibold hover:text-blue-600 ${liked ? "text-blue-600" : ""}`}>
            {liked ? "💙 Liked" : "🤍 Like"} <span>({likesCount})</span>
          </button>
          <button onClick={toggleComments} className="flex-1 flex items-center justify-center space-x-1 font-semibold hover:text-blue-600">
            💬 Comment <span>({commentsCount})</span>
          </button>
        </div>

        {showComments && (
          <div className="mt-3">
            {comments.map((c) => (
              <div key={c.id || c._id} className="flex items-start space-x-2 mb-2 bg-gray-50 p-2 rounded-lg">
                <div className="w-9 h-9 p-2 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700 text-sm">
                  {c.user.username[0].toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">{c.user.username}</span>: <span className="text-gray-700">{c.text}</span>
                </div>
              </div>
            ))}

            <div className="flex items-center mt-2 space-x-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              />
              <button onClick={handleAddComment} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 font-semibold">
                Post
              </button>
            </div>
          </div>
        )}
      </div>
=======
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
>>>>>>> 8df90ed (Dev (#50))
    </div>
  );
}
