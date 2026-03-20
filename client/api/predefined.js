// Base URL for API requests. Uses environment variable if available,
// otherwise defaults to local development server.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Handle fetch responses
// ---------------------------
// Parses the response as JSON and handles errors centrally.
// Rejects the promise if the response status is not OK (>= 400).
const handleResponse = async (response) => {
  try {
    const data = await response.json(); // Convert response body to JSON

    if (!response.ok) {
      // Extract error message from response or fallback to status text
      const error = (data && data.error) || response.statusText || "Request failed";
      return Promise.reject(error);
    }

    return data; // Return parsed data if successful
  } catch (error) {
    // Handles invalid JSON or parsing errors
    throw error;
  }
};

// ---------------------------
// Get predefined study plan
// ---------------------------
// Fetches a global/predefined study plan based on the subject.
// Parameters:
//   - subject: string (e.g., "physics", "math", etc.)
// Returns study plan data from the backend.
export const getGlobalPlan = async (subject) => {
  try {
    const response = await fetch(`${API_URL}/ai/predefined-study-plan/${subject}`, {
      method: "GET",
      credentials: "include", // send HttpOnly cookie for authentication
    });

    return await handleResponse(response); // parse and handle response
  } catch (error) {
    throw error;
  }
};