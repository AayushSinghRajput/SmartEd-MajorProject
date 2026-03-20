// ---------------------------
// Clean text for speech output
// ---------------------------
// Removes markdown, symbols, and formatting to make text suitable for speech (TTS).
// Parameters:
//   - text: string (input text with markdown or formatting)
// Returns:
//   - cleaned plain text string
export const cleanTextForSpeech = (text = "") =>
  text
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks (```...```)
    .replace(/#+\s*/g, "") // Remove markdown headings (e.g., ### Heading)
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold formatting (**text** → text)
    .replace(/\*(.*?)\*/g, "$1") // Remove italic formatting (*text* → text)
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images (![alt](url))
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Convert links ([text](url) → text)
    .replace(/[-_*]{2,}/g, "") // Remove separators (---, ___, ***)
    .replace(/\n+/g, " ") // Replace multiple newlines with a single space
    .replace(/\s+/g, " ") // Remove extra spaces
    .trim(); // Trim leading and trailing spaces

// ---------------------------
// Clean simple text
// ---------------------------
// Removes basic markdown elements for display purposes.
// Parameters:
//   - text: string (input text)
// Returns:
//   - cleaned text string
export const cleanText = (text = "") =>
  text
    .replace(/^#+\s*/g, "") // Remove heading symbols at the start (e.g., # Title)
    .replace(/^-\s*/g, "") // Remove list dash at the start (- item)
    .replace(/\*\*/g, "") // Remove bold markers (**)
    .trim(); // Trim leading and trailing spaces