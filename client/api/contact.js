const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Auth headers helper
// ---------------------------
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
  } catch (err) {
    console.error("Fetch response error:", err);
    throw err;
  }
};

// ---------------------------
// Contact API
// ---------------------------
export const submitContactForm = async (contactData) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include", // sends HttpOnly cookie if logged in
      body: JSON.stringify(contactData),
    });

    // handleResponse will throw if status is not ok
    return await handleResponse(response);
  } catch (error) {
    console.error("Contact form submission error:", error);
    throw error;
  }
};
