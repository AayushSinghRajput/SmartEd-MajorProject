"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX, FiUser, FiLogOut, FiAward } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Company_Logo from "../../assets/images/Company_Logo.png";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  /* -------------------- Detect Scroll -------------------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* -------------------- Auth Handlers -------------------- */
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
      <nav className="fixed top-0 w-full z-50 bg-white h-16 flex items-center justify-center border-b">
        <div className="animate-spin h-6 w-6 border-b-2 border-indigo-600 rounded-full" />
      </nav>
    );
  }

  /* -------------------- Nav Links -------------------- */
  const centerLinks = ["/", "/about", "/contact"];
  if (user) centerLinks.push("/community", "/dashboard");

  return (
      <motion.nav
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={`
      fixed top-0 w-full z-50
      bg-white border-b border-indigo-100

      shadow-[0_4px_10px_-3px_rgba(99,102,241,0.12)]

      transition-all duration-300 ease-out

      hover:-translate-y-[1px]
      hover:shadow-[0_8px_18px_-6px_rgba(15,14,14,0.22)]

      ${scrolled ? "shadow-[0_10px_22px_-8px_rgba(15,14,14,0.28)]" : ""}
    `}
  >

    
      <div className="max-w-7xl mx-auto pl-0 pr-6">
        {/* ======================= DESKTOP ======================= */}
        <div className="hidden md:grid grid-cols-[auto_1fr_auto] items-center h-16">
          
          {/* LOGO */}
          <motion.div  className="flex items-center gap-2">
            <div className="relative h-10 w-10 rounded-lg overflow-hidden shadow bg-white p-1.5">
              <Image src={Company_Logo} alt="SmartED Logo" fill className="object-contain" />
            </div>
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              SmartPrep AI
            </Link>
          </motion.div>

          {/* CENTER LINKS */}
          <div className="flex justify-center gap-2">
            {centerLinks.map((link) => {
              const label =
                link === "/" ? "Home" :
                link === "/dashboard" ? "Dashboard" :
                link === "/community" ? "Community" :
                link.charAt(1).toUpperCase() + link.slice(2);

              return (
                <Link
                  key={link}
                  href={link}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium

                    transition-all duration-200 ease-out

                    ${
                      pathname === link
                        ? "text-indigo-700 bg-indigo-50 shadow-[0_2px_6px_-2px_rgba(99,102,241,0.35)]"
                        : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 hover:-translate-y-[1px] hover:shadow-[0_4px_10px_-3px_rgba(99,102,241,0.35)]"
                    }
                  `}
                >
                  {label}
                </Link>

              );
            })}
          </div>

          {/* AUTH BUTTONS */}
        <div className="flex justify-end items-center gap-4">
          {!user ? (
            <>
              <button
                onClick={handleLoginClick}
                className="flex items-center border border-indigo-200 text-indigo-600 px-4 py-2 rounded-full text-sm 
                          shadow-[3px_3px_6.4px_1px_#9E9999] 
                          transition-shadow duration-300 hover:shadow-[5px_5px_8px_2px_rgba(99,102,241,0.45)] 
                          hover:bg-indigo-50"
              >
                <FiUser className="mr-1.5" /> Login
              </button>

              <button
                onClick={handleSignupClick}
                className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm 
                          shadow-[3px_3px_6.4px_1px_#9E9999] 
                          transition-shadow duration-300 hover:shadow-[5px_5px_8px_2px_rgba(139,92,246,0.75)]"
              >
                <FiAward className="mr-1.5" /> Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={handleSignOut}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded-full text-sm 
                        shadow-[3px_3px_6.4px_1px_#9E9999] 
                        transition-shadow duration-300 hover:shadow-[5px_5px_8px_2px_rgba(139,92,246,0.75)] 
                        hover:bg-red-700"
            >
              <FiLogOut className="mr-1.5" /> Sign Out
            </button>
          )}
        </div>
        </div>

        {/* ======================= MOBILE HEADER ======================= */}
        <div className="flex md:hidden justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-9 w-9">
              <Image src={Company_Logo} alt="SmartED Logo" fill className="object-contain" />
            </div>
            <span className="font-bold text-indigo-700">SmartPrep AI</span>
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
            className="md:hidden bg-white border-t border-indigo-100 shadow-lg"
          >
            <div className="px-4 pt-3 pb-6 space-y-1">
              {centerLinks.map((link) => (
                <Link
                  key={link}
                  href={link}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-3 rounded-lg text-base text-gray-700 hover:bg-indigo-50"
                >
                  {link === "/" ? "Home" : link.slice(1).toUpperCase()}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
