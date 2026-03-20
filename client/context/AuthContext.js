"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser, getCurrentUser, logoutUser } from "../api/auth";

// ---------------------------
// Auth context
// ---------------------------
// Holds authentication state and functions for login, register, and logout.
const AuthContext = createContext({
  user: null,            // current logged-in user object
  loading: true,         // whether auth state is being initialized
  login: async () => {}, // login function
  register: async () => {}, // registration function
  logout: async () => {}, // logout function
});

// Custom hook to access AuthContext easily
export const useAuth = () => useContext(AuthContext);

// ---------------------------
// Auth provider component
// ---------------------------
// Wrap your app/components with this provider to access auth state/functions
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // store current user
  const [loading, setLoading] = useState(true); // tracks if auth check is in progress
  const router = useRouter();

  // On mount, check if user is logged in (cookie-based auth)
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  // ---------------------------
  // Check current user
  // ---------------------------
  const checkUserLoggedIn = async () => {
    try {
      // getCurrentUser uses cookie automatically (HttpOnly)
      const data = await getCurrentUser();
      setUser(data.success ? data.user : null);
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
    } finally {
      setLoading(false); // auth check finished
    }
  };

  // ---------------------------
  // Login
  // ---------------------------
  // credentials: { email, password }
  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      if (data.success) {
        setUser(data.user);     // update context
        router.push("/dashboard"); // redirect after login
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  // ---------------------------
  // Register
  // ---------------------------
  // userData: { name, email, password }
  const register = async (userData) => {
    try {
      const data = await registerUser(userData);
      if (data.success) {
        setUser(data.user);       // update context
        router.push("/dashboard"); // redirect after registration
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: "Registration failed. Please try again." };
    }
  };

  // ---------------------------
  // Logout
  // ---------------------------
  // Backend deletes auth cookie, then clears user from context
  const logout = async () => {
    try {
      await logoutUser(); // backend clears cookie
      setUser(null);      // remove user from state
      router.push("/login"); // redirect to login page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Provide auth state and functions to child components
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};