import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useExamTimer = (isRunning, onTimeOver, initialDuration) => {
  const [timeLeft, setTimeLeft] = useState(initialDuration);

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(initialDuration);
    }
  }, [initialDuration, isRunning]);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft === 0) {
      toast.error("⏰ Time Over! Test auto-submitted.");
      onTimeOver();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onTimeOver]);

  const resetTimer = () => setTimeLeft(initialDuration);

  return { timeLeft, resetTimer };
};
