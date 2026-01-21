const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get headers (skip Content-Type for multipart requests)
// ---------------------------
const getAuthHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) headers["Content-Type"] = "application/json";
  return headers;
};

// ---------------------------
// Handle fetch responses and errors
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
    console.error("[handleResponse] Error parsing response:", error);
    throw error;
  }
};

// ---------------------------
// Summarize notes for a day
// ---------------------------
export const summarizeDayNotes = async ({ book_id, day_number }) => {
  try {
    console.log("[summarizeDayNotes] Fetching notes for book:", book_id, "day:", day_number);

    const response = await fetch(`${API_URL}/notes/summarize`, {
      method: "POST",
      headers: getAuthHeaders(), // JSON headers
      credentials: "include",    // send HttpOnly cookie
      body: JSON.stringify({
        book_id,
        day_number,
        note_type: "short", // enforced short notes
      }),
    });

    console.log("[summarizeDayNotes] Response status:", response.status);
    const data = await handleResponse(response);

    console.log("[summarizeDayNotes] Response data:", data);
    return data;

  } catch (error) {
    console.error("[summarizeDayNotes] Error:", error);
    throw error;
  }
};
