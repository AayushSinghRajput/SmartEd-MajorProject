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
// Fetch IOE Entrance News
// ---------------------------
export const fetchIOENews = async () => {
  const response = await fetch(`${API_URL}/entrance-news/ioe`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response); // handle JSON + errors
};

// ---------------------------
// Fetch IOM Entrance News
// ---------------------------
export const fetchIOMNews = async () => {
  const response = await fetch(`${API_URL}/entrance-news/iom`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response); // handle JSON + errors
};
