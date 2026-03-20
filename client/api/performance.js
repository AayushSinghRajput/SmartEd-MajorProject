// Base URL for API requests. Uses environment variable if available,
// otherwise defaults to local development server.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get headers
// ---------------------------
// Returns headers object for fetch requests.
// If the request is not multipart (FormData), sets "Content-Type" to "application/json".
const getAuthHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) headers["Content-Type"] = "application/json";
  return headers;
};

// ---------------------------
// Handle fetch responses
// ---------------------------
// Parses response as JSON and handles errors centrally.
// Rejects the promise if response status is not OK (>= 400).
const handleResponse = async (response) => {
  try {
    const data = await response.json(); // Convert response body to JSON

    if (!response.ok) {
      // Extract error message from response or fallback to status text
      const error =
        (data && data.detail) || response.statusText || "Request failed";
      return Promise.reject(error);
    }

    return data; // Return parsed data if successful
  } catch (error) {
    // Handles invalid JSON or parsing errors
    throw error;
  }
};

// ---------------------------
// Fetch performance for PDF
// ---------------------------
// Retrieves performance data for a specific PDF.
// Parameters:
//   - pdfHash: string (unique identifier of the PDF)
// Returns performance data or null if request fails.
export const fetchPerformance = async (pdfHash) => {
  try {
    const response = await fetch(`${API_URL}/performance/get?pdf_hash=${pdfHash}`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include", // send cookies for authentication
    });

    return await handleResponse(response);
  } catch (error) {
    return null; // return null if request fails
  }
};

// ---------------------------
// Submit MCQ Score
// ---------------------------
// Sends the user's MCQ test results to the backend.
// Parameters:
//   - pdfHash: string (PDF identifier)
//   - day: number (day of the test)
//   - score: number (user's score)
//   - totalQuestions: number (total number of questions)
// Returns backend response data.
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
      credentials: "include", // send cookies for authentication
      body: JSON.stringify({
        pdf_hash: pdfHash,        // matches backend field name
        day,
        score,
        total_questions: totalQuestions,
      }),
    });

    const data = await handleResponse(response);
    return data; // return response data
  } catch (error) {
    throw error;
  }
};