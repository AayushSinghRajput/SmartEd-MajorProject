// Base URL for API requests. Uses environment variable if defined,
// otherwise defaults to local development server.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get Auth headers
// ---------------------------
// Returns headers object for fetch requests.
// For cookie-based authentication, Authorization header is not needed.
// If not sending multipart/form-data, sets "Content-Type" to "application/json".
const getAuthHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) headers["Content-Type"] = "application/json"; // JSON payload
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
      // Extract error message from response or fallback to status text
      const error = (data && data.detail) || response.statusText || "Request failed";
      return Promise.reject(error); // Reject promise on error
    }
    return data; // Return parsed data if successful
  } catch (error) {
    // Handles cases where response is not JSON or other fetch errors
    throw error;
  }
};

// ---------------------------
// Fetch IOE Entrance News
// ---------------------------
// Requests news related to IOE entrance exams from the backend
// Returns an array or object containing entrance news data.
export const fetchIOENews = async () => {
  const response = await fetch(`${API_URL}/entrance-news/ioe`, {
    method: "GET",
    headers: getAuthHeaders(), // JSON headers
  });
  return handleResponse(response); // parse JSON and handle errors
};

// ---------------------------
// Fetch IOM Entrance News
// ---------------------------
// Requests news related to IOM entrance exams from the backend
// Returns an array or object containing entrance news data.
export const fetchIOMNews = async () => {
  const response = await fetch(`${API_URL}/entrance-news/iom`, {
    method: "GET",
    headers: getAuthHeaders(), // JSON headers
  });
  return handleResponse(response); // parse JSON and handle errors
};