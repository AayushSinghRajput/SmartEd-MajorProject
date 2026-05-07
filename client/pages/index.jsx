"use client"; // Indicates this is a client-side React component

// Import necessary hooks and libraries
import { useRouter } from "next/navigation"; // Next.js router for navigation
import Lottie from "lottie-react"; // For playing animations
import { motion } from "framer-motion"; // For animations of elements
import chatbotAnimation from "../animations/chatbot.json"; // Lottie animation JSON
import PredefinedStudyPlan from "../components/predefined_plan/PredefinedStudyPlan"; // Component showing sample study plans
import { useAuth } from "../context/AuthContext"; // Custom hook for user authentication state
import Loader from "../components/ui/Loader"; // Loader component for loading state

// Main Home page component
export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth(); // Get user and loading status from auth context

  // Show loader while authentication status is loading
  if (loading) return <Loader />;

  // Function to handle "Get Started" button click
  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard"); // Navigate logged-in users to dashboard
    } else {
      router.push("/signup"); // Navigate non-logged-in users to signup page
    }
  };

  // Animation variants for Framer Motion
  const textVariants = {
    hidden: { opacity: 0, x: -50 }, // Initial hidden state
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 }, // Animate to visible state
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 }, // Initial button hidden
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.5, duration: 0.5 }, // Animate in after delay
    },
    hover: {
      scale: 1.05, // Slight grow on hover
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 }, // Slight shrink on tap
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 }, // Initial hidden state for image
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, delay: 0.2 }, // Animate to visible with slight delay
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center max-w-7xl mx-auto px-6 py-20 gap-12">
        {/* Left Column: Text and Button */}
        <motion.div
          className="md:w-1/2"
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          <motion.h2
            className="text-4xl font-bold mb-6"
            variants={textVariants}
          >
            Welcome to SmartPrep AI
          </motion.h2>

          <motion.p
            className="text-lg text-gray-700 leading-relaxed mb-6"
            variants={textVariants}
            transition={{ delay: 0.2 }}
          >
            SmartPrep AI empowers students to study smarter, not harder. 
            <br />
            Upload PDFs to instantly extract notes, master concepts, practice with AI-generated quizzes, 
            and get doubts answered—all designed to help you excel in +2 Science and prepare for IOM/IOE entrance exams.
          </motion.p>

          {/* Get Started Button */}
          <motion.button
            onClick={handleGetStarted}
            className="
              mt-8
              bg-indigo-600 text-white
              px-12 py-3 rounded-full
              text-lg font-semibold
              shadow-[3px_3px_6.4px_1px_#9E9999]
              transition-shadow duration-300
              hover:shadow-[5px_5px_8px_2px_rgba(139,92,246,0.75)]
            "
            variants={buttonVariants}
            whileTap="tap"
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Right Column: Lottie Animation */}
        <motion.div
          className="md:w-1/2 aspect-square"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <Lottie
            animationData={chatbotAnimation} // Display chatbot animation
            loop={true} // Loop animation continuously
            style={{ width: "100%", height: "100%" }}
          />
        </motion.div>
      </section>

      {/* Section: Predefined Study Plans */}
      <section
        id="topviewbooks"
        className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50"
      >
        <PredefinedStudyPlan /> {/* Shows sample study plans for users to explore */}
      </section>
    </>
  );
}