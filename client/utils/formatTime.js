// ---------------------------
// Format seconds into MM:SS
// ---------------------------
// Converts a total number of seconds into a string formatted as "MM:SS".
// Parameters:
//   - seconds: number (total seconds)
// Returns:
//   - string in "minutes:seconds" format, zero-padded for single digits
export const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60); // calculate whole minutes
  const sec = seconds % 60;             // remaining seconds
  return `${min.toString().padStart(2, "0")}:${sec
    .toString()
    .padStart(2, "0")}`;               // pad single digits with leading zero
};