// Base URL for API requests. Uses environment variable if defined,
// otherwise defaults to local development server.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Auth headers helper
// ---------------------------
// Returns headers object for fetch requests.
// For cookie-based authentication, Authorization header is not needed.
// If not sending multipart/form-data, sets "Content-Type" to "application/json".
const getAuthHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) headers["Content-Type"] = "application/json";
  return headers;
};

// ---------------------------
// Handle fetch responses
// ---------------------------
// Centralized function to parse JSON response and handle errors.
// Rejects the promise if the response is not OK (status >= 400).
const handleResponse = async (response) => {
  try {
    const data = await response.json(); // Parse response body as JSON
    if (!response.ok) {
      const error = (data && data.detail) || response.statusText || "Request failed";
      return Promise.reject(error);
    }
    return data; // Return parsed data if successful
  } catch (err) {
    console.error("Fetch response error:", err);
    throw err;
  }
};

// ---------------------------
// COMMUNITY API FUNCTIONS
// ---------------------------

// Create a new post with content and optional images
// formData: FormData instance containing post content and images
export const createPost = async (formData) => {
  const response = await fetch(`${API_URL}/community/`, {
    method: "POST",
    headers: getAuthHeaders(true), // multipart request → skip Content-Type
    credentials: "include",        // include cookies for authentication
    body: formData,                // send FormData payload
  });
  return handleResponse(response);
};

// Get all posts including like information
export const getAllPosts = async () => {
  const response = await fetch(`${API_URL}/community/`, {
    method: "GET",
    headers: getAuthHeaders(),      // JSON headers
    credentials: "include",
  });
  return handleResponse(response);
};

// Like a post by ID
export const likePost = async (postId) => {
  const response = await fetch(`${API_URL}/community/${postId}/like`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse(response);
};

// Unlike a post by ID
export const unlikePost = async (postId) => {
  const response = await fetch(`${API_URL}/community/${postId}/like`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse(response);
};

// Add a comment to a post
// text: string containing the comment content
export const addComment = async (postId, text) => {
  const response = await fetch(`${API_URL}/community/${postId}/comment`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ text }), // send comment text as JSON
  });
  return handleResponse(response);
};

// Get all comments for a specific post
export const getComments = async (postId) => {
  const response = await fetch(`${API_URL}/community/${postId}/comments`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse(response);
};

// Get posts created by the currently logged-in user
export const getMyPosts = async () => {
  const response = await fetch(`${API_URL}/community/my/posts`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse(response);
};

// ---------------------------
// Update a community post
// ---------------------------
// postId: ID of the post to update
// content: new text content
// images: optional array of File objects to attach
export const updateCommunityPost = async (postId, content, images = []) => {
  const formData = new FormData();
  formData.append("content", content);
  images.forEach((file) => formData.append("images", file)); // append each image

  const response = await fetch(`${API_URL}/community/${postId}`, {
    method: "PUT",
    headers: getAuthHeaders(true), // multipart → skip Content-Type
    credentials: "include",
    body: formData,
  });
  return handleResponse(response);
};

// ---------------------------
// Delete a community post
// ---------------------------
// postId: ID of the post to delete
export const deleteCommunityPost = async (postId) => {
  const response = await fetch(`${API_URL}/community/${postId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse(response);
};