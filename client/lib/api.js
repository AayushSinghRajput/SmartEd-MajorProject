const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get auth headers
// ---------------------------
// Retrieves the JWT token from localStorage and constructs headers
// - Authorization: Bearer token
// - Content-Type: application/json for non-multipart requests
// - Skips Content-Type if uploading FormData (multipart)
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

// ---------------------------
// Helper: Handle fetch responses
// ---------------------------
// Converts response to JSON and checks for errors
// Rejects the promise if status is not OK (outside 200-299)
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    if (!response.ok) {
      const error = (data && data.error) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// ---------------------------
// Send a prompt to AI for text generation
// ---------------------------
export const sendMessage = async (prompt) => {
  const response = await fetch(`${API_URL}/ai/generate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ prompt }),
  });
  return handleResponse(response);
};

// ---------------------------
// Send context to AI for note generation for a specific day
// ---------------------------
export const sendContext = async (context, fileHash, day) => {
  const response = await fetch(`${API_URL}/ai/note`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ context, fileHash, day }),
  });
  return handleResponse(response);
};

// ---------------------------
// Fetch all user notes
// ---------------------------
export const getUserNotes = async () => {
  const response = await fetch(`${API_URL}/ai/note`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// ---------------------------
// Generate MCQs for a specific day using context
// ---------------------------
export const getMCQs = async (context, fileHash, day) => {
  const response = await fetch(`${API_URL}/ai/mcqs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ context, fileHash, day }),
  });
  return handleResponse(response);
};

// ---------------------------
// Fetch all MCQs created by the user
// ---------------------------
export const getAllUserMCQs = async () => {
  const response = await fetch(`${API_URL}/ai/mcqs`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// ---------------------------
// Upload a new book (PDF) to AI system
// ---------------------------
export const uploadBook = async (file) => {
  const formData = new FormData();
  formData.append("book", file);
  const response = await fetch(`${API_URL}/ai/upload-book`, {
    method: "POST",
    headers: getAuthHeaders(true), // multipart/form-data
    body: formData,
  });
  return handleResponse(response);
};

// ---------------------------
// Hydrate a study day with images (AI enhancement)
// ---------------------------
export const hydrateDayWithImages = async (planId, dayNum) => {
  const response = await fetch(`${API_URL}/ai/hydrate-day/${planId}/${dayNum}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// ---------------------------
// Get all saved study plans for the user
// ---------------------------
export const getSavedPlans = async () => {
  const response = await fetch(`${API_URL}/ai/plans`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// ---------------------------
// Toggle completion progress of a subtopic
// ---------------------------
export const toggleSubtopicProgress = async (planId, day, subtopicTitle) => {
  const response = await fetch(`${API_URL}/ai/toggle-progress`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ planId, day, subtopicTitle }),
  });
  return handleResponse(response);
};

// ---------------------------
// Fetch all study plans created by the current user
// ---------------------------
export const getUserStudyPlans = async () => {
  const response = await fetch(`${API_URL}/ai/user-plans`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};