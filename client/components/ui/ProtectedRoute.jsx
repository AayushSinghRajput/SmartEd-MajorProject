"use client"; // This is a client-side component (Next.js convention)

import { useEffect } from "react";
import { useRouter } from "next/router"; // Next.js router for navigation
import { useAuth } from "@/context/AuthContext"; // Custom hook to get auth info

// ProtectedRoute component ensures only authenticated users can view its children
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth(); // Get current user and loading state from auth context
  const router = useRouter(); // Router instance for redirects

  // Redirect unauthenticated users to the home page once loading is done
  useEffect(() => {
    if (!loading && !user) {
      router.push("/"); // Navigate home if user is not authenticated
    }
  }, [user, loading, router]);

  // Show a loading spinner while authentication status is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> {/* Spinner */}
      </div>
    );
  }

  // If user is still not authenticated after loading, render nothing
  if (!user) {
    return null;
  }

  // If user is authenticated, render the child components
  return <>{children}</>;
}