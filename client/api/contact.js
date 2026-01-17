const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";


//helper to get the token from localstorage
const getAuthHeaders = (isMultipart = false) => {
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

//helper to handle fetch responses and errors
const handleResponse = async (response) => {
  try {
    const data = await response.json();
    // If the server returns a status outside 200-299
    if (!response.ok) {
      const error = (data && data.error) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};


//contact route
export const submitContactForm = async (contactData) => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(contactData),
    });
    const data = await handleResponse(response);
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong.");
    }
    return data;
  } catch (error) {
    console.error("Contact form submission error:", error);
    throw error;
  }
};