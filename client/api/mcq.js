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
// Generate MCQs API
// ---------------------------
export const generateMCQs = async (payload) => {
  try {
    // 1️⃣ Make the POST request to your backend
    const response = await fetch(`${API_URL}/mcq/generate`, {
      method: "POST",
      headers: getAuthHeaders(), // includes auth + JSON content type
      credentials: "include",
      body: JSON.stringify(payload),
    });

    // 2️⃣ Handle and return response data
    const data = await handleResponse(response);
    console.log("MCQs Response:", data.mcqs);  
    return data.mcqs; // only return the MCQs array

  } catch (error) {
    console.error("Error generating MCQs:", error);
    throw error;
  }
};
