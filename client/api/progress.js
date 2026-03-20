// Base URL for API requests. Uses environment variable if available,
// otherwise defaults to local development server.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get headers
// ---------------------------
// Returns headers object for fetch requests.
// If the request is not multipart (FormData), sets "Content-Type" to "application/json".
const getAuthHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) headers["Content-Type"] = "application/json";
  return headers;
};

// ---------------------------
// Handle fetch responses
// ---------------------------
// Parses response as JSON and handles errors centrally.
// Rejects the promise if response status is not OK (>= 400).
const handleResponse = async (response) => {
  try {
    const data = await response.json(); // Convert response body to JSON

    if (!response.ok) {
      // Extract error message from response or fallback to status text
      const error = (data && data.detail) || response.statusText || "Request failed";
      return Promise.reject(error);
    }

    return data; // Return parsed data if successful
  } catch (error) {
    // Handles invalid JSON or parsing errors
    throw error;
  }
};

// ---------------------------
// Update PDF progress
// ---------------------------
// Sends updated progress data for a specific PDF to the backend.
// Parameters:
//   - pdf_hash: string (unique identifier of the PDF)
//   - completed_days: number (number of completed study days)
//   - total_days: number (total number of study days)
// Returns updated progress data (e.g., { progress: 50 }).
export const updateProgress = async ({ pdf_hash, completed_days, total_days }) => {
  try {
    const response = await fetch(`${API_URL}/progress/update`, {
      method: "POST",
      headers: getAuthHeaders(),   // JSON headers
      credentials: "include",      // send cookies for authentication
      body: JSON.stringify({ pdf_hash, completed_days, total_days }),
    });

    return await handleResponse(response); // parse and handle response
  } catch (error) {
    throw error;
  }
};