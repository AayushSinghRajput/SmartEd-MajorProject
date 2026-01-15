"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiUser, FiLogOut, FiAward } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Company_Logo from "../assets/images/Company_Logo.png";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  /* -------------------- Scroll Effect -------------------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* -------------------- Handlers -------------------- */
  const handleLoginClick = () => {
    router.push("/login");
    setMenuOpen(false);
  };

  const handleSignupClick = () => {
    router.push("/signup");
    setMenuOpen(false);
  };

  const handleSignOut = async () => {
    await logout();
    router.push("/");
    setMenuOpen(false);
  };

  /* -------------------- Loading State -------------------- */
  if (loading) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white h-16 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-b-2 border-indigo-600 rounded-full" />
      </nav>
    );
  }

  /* -------------------- Center Links -------------------- */
  const centerLinks = ["/", "/about", "/contact"];
  if (user) centerLinks.push("/dashboard");

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-indigo-100"
          : "bg-gradient-to-r from-indigo-50 to-purple-50"
      }`}
    >
      <div className="max-w-7xl mx-auto pl-0 pr-6">
        {/* ======================= DESKTOP ======================= */}
        <div className="hidden md:grid grid-cols-[auto_1fr_auto] items-center h-16">
          {/* LEFT: LOGO */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <div className="relative h-10 w-10 rounded-lg overflow-hidden shadow-md bg-white p-1.5">
              <Image
                src={Company_Logo}
                alt="SmartED Logo"
                fill
                className="object-contain"
              />
            </div>
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              SmartED AI
            </Link>
          </motion.div>

          {/* CENTER: NAV LINKS */}
          <div className="flex justify-center gap-2">
            {centerLinks.map((link) => {
              const label =
                link === "/"
                  ? "Home"
                  : link === "/dashboard"
                  ? "Dashboard"
                  : link.charAt(1).toUpperCase() + link.slice(2);

              return (
                <Link
                  key={link}
                  href={link}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    pathname === link
                      ? "text-indigo-700 bg-indigo-50"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* RIGHT: AUTH */}
          <div className="flex justify-end items-center gap-2">
            {!user ? (
              <>
                <button
                  onClick={handleLoginClick}
                  className="flex items-center border border-indigo-200 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-50 transition"
                >
                  <FiUser className="mr-1.5" size={16} />
                  Login
                </button>

                <button
                  onClick={handleSignupClick}
                  className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:shadow-md transition"
                >
                  <FiAward className="mr-1.5" size={16} />
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition"
              >
                <FiLogOut className="mr-1.5" size={16} />
                Sign Out
              </button>
            )}
          </div>
        </div>

        {/* ======================= MOBILE HEADER ======================= */}
        <div className="flex md:hidden justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-9 w-9">
              <Image
                src={Company_Logo}
                alt="SmartED Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-indigo-700">SmartED AI</span>
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-indigo-50"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* ======================= MOBILE MENU ======================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-indigo-100 shadow-xl"
          >
            <div className="px-4 pt-3 pb-6 space-y-1">
              {centerLinks.map((link) => {
                const label =
                  link === "/"
                    ? "Home"
                    : link === "/dashboard"
                    ? "Dashboard"
                    : link.charAt(1).toUpperCase() + link.slice(2);

                return (
                  <Link
                    key={link}
                    href={link}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition"
                  >
                    {label}
                  </Link>
                );
              })}

              {!user ? (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="w-full flex justify-center items-center gap-2 mt-3 border border-indigo-200 text-indigo-600 px-4 py-3 rounded-lg font-medium hover:bg-indigo-50 transition"
                  >
                    <FiUser /> Login
                  </button>

                  <button
                    onClick={handleSignupClick}
                    className="w-full flex justify-center items-center gap-2 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium"
                  >
                    <FiAward /> Sign Up
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="w-full flex justify-center items-center gap-2 mt-3 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  <FiLogOut /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
