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
    console.error("[handleResponse] Error parsing response:", error);
    throw error;
  }
};

// ---------------------------
// Upload PDF and generate schedule
// ---------------------------
export const uploadPdfAndGenerateSchedule = async (file, days, bookName) => {
  if (!file) return { success: false, message: "No file provided" };

  const formData = new FormData();
  formData.append("file", file);
  formData.append("book_name", bookName);

  const queryParams = new URLSearchParams({ days });

  try {
    const response = await fetch(`${API_URL}/study/upload-and-schedule?${queryParams}`, {
      method: "POST",
      headers: getAuthHeaders(true), // skip JSON Content-Type for FormData
      body: formData,
      credentials: "include",       // send HttpOnly cookie
    });
    const data = await handleResponse(response);
    return { success: true, ...data };
  } catch (error) {
    console.error("[uploadPdfAndGenerateSchedule] Error:", error);
    return { success: false, message: error || "Failed to upload PDF" };
  }
};

// ---------------------------
// Get all books for current user
// ---------------------------
export const getUserBooks = async () => {
  try {
    const response = await fetch(`${API_URL}/study/my-books`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    const data = await handleResponse(response);
    return { success: true, ...data };
  } catch (error) {
    console.error("[getUserBooks] Error:", error);
    return { success: false, message: error || "Failed to fetch user books" };
  }
};

// ---------------------------
// Update book image
// ---------------------------
export const updateBookImage = async (pdf_hash, file) => {
  if (!file) return { success: false, message: "No image file provided" };

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`${API_URL}/study/update-image?pdf_hash=${pdf_hash}`, {
      method: "PATCH",
      headers: getAuthHeaders(true),
      body: formData,
      credentials: "include",
    });
    const data = await handleResponse(response);
    return { success: true, ...data };
  } catch (error) {
    console.error("[updateBookImage] Error:", error);
    return { success: false, message: error || "Failed to update book image" };
  }
};

// ---------------------------
// Get book schedule by pdf_hash
// ---------------------------
export const getBookSchedule = async (pdf_hash, days) => {
  if (!pdf_hash) return { success: false, message: "PDF hash is required" };

  const queryParams = new URLSearchParams();
  if (days) queryParams.append("days", days);

  const url = `${API_URL}/study/book-schedule/${pdf_hash}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    const data = await handleResponse(response);
    return { success: true, ...data };
  } catch (error) {
    console.error("[getBookSchedule] Error:", error);
    return { success: false, message: error || "Failed to fetch book schedule" };
  }
};
