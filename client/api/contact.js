// Base URL for API requests. Uses environment variable if defined,
// otherwise defaults to local development server.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Auth headers helper
// ---------------------------
// Returns headers object for fetch requests.
// For cookie-based authentication, Authorization header is not needed.
// If not sending multipart/form-data, sets "Content-Type" to "application/json".
const getAuthHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) headers["Content-Type"] = "application/json"; // JSON payload
  return headers;
};

// ---------------------------
// Handle fetch responses
// ---------------------------
// Centralized function to parse JSON response and handle errors.
// Rejects the promise if the response is not OK (status >= 400).
const handleResponse = async (response) => {
  try {
    const data = await response.json(); // Parse response body as JSON
    if (!response.ok) {
      // Extract error message from response or fallback to status text
      const error = (data && data.detail) || response.statusText || "Request failed";
      return Promise.reject(error);
    }
    return data; // Return parsed data if successful
  } catch (err) {
    // Handles cases where response is not JSON or other fetch errors
    console.error("Fetch response error:", err);
    throw err;
  }
};

// ---------------------------
// Contact API
// ---------------------------
// submitContactForm sends the user-submitted contact form to the backend.
// contactData: object containing { name, email, message, etc. }
// Returns the backend response if successful, otherwise throws an error.
export const submitContactForm = async (contactData) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: getAuthHeaders(),   // JSON payload
      credentials: "include",      // sends HttpOnly cookie if user is logged in
      body: JSON.stringify(contactData), // convert JS object to JSON
    });

    // Parse and handle response; throws if status is not OK
    return await handleResponse(response);
  } catch (error) {
    console.error("Contact form submission error:", error);
    throw error;
  }
};