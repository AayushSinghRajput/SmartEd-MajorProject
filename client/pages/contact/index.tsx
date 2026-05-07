"use client"; // Client-side React component

// -----------------------------
// IMPORTS
// -----------------------------
import { useState } from "react"; // React state hook
import { submitContactForm } from "../../api/contact"; // API function to submit contact form
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa"; // Icons for contact info

// -----------------------------
// COMPONENT: ContactPage
// -----------------------------
export default function ContactPage() {
  // -----------------------------
  // STATE
  // -----------------------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  }); // Stores form inputs
  const [loading, setLoading] = useState(false); // Tracks submission state
  const [showSuccess, setShowSuccess] = useState(false); // Show success message after submission
  const [error, setError] = useState(""); // Tracks submission errors

  // -----------------------------
  // HANDLERS
  // -----------------------------
  
  // Updates state as user types in input fields or textarea
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Show loading state
    setError(""); // Reset previous errors
    try {
      await submitContactForm(formData); // Call backend API
      setShowSuccess(true); // Show success message
      setFormData({ name: "", email: "", message: "" }); // Reset form fields
      setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3s
    } catch (err: any) {
      setError(err.message || "Something went wrong!"); // Show error message
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="min-h-screen px-4 pt-20 pb-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Heading Section */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          We'd love to hear from you
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl">
          Whether you're curious about features, a demo, or anything else —
          we're ready to answer all your questions.
        </p>
      </div>

      {/* Grid: Contact Form & Contact Info */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* ----------------------------- */}
        {/* Contact Form Card */}
        {/* ----------------------------- */}
        <div
          className="relative
                     bg-white/[0.09] backdrop-blur-2xl
                     p-6 sm:p-8 rounded-3xl
                     border border-white/20
                     shadow-[0_30px_80px_rgba(0,0,0,0.65)]
                     before:content-['']
                     before:absolute before:inset-0 before:rounded-3xl
                     before:bg-gradient-to-b
                     before:from-white/20 before:via-transparent before:to-black/35
                     before:pointer-events-none"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">
            Let's Connect
          </h2>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              required
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Email Input */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Message Textarea */}
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Message"
              rows={4}
              required
              className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full
                         bg-blue-500 hover:bg-blue-600
                         text-white font-semibold
                         py-2 px-4 rounded-lg
                         shadow-md shadow-black/30
                         transition-all duration-300 ease-out
                         hover:shadow-lg hover:shadow-black/40
                         hover:-translate-y-0.5
                         active:scale-95
                         focus:outline-none focus:ring-2 focus:ring-blue-400/40"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {/* Success & Error Messages */}
            {showSuccess && (
              <p className="text-green-400 text-sm pt-2">
                Message sent successfully!
              </p>
            )}
            {error && <p className="text-red-400 text-sm pt-2">{error}</p>}
          </form>
        </div>

        {/* ----------------------------- */}
        {/* Contact Information Card */}
        {/* ----------------------------- */}
        <div
          className="relative
                     bg-white/[0.09] backdrop-blur-2xl
                     p-6 sm:p-8 rounded-3xl
                     border border-white/20
                     shadow-[0_30px_80px_rgba(0,0,0,0.65)]
                     before:content-['']
                     before:absolute before:inset-0 before:rounded-3xl
                     before:bg-gradient-to-b
                     before:from-white/20 before:via-transparent before:to-black/35
                     before:pointer-events-none"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">
            Contact Information
          </h2>

          {/* Contact Details */}
          <div className="text-gray-300 space-y-4 text-lg">
            {/* Email */}
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-blue-400 w-5 h-5" />
              Email:{" "}
              <a
                href="mailto:smartprep.ai@gmail.com"
                className="text-blue-400 hover:underline"
              >
                smartprep.ai@gmail.com
              </a>
            </p>

            {/* Phone */}
            <p className="flex items-center gap-2">
              <FaPhone className="text-blue-400 w-5 h-5" />
              Phone:{" "}
              <a
                href="tel:+9779860123456"
                className="text-blue-400 hover:underline"
              >
                +977 9860123456
              </a>
            </p>

            {/* Address */}
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-400 w-5 h-5" />
              Address: Dharan, Nepal
            </p>
          </div>

          {/* Google Map Embed */}
          <div className="mt-6">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0512321654443!2d85.30956277530676!3d27.71101717619325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1909ce8b070e%3A0xd5f3fbd021c684de!2sKathmandu%20Durbar%20Square!5e0!3m2!1sen!2snp!4v1691490193246!5m2!1sen!2snp"
              width="100%"
              height="200"
              allowFullScreen
              loading="lazy"
              className="rounded-lg border-0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}