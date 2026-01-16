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
// Generate content API
// ---------------------------
export const generateContent = async ({
  book_id,
  day_number,
  topic_index,
  subtopic_index,
}) => {
  const url = `${API_URL}/content/generate`;

  const payload = {
    book_id,
    day_number,
    topic_index,
    subtopic_index,
  };

  console.log("Payload:", payload);


  try {
    const response = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(), 
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await handleResponse(response); 
    console.log("Content Response:", data);
    return data; // Returns the ContentResponse object
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
