const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get headers
// ---------------------------
const getAuthHeaders = (isMultipart = false) => {
  const headers = {};
  // For JSON requests, set Content-Type; skip for multipart
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
      const error =
        (data && data.detail) || response.statusText || "Request failed";
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    console.error("[handleResponse] Error:", error);
    throw error;
  }
};

// ---------------------------
// Fetch performance for PDF
// ---------------------------
export const fetchPerformance = async (pdfHash) => {
  try {
    const response = await fetch(`${API_URL}/performance/get?pdf_hash=${pdfHash}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("[fetchPerformance] Error:", error);
    return null;
  }
};

// ---------------------------
// Submit MCQ Score
// ---------------------------
export const submitMCQScore = async ({
  pdfHash,
  day,
  score,
  totalQuestions,
}) => {
  try {
    const response = await fetch(`${API_URL}/performance/submit-mcq`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include", // ensures HttpOnly cookie is sent
      body: JSON.stringify({
        pdf_hash: pdfHash, // matches backend field
        day,
        score,
        total_questions: totalQuestions,
      }),
    });

    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error("[submitMCQScore] Error:", error);
    throw error;
  }
};
