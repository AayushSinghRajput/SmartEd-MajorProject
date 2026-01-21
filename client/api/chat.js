const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get headers
// ---------------------------
// For cookie-based auth, no Authorization header is needed.
// Just set Content-Type unless it's a multipart request.
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
    console.error("Fetch response error:", error);
    throw error;
  }
};

// ---------------------------
// Send chat message to AI backend
// ---------------------------
export const sendChatMessage = async (payload) => {
  console.log("[ChatAPI] Sending payload:", payload);

  try {
    const response = await fetch(`${API_URL}/chat/aichat`, {
      method: "POST",
      headers: getAuthHeaders(false), // Content-Type only
      credentials: "include",         // automatically sends HttpOnly cookie
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(response);
    console.log("[ChatAPI] Raw API response:", data);

    return data.response; // backend should return { response: {...} }
  } catch (error) {
    console.error("[ChatAPI] Error while sending message:", error);
    throw error;
  }
};
