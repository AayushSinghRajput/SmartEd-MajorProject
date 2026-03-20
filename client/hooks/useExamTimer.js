import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * useExamTimer Hook
 *
 * Manages a countdown timer for exams or tests.
 *
 * @param {boolean} isRunning - Whether the timer should be active
 * @param {Function} onTimeOver - Callback when timer reaches 0
 * @param {number} initialDuration - Initial time in seconds
 *
 * @returns {Object} { timeLeft, resetTimer }
 *   - timeLeft: seconds remaining
 *   - resetTimer: function to reset timer to initialDuration
 */
export const useExamTimer = (isRunning, onTimeOver, initialDuration) => {
  const [timeLeft, setTimeLeft] = useState(initialDuration);

  // Reset timer whenever initial duration changes or timer stops
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(initialDuration);
    }
  }, [initialDuration, isRunning]);

  // Main countdown effect
  useEffect(() => {
    if (!isRunning) return; // don't start timer if not running

    // If time runs out, notify user and call callback
    if (timeLeft === 0) {
      toast.error("⏰ Time Over! Test auto-submitted.");
      onTimeOver();
      return;
    }

    // Decrease timer every second
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // Cleanup interval on unmount or dependencies change
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onTimeOver]);

  // Function to manually reset timer
  const resetTimer = () => setTimeLeft(initialDuration);

  return { timeLeft, resetTimer };
};