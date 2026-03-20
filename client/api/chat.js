// Base URL for API requests. Uses environment variable if defined, 
// otherwise defaults to local development server.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ---------------------------
// Helper: Get headers
// ---------------------------
// Returns headers object for fetch requests.
// For cookie-based authentication, Authorization header is not needed.
// If not sending multipart/form-data, sets "Content-Type" to "application/json".
const getAuthHeaders = (isMultipart = false) => {
  const headers = {};
  if (!isMultipart) headers["Content-Type"] = "application/json";
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

    // If response is not successful, extract error message or fallback to status text
    if (!response.ok) {
      const error = (data && data.detail) || response.statusText || "Request failed";
      return Promise.reject(error);
    }

    return data; // Return parsed data if successful
  } catch (error) {
    // Handle cases where response is not JSON or other fetch errors
    throw error;
  }
};

// ---------------------------
// Send chat message to AI backend
// ---------------------------
// payload: { message: string, context?: {...}, etc. }
// Sends a user message to AI backend and receives a response.
export const sendChatMessage = async (payload) => {
  try {
    const response = await fetch(`${API_URL}/chat/aichat`, {
      method: "POST",
      headers: getAuthHeaders(false), // JSON payload
      credentials: "include",         // sends cookies for authentication
      body: JSON.stringify(payload),  // convert JS object to JSON
    });

    const data = await handleResponse(response); // parse and handle errors
    return data.response; // backend returns { response: {...} }
  } catch (error) {
    throw error;
  }
};

// ---------------------------
// Send voice chat (audio -> text -> chatbot)
// ---------------------------
// Accepts audio file and optional metadata, sends to backend for voice processing.
// payload: { audioFile: File/Blob, user_id, pdf_hash, day?, topic?, subtopic? }
export const sendVoiceChatMessage = async ({
  audioFile,
  user_id,
  pdf_hash,
  day = null,
  topic = null,
  subtopic = null,
}) => {
  const formData = new FormData();           // Use FormData for file upload
  formData.append("audio", audioFile);       // attach audio file
  formData.append("user_id", user_id);       // attach user identifier
  formData.append("pdf_hash", pdf_hash);     // attach relevant PDF reference

  // Optional metadata for context
  if (day !== null) formData.append("day", day);
  if (topic !== null) formData.append("topic", topic);
  if (subtopic !== null) formData.append("subtopic", subtopic);

  try {
    const response = await fetch(`${API_URL}/voice/chat`, {
      method: "POST",
      headers: getAuthHeaders(true), // multipart → do NOT set Content-Type manually
      credentials: "include",        // include cookies for authentication
      body: formData,                // attach FormData payload
    });

    const data = await handleResponse(response); // parse and handle errors
    /*
      Expected backend response structure:
      {
        input_text: "...",   // text transcribed from audio
        response: "...",     // AI response
        mode: "voice"        // indicates voice processing mode
      }
    */
    return data;
  } catch (error) {
    throw error;
  }
};