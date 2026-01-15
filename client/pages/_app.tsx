import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { AuthProvider } from "@/context/AuthContext";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

function AppLayout({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const noNavbarRoutes = ["/login", "/signup"];
  const showNavbar = !noNavbarRoutes.includes(router.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50">
      {showNavbar && <Navbar />}

      {/* MAIN CONTENT BETWEEN NAVBAR & FOOTER */}
      <main className="flex-1 w-full">
        <Component {...pageProps} />
      </main>

      {showNavbar && <Footer />}
    </div>
  );
}

export default function MyApp(props: AppProps) {
  return (
    <AuthProvider>
      <AppLayout {...props} />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
