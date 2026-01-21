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
      return Promise.reject(error); // reject promise on error
    }
    return data;
  } catch (error) {
    console.error("Fetch response error:", error);
    throw error;
  }
};

// ---------------------------
// Generate content API
// ---------------------------
export const generateContent = async ({ book_id, day_number, topic_index, subtopic_index }) => {
  const payload = { book_id, day_number, topic_index, subtopic_index };
  console.log("[GenerateContent] Payload:", payload);

  try {
    const response = await fetch(`${API_URL}/content/generate`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include", // sends HttpOnly auth cookie
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(response);
    console.log("[GenerateContent] Response:", data);
    return data; // Returns content from backend
  } catch (error) {
    console.error("[GenerateContent] Error:", error);
    throw error;
  }
};
