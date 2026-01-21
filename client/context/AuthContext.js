"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser, getCurrentUser, logoutUser } from "../api/auth";

// ---------------------------
// Auth context
// ---------------------------
const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// ---------------------------
// Auth provider
// ---------------------------
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On mount, check if cookie exists & user is logged in
  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      // No token needed; cookie is sent automatically
      const data = await getCurrentUser();
      setUser(data.success ? data.user : null);
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login: backend sets cookie automatically
  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      if (data.success) {
        setUser(data.user);
        router.push("/dashboard");
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  // Register: backend sets cookie automatically
  const register = async (userData) => {
    try {
      const data = await registerUser(userData);
      if (data.success) {
        setUser(data.user);
        router.push("/dashboard");
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (error) {
      return { success: false, message: "Registration failed. Please try again." };
    }
  };

  // Logout: backend deletes cookie
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
