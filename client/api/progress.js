const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get headers
// ---------------------------
const getAuthHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) headers["Content-Type"] = "application/json";
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
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    console.error("[handleResponse] Error:", error);
    throw error;
  }
};

// ---------------------------
// Update PDF progress
// ---------------------------
export const updateProgress = async ({ pdf_hash, completed_days, total_days }) => {
  try {
    const response = await fetch(`${API_URL}/progress/update`, {
      method: "POST",
      headers: getAuthHeaders(),  // JSON headers
      credentials: "include",     // send HttpOnly auth cookie
      body: JSON.stringify({ pdf_hash, completed_days, total_days }),
    });

    return await handleResponse(response); // { progress: 50 } for example
  } catch (error) {
    console.error("[updateProgress] Error:", error);
    throw error;
  }
};
