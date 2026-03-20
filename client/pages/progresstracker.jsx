"use client"; // Client-side React component

// Import React hooks and necessary libraries
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2"; // Doughnut chart component
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; // Chart.js modules
import { Loader2, AlertCircle } from "lucide-react"; // Icons for loading & alerts
import { getUserStudyPlans } from "../lib/api"; // API call to fetch user study plans
import toast from "react-hot-toast"; // Notification library

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// ---------------------------
// Component: ProgressCard
// Renders a single course card with progress visuals
// ---------------------------
function ProgressCard({ course }) {
  const currentProgress = course.progress || 0; // Default to 0 if progress not provided

  // Chart data configuration for the doughnut chart
  const doughnutData = {
    labels: ["Completed", "Remaining"], // Labels for chart segments
    datasets: [
      {
        data: [currentProgress, 100 - currentProgress], // Dynamic progress & remaining
        backgroundColor: ["#6366F1", "#E0E7FF"], // Segment colors
        hoverBackgroundColor: ["#4F46E5", "#F1F5F9"], // Colors on hover
        borderWidth: 0,
        cutout: "80%", // Makes the chart a donut
      },
    ],
  };

  const chartOptions = {
    plugins: {
      tooltip: { enabled: false }, // Disable tooltips for cleaner look
      legend: { display: false }, // Hide legend
    },
    maintainAspectRatio: false, // Allow responsive sizing
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 max-w-md mx-auto mb-6 w-full">
      {/* Header: Course Name, Icon, Category & Duration */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="p-2 bg-indigo-50 rounded-xl text-xl leading-none">
              {course.icon || "📖"} {/* Display course icon or default */}
            </span>
            {course.name} {/* Course name */}
          </h2>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest ml-1">
            {course.category || "Study Plan"} {/* Course category */}
          </p>
        </div>
        <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">
          {course.duration} {/* Duration of the course */}
        </span>
      </div>

      {/* Circular Progress (Doughnut Chart) */}
      <div className="relative w-[180px] h-[180px] mx-auto flex items-center justify-center mb-6">
        <Doughnut key={course.progress} data={doughnutData} options={chartOptions} />
        {/* Centered percentage text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-900 leading-none">
            {course.progress}% {/* Show numeric progress */}
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">
            Finished
          </span>
        </div>
      </div>

      {/* Horizontal Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${course.progress}%` }} // Width reflects progress
        ></div>
      </div>

      {/* Milestones & Status */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Milestones
          </span>
          <span className="text-sm font-bold text-indigo-600">
            {course.lessonsCompleted} / {course.totalLessons} Units {/* Progress in units */}
          </span>
        </div>
        <div className="text-right">
          <span
            className={`text-xs font-black px-2 py-1 rounded-md ${
              course.progress === 100
                ? "bg-emerald-100 text-emerald-700"
                : "bg-indigo-50 text-indigo-700"
            }`}
          >
            {course.progress === 100 ? "COMPLETED" : "IN PROGRESS"} {/* Status badge */}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------
// Component: ProgressTracker
// Fetches user's courses and renders a list of ProgressCards
// ---------------------------
export default function ProgressTracker() {
  const [courseData, setCourseData] = useState([]); // Holds all user courses
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [showAll, setShowAll] = useState(false); // Toggle to show all courses

  // Fetch user study plans from API
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const res = await getUserStudyPlans();
        if (res && res.success && res.data) {
          // Map backend data into frontend-friendly format
          const mappedData = res.data.map((plan) => {
            let total = 0;
            let completed = 0;

            if (plan.schedule) {
              plan.schedule.forEach((day) => {
                day.topics.forEach((topic) => {
                  topic.subtopics.forEach((sub) => {
                    total++;
                    if (sub.completed) completed++; // Count completed units
                  });
                });
              });
            }

            return {
              id: plan._id,
              name: plan.subject || "Untitled Plan",
              category: plan.category || "Academic Plan",
              progress: plan.progress || 0, // Backend-provided progress
              duration: `Day ${plan.schedule?.length || 0}`, // Total days
              lessonsCompleted: completed,
              totalLessons: total,
              icon: "📚",
            };
          });
          setCourseData(mappedData);
        } else {
          setCourseData([]); // No plans found
        }
      } catch (error) {
        toast.error("Failed to load progress metrics"); // Show toast on failure
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchProgress();

    // Refetch progress when user refocuses the tab
    window.addEventListener("focus", fetchProgress);
    return () => window.removeEventListener("focus", fetchProgress);
  }, []);

  // Loading state UI
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">
            Syncing Progress
          </h3>
          <p className="text-slate-400 text-sm">
            Calculating your study metrics...
          </p>
        </div>
      </div>
    );

  // Empty state UI when no courses exist
  if (courseData.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-12 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-6">
          <AlertCircle className="text-slate-300" size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
          No Analytics Available
        </h3>
        <p className="text-slate-500 mt-3 max-w-sm mx-auto leading-relaxed">
          You haven't started any study plans yet. Generate a roadmap from a PDF to track your journey here.
        </p>
      </div>
    );

  // Determine which courses to display (first 3 or all)
  const visibleCourses = showAll ? courseData : courseData.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          Learning Journey
        </h1>
        <p className="text-slate-500 font-medium">
          Visualizing your academic growth across all modules
        </p>
      </div>

      {/* Course cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleCourses.map((course) => (
          <ProgressCard key={course.id} course={course} />
        ))}
      </div>

      {/* Show more / show less button if more than 3 courses */}
      {courseData.length > 3 && (
        <div className="text-center mt-16">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-12 py-4 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-xl font-bold uppercase tracking-[0.2em] text-xs"
          >
            {showAll ? "Show Featured" : `Expand Library (${courseData.length})`}
          </button>
        </div>
      )}
    </div>
  );
}