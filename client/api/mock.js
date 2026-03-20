// Base URL for API requests. Uses environment variable if available,
// otherwise falls back to local development server.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Handle fetch responses
// ---------------------------
// Parses the response as JSON and handles errors centrally.
// If the response is not successful (status >= 400), it rejects the promise.
const handleResponse = async (response) => {
  try {
    const data = await response.json(); // Convert response body to JSON

    if (!response.ok) {
      // Extract error message from response or fallback to status text
      const error = (data && data.error) || response.statusText || "Request failed";
      return Promise.reject(error);
    }

    return data; // Return parsed data if request is successful
  } catch (error) {
    // Handles cases where response is not valid JSON or parsing fails
    throw error;
  }
};

// ---------------------------
// Fetch mock test data
// ---------------------------
// getMockTest fetches mock test data based on the given type.
// Parameters:
//   - mock_type: string (e.g., "ioe", "iom", etc.)
// Returns mock test data from the backend.
export const getMockTest = async (mock_type) => {
  try {
    const response = await fetch(`${API_URL}/exams/${mock_type}`, {
      method: "GET",
      credentials: "include", // send HttpOnly cookie for authentication
    });

    return handleResponse(response); // parse response and handle errors
  } catch (error) {
    throw error;
  }
};