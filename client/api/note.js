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
      const error =
        (data && data.detail) || response.statusText || "Request failed";
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    console.error("Fetch response error:", error);
    throw error;
  }
};

// ---------------------------
// Summarize Day Notes API
// ---------------------------
export const summarizeDayNotes = async ({ book_id, day_number }) => {
  try {
    console.log("Fetching notes for book:", book_id, "day:", day_number);
    const response = await fetch(`${API_URL}/notes/summarize`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        book_id,
        day_number,
        note_type: "short", // 🔒 enforced here
      }),
    });
    console.log("Response status:", response.status);
    const data = await handleResponse(response);
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("Error summarizing day notes:", error);
    throw error;
  }
};
