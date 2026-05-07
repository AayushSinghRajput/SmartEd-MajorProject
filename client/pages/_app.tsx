import type { AppProps } from "next/app";
import { useRouter } from "next/router"; // Hook to get current route
import Navbar from "../components/layout/Navbar"; // Custom Navbar component
import Footer from "../components/layout/Footer"; // Custom Footer component
import { AuthProvider } from "@/context/AuthContext"; // Context provider for authentication
import "../styles/globals.css"; // Global Tailwind / CSS styles
import { Toaster } from "react-hot-toast"; // Toast notification library

/**
 * AppLayout Component
 * Wraps every page with Navbar, Footer, and styling
 */
function AppLayout({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Define routes where we DO NOT want to show the navbar/footer
  const noNavbarRoutes = ["/login", "/signup"];
  const showNavbar = !noNavbarRoutes.includes(router.pathname); // Boolean flag

  return (
    // Main layout container
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Render Navbar only on allowed routes */}
      {showNavbar && <Navbar />}

      {/* Main content area between navbar and footer */}
      <main className="flex-1 w-full">
        {/* Render the current page/component */}
        <Component {...pageProps} />
      </main>

      {/* Render Footer only on allowed routes */}
      {showNavbar && <Footer />}
    </div>
  );
}

/**
 * MyApp Component
 * The root component of Next.js that wraps all pages
 */
export default function MyApp(props: AppProps) {
  return (
    // AuthProvider gives access to authentication context for all pages
    <AuthProvider>
      {/* AppLayout provides consistent layout with navbar/footer */}
      <AppLayout {...props} />

      {/* Toast notifications will appear on the top-right corner */}
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
