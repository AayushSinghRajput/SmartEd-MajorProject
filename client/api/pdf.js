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
      const error = (data && data.detail) || response.statusText || "Request failed";
      return Promise.reject(error);
    }

    return data; // Return parsed data if successful
  } catch (error) {
    // Handles invalid JSON or parsing errors
    throw error;
  }
};

// ---------------------------
// Upload PDF and generate schedule
// ---------------------------
// Uploads a PDF file and generates a study schedule.
// Parameters:
//   - file: File object (PDF file)
//   - days: number (number of days for schedule)
//   - bookName: string (name of the book)
// Returns success status and backend response data.
export const uploadPdfAndGenerateSchedule = async (file, days, bookName) => {
  if (!file) return { success: false, message: "No file provided" };

  const formData = new FormData();
  formData.append("file", file);           // attach PDF file
  formData.append("book_name", bookName);  // attach book name

  const queryParams = new URLSearchParams({ days }); // query parameter for days

  try {
    const response = await fetch(`${API_URL}/study/upload-and-schedule?${queryParams}`, {
      method: "POST",
      headers: getAuthHeaders(true), // multipart → do not set Content-Type manually
      body: formData,
      credentials: "include",       // send cookies for authentication
    });

    const data = await handleResponse(response);
    return { success: true, ...data };
  } catch (error) {
    return { success: false, message: error || "Failed to upload PDF" };
  }
};

// ---------------------------
// Get all books for current user
// ---------------------------
// Fetches all uploaded books for the logged-in user.
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
    return { success: false, message: error || "Failed to fetch user books" };
  }
};

// ---------------------------
// Update book image
// ---------------------------
// Updates the cover image of a book.
// Parameters:
//   - pdf_hash: string (unique identifier of the book)
//   - file: File object (image file)
export const updateBookImage = async (pdf_hash, file) => {
  if (!file) return { success: false, message: "No image file provided" };

  const formData = new FormData();
  formData.append("image", file); // attach image file

  try {
    const response = await fetch(`${API_URL}/study/update-image?pdf_hash=${pdf_hash}`, {
      method: "PATCH",
      headers: getAuthHeaders(true), // multipart request
      body: formData,
      credentials: "include",
    });

    const data = await handleResponse(response);
    return { success: true, ...data };
  } catch (error) {
    return { success: false, message: error || "Failed to update book image" };
  }
};

// ---------------------------
// Get book schedule by pdf_hash
// ---------------------------
// Fetches the study schedule for a specific book.
// Parameters:
//   - pdf_hash: string (required)
//   - days: optional number to filter schedule
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
    return { success: false, message: error || "Failed to fetch book schedule" };
  }
};

// ---------------------------
// Delete PDF and all related data
// ---------------------------
// Deletes a PDF and all associated data from the backend.
// Parameters:
//   - pdfHash: string (unique identifier of the PDF)
export const deletePdfAndData = async (pdfHash) => {
  try {
    const response = await fetch(`${API_URL}/study/delete-pdf/${pdfHash}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      credentials: "include", // send cookies for authentication
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};