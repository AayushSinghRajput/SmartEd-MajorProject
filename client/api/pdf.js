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
// Upload PDF
// ---------------------------
export const uploadPdfAndGenerateSchedule = async (file, days, bookName) => {
  if (!file) return { success: false, message: "No file provided" };

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("book_name", bookName);

    const queryParams = new URLSearchParams({ days });

    const response = await fetch(`${API_URL}/study/upload-and-schedule?${queryParams}`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: formData,
      credentials: "include",
    });

    const data = await handleResponse(response);
    return { success: true, ...data };
  } catch (error) {
    console.error("Upload PDF error:", error);
    return { success: false, message: error || "Failed to upload PDF" };
  }
};

// ---------------------------
// Get user books
// ---------------------------
export const getUserBooks = async () => {
  try {
    const response = await fetch(`${API_URL}/study/my-books`, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });
    const data = await handleResponse(response);
    console.log("User Books Data:", data);
    return { success: true, ...data };
  } catch (error) {
    console.error("Get user books error:", error);
    return { success: false, message: error || "Failed to fetch user books" };
  }
};

// ---------------------------
// Update book image
// ---------------------------
export const updateBookImage = async (pdf_hash, file) => {
  if (!file) return { success: false, message: "No image file provided" };

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_URL}/study/update-image?pdf_hash=${pdf_hash}`, {
      method: "PATCH",
      headers: getAuthHeaders(true),
      body: formData,
      credentials: "include",
    });

    const data = await handleResponse(response);
    return { success: true, ...data };
  } catch (error) {
    console.error("Update book image error:", error);
    return { success: false, message: error || "Failed to update book image" };
  }
};

// ---------------------------
// Get schedule + book metadata by pdf_hash
// ---------------------------
export const getBookSchedule = async (pdf_hash, days) => {
  if (!pdf_hash) return { success: false, message: "PDF hash is required" };

  try {
    const queryParams = new URLSearchParams();
    if (days) queryParams.append("days", days);

    const url = `${API_URL}/study/book-schedule/${pdf_hash}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
      credentials: "include",
    });

    const data = await handleResponse(response);
    return { success: true, ...data };
  } catch (error) {
    console.error("Get book schedule error:", error);
    return { success: false, message: error || "Failed to fetch book schedule" };
  }
};

