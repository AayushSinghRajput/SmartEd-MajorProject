const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get Auth headers
// ---------------------------
const getAuthHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) headers["Content-Type"] = "application/json"; // JSON payload
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
      return Promise.reject(error); // Reject promise on error
    }
    return data;
  } catch (error) {
    console.error("[handleResponse] Error parsing response:", error);
    throw error;
  }
};

// ---------------------------
// Generate MCQs API
// ---------------------------
export const generateMCQs = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/mcq/generate`, {
      method: "POST",
      headers: getAuthHeaders(), // JSON + cookie-based auth
      credentials: "include", // send HttpOnly cookie
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(response);
    console.log("[generateMCQs] Response:", data.mcqs);

    return data.mcqs; // return only the MCQs array
  } catch (error) {
    console.error("[generateMCQs] Error:", error);
    throw error;
  }
};
