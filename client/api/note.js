// Base URL for API requests. Uses environment variable if available,
// otherwise defaults to local development server.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get headers
// ---------------------------
// Returns headers object for fetch requests.
// If the request is not multipart (i.e., not using FormData),
// it sets "Content-Type" to "application/json".
const getAuthHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) headers["Content-Type"] = "application/json";
  return headers;
};

// ---------------------------
// Handle fetch responses and errors
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
// Summarize notes for a day
// ---------------------------
// Sends a request to summarize notes for a specific book and day.
// Parameters:
//   - book_id: string (identifier of the book)
//   - day_number: number (specific day to summarize)
// The backend enforces "short" note summaries.
// Returns summarized notes from the backend.
export const summarizeDayNotes = async ({ book_id, day_number }) => {
  try {
    const response = await fetch(`${API_URL}/notes/summarize`, {
      method: "POST",
      headers: getAuthHeaders(),   // JSON headers
      credentials: "include",      // send cookies for authentication
      body: JSON.stringify({
        book_id,
        day_number,
        note_type: "short",        // fixed type for short summaries
      }),
    });

    const data = await handleResponse(response); // parse and handle errors
    return data; // return summarized notes
  } catch (error) {
    throw error;
  }
};