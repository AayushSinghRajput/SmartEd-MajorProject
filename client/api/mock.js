const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";



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

export const getMockTest = async (mock_type) => {
  const response = await fetch(`${API_URL}/exams/${mock_type}`, {
    method: "GET",
    credentials: "include", 
  });
  return handleResponse(response);
};
