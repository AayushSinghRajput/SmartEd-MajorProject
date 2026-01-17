const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get Auth headers
// ---------------------------
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
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



/**
 * Send a chat message to backend AI chatbot
 */
export const sendChatMessage = async (payload) => {
  console.log("[ChatAPI] Sending payload:", payload);

  try {
    const response = await fetch(`${API_URL}/chat/aichat`, {
      method: "POST",
      headers: getAuthHeaders(false),
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(response);

    console.log("[ChatAPI] Raw API response:", data);

    // Expecting backend to return { response: {...} }
    return data.response;
  } catch (error) {
    console.error("[ChatAPI] Error while sending message:", error);
    throw error;
  }
};
