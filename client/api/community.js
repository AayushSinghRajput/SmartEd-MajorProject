const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Auth headers helper
// ---------------------------
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isMultipart) headers["Content-Type"] = "application/json";
  return headers;
};

// ---------------------------
// Handle fetch responses
// ---------------------------
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    if (!response.ok) {
      const error = (data && data.detail) || response.statusText || "Request failed";
      return Promise.reject(error);
    }
    return data;
  } catch (err) {
    console.error("Fetch response error:", err);
    throw err;
  }
};

// ---------------------------
// Community API functions
// ---------------------------

// Create a post
export const createPost = async (formData) => {
  const response = await fetch(`${API_URL}/community/`, {
    method: "POST",
    headers: getAuthHeaders(true), // pass true to skip Content-Type
    credentials: "include",
    body: formData, // FormData instance containing content + images
  });

  return handleResponse(response);
};


// Get all posts (with like info)
export const getAllPosts = async () => {
  const response = await fetch(`${API_URL}/community/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Like a post
export const likePost = async (postId) => {
  const response = await fetch(`${API_URL}/community/${postId}/like`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse(response);
};

// Unlike a post
export const unlikePost = async (postId) => {
  const response = await fetch(`${API_URL}/community/${postId}/like`, {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse(response);
};

// Add a comment
export const addComment = async (postId, text) => {
  const response = await fetch(`${API_URL}/community/${postId}/comment`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({ text }),
  });
  return handleResponse(response);
};

// Get comments for a post
export const getComments = async (postId) => {
  const response = await fetch(`${API_URL}/community/${postId}/comments`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Get current user's posts
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
export const updateCommunityPost = async (postId, content, images = []) => {
  const formData = new FormData();
  formData.append("content", content);

  images.forEach((file) => {
    formData.append("images", file); // append each image
  });

  const response = await fetch(`${API_URL}/community/${postId}`, {
    method: "PUT",
    headers: getAuthHeaders(true), // true = multipart
    body: formData,
  });

  return handleResponse(response);
};

// ---------------------------
// Delete a community post
// ---------------------------
export const deleteCommunityPost = async (postId) => {
  const response = await fetch(`${API_URL}/community/${postId}`, {
    method: "DELETE",
    headers: getAuthHeaders(), // normal JSON headers
  });

  return handleResponse(response);
};
