// Base URL for API requests. Uses environment variable if defined,
// otherwise defaults to local development server.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get Auth headers
// ---------------------------
// Returns headers object for fetch requests.
// For cookie-based authentication, Authorization header is not required.
// If not sending multipart/form-data, sets "Content-Type" to "application/json".
const getAuthHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) headers["Content-Type"] = "application/json"; // JSON payload
  return headers;
};

// ---------------------------
// Handle fetch responses
// ---------------------------
// Parses JSON response and handles errors centrally.
// Rejects the promise if the response status is not OK (>= 400).
const handleResponse = async (response) => {
  try {
    const data = await response.json(); // Convert response to JSON

    if (!response.ok) {
      // Extract error message from response or fallback to status text
      const error = (data && data.detail) || response.statusText || "Request failed";
      return Promise.reject(error);
    }

    return data; // Return parsed data if request is successful
  } catch (error) {
    // Handles invalid JSON or unexpected response errors
    throw error;
  }
};

// ---------------------------
// Generate MCQs API
// ---------------------------
// Sends a request to generate multiple-choice questions (MCQs).
// payload: object containing required data (e.g., topic, difficulty, etc.)
// Returns an array of MCQs from the backend.
export const generateMCQs = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/mcq/generate`, {
      method: "POST",
      headers: getAuthHeaders(),      // JSON headers
      credentials: "include",         // send cookies for authentication
      body: JSON.stringify(payload),  // convert payload to JSON
    });

    const data = await handleResponse(response); // parse and handle errors
    return data.mcqs; // return only the MCQs array
  } catch (error) {
    throw error;
  }
};