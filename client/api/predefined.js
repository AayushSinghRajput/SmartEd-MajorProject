const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Handle fetch responses
// ---------------------------
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    if (!response.ok) {
      const error = (data && data.error) || response.statusText || "Request failed";
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    console.error("[handleResponse] Error:", error);
    throw error;
  }
};

// ---------------------------
// Get predefined study plan
// ---------------------------
export const getGlobalPlan = async (subject) => {
  try {
    const response = await fetch(`${API_URL}/ai/predefined-study-plan/${subject}`, {
      method: "GET",
      credentials: "include", // ensures auth cookie is sent
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("[getGlobalPlan] Error:", error);
    throw error;
  }
};
