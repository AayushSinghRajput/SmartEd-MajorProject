"use client"; // Client-side Next.js component

import { motion } from "framer-motion"; // For animation effects
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa"; // Social media icons
import Company_Logo from "../assets/images/Company_Logo.png"; // Company logo image
import Image from "next/image"; // Next.js optimized Image component

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white py-12 mt-0">
      
      {/* Background decorative radial gradient with low opacity */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white,transparent)]"></div>

      {/* Main content container */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} // Animate in from below
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-3">
              {/* Logo image */}
              <div className="relative h-10 w-10 rounded-lg overflow-hidden shadow bg-white p-1.5">
                <Image src={Company_Logo} alt="SmartED Logo" fill className="object-contain" />
              </div>
              <h2 className="text-2xl font-bold">SmartPrep AI</h2>
            </div>
            <p className="text-gray-200">
              Personalized AI-powered learning platform for +2 Science students.
              Learn smarter, revise faster, and succeed with SmartPrep AI.
            </p>
          </motion.div>

          {/* Quick Links section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "Dashboard", "About", "Contact"].map((link, i) => (
                <li key={i}>
                  <a
                    href={link === "Home" ? "/" : `/${link.toLowerCase()}`} // Dynamic routing for pages
                    className="hover:text-yellow-300 transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/dashboard" className="hover:text-yellow-300 transition">Entrance Prep</a></li>
              <li><a href="/dashboard" className="hover:text-yellow-300 transition">Study Materials</a></li>
              <li><a href="/dashboard" className="hover:text-yellow-300 transition">AI Quiz Generator</a></li>
              <li><a href="/community" className="hover:text-yellow-300 transition">Student Community</a></li>
            </ul>
          </motion.div>

          {/* Social Media section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="hover:text-yellow-300 transition"><FaFacebook /></a>
              <a href="#" className="hover:text-yellow-300 transition"><FaInstagram /></a>
              <a href="#" className="hover:text-yellow-300 transition"><FaTwitter /></a>
              <a href="#" className="hover:text-yellow-300 transition"><FaLinkedin /></a>
            </div>
          </motion.div>
        </div>

        {/* Bottom copyright bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 border-t border-gray-600 pt-6 text-center text-sm text-gray-300"
        >
          © {new Date().getFullYear()} SmartPrep AI. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}