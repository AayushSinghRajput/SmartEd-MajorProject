// Base URL for the API, taken from environment variable if available,
// otherwise defaults to local development server
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ======================== AUTHENTICATION ROUTES =========================

// Function to log in a user
// Accepts 'credentials' object containing user login info (e.g., email & password)
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST", // Use POST method for sending data securely
    headers: {
      "Content-Type": "application/json", // Specify JSON data format
    },
    credentials: "include", // Include cookies for authentication
    body: JSON.stringify(credentials), // Convert JS object to JSON string
  });
  return response.json(); // Parse and return response as JSON
};

// Function to register a new user
// Accepts 'userData' object containing user registration details
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST", // Use POST to send new user data
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies if any for session handling
    body: JSON.stringify(userData), // Convert JS object to JSON string
  });
  return response.json(); // Return server response as JSON
};

// Function to get the currently logged-in user's data
export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: "GET", // GET request since we are fetching data
    credentials: "include", // Include cookies to identify user session
  });
  return response.json(); // Parse and return user data as JSON
};

// Function to log out the current user
export const logoutUser = async () => {
  // POST request to trigger server-side logout
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include", // Include cookies to end the correct session
  });
};