"use client";

import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import chatbotAnimation from "../animations/chatbot.json";
import PredefinedStudyPlan from "../components/PredefinedStudyPlan";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/ui/Loader";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  const handleGetStarted = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  };

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.5, duration: 0.5 },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, delay: 0.2 },
    },
  };

  return (
    <>
      <section className="flex flex-col md:flex-row items-center max-w-7xl mx-auto px-6 py-20 gap-12">
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
            <br />Upload PDFs to instantly extract notes, master concepts, practice with AI-generated quizzes, and get doubts answered all designed to help you excel in +2 Science and prepare for IOM/IOE entrance exams.
          </motion.p>
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

        <motion.div
          className="md:w-1/2 aspect-square"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <Lottie
            animationData={chatbotAnimation}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
        </motion.div>
      </section>

      <section
        id="topviewbooks"
        className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50"
      >
        <PredefinedStudyPlan />
      </section>
    </>
  );
}
