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


// ---------------------------
// Submit MCQ Score
// ---------------------------
export const submitMCQScore = async ({
  pdfHash,
  day,
  score,
  totalQuestions,
}) => {
  const response = await fetch(
    `${API_URL}/performance/submit-mcq`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        pdf_hash: pdfHash, //  MATCHES BACKEND
        day,
        score,
        total_questions: totalQuestions,
      }),
    }
  );

  return handleResponse(response);
};
