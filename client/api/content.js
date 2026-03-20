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
// Generate content API
// ---------------------------
// generateContent requests the backend to generate content for a specific book, day, topic, and subtopic.
// Parameters:
//   - book_id: string, identifier of the book
//   - day_number: number, the day number of the content
//   - topic_index: number, index of the topic
//   - subtopic_index: number, index of the subtopic
// Returns the generated content from backend.
export const generateContent = async ({ book_id, day_number, topic_index, subtopic_index }) => {
  const payload = { book_id, day_number, topic_index, subtopic_index }; // request payload

  try {
    const response = await fetch(`${API_URL}/content/generate`, {
      method: "POST",
      headers: getAuthHeaders(),       // JSON payload
      credentials: "include",          // send cookies for authentication
      body: JSON.stringify(payload),   // convert JS object to JSON
    });

    const data = await handleResponse(response); // parse and handle errors
    return data; // Return content data from backend
  } catch (error) {
    throw error;
  }
};