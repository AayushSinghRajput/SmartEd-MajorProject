const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Handle fetch responses
// ---------------------------
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    if (!response.ok) {
      const error = (data && data.error) || response.statusText || "Request failed";
      return Promise.reject(error); // Reject promise if server returns error
    }
    return data; // return parsed JSON
  } catch (error) {
    console.error("[handleResponse] Error parsing response:", error);
    throw error;
  }
};

// ---------------------------
// Fetch mock test data
// ---------------------------
export const getMockTest = async (mock_type) => {
  try {
    const response = await fetch(`${API_URL}/exams/${mock_type}`, {
      method: "GET",
      credentials: "include", // send HttpOnly cookie automatically
    });

    return handleResponse(response);
  } catch (error) {
    console.error(`[getMockTest] Error fetching ${mock_type} mock test:`, error);
    throw error;
  }
};
