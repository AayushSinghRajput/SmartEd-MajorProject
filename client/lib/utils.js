// ---------------------------
// Format an academic/student ID
// ---------------------------
// Example output: 2026-SCI-ABC123
// Parameters:
// - id: the unique database ID for the student
// - createdAt: optional creation date to get the year
export const formatAcademicId = (id, createdAt) => {
  if (!id) return "STUDENT-ID"; // fallback if no ID provided

  // Get year from creation date or use current year
  const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();

  const facultyCode = "SCI"; // fixed faculty code
  const serial = id.substring(id.length - 6).toUpperCase(); // last 6 chars of ID, uppercase

  return `${year}-${facultyCode}-${serial}`; // formatted ID
};

// ---------------------------
// Get a clean display name for a user
// ---------------------------
// - Trims whitespace from username if present
// - Falls back to "Student" or "User" if data is missing
export const getCleanUsername = (user) => {
  if (!user) return "User";
  if (user.username) return user.username.trim();
  return "Student";
};