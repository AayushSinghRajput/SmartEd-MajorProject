// Remove markdown and symbols for clean speech
export const cleanTextForSpeech = (text = "") =>
  text
    .replace(/```[\s\S]*?```/g, "") // remove code blocks
    .replace(/#+\s*/g, "") // remove headings ###
    .replace(/\*\*(.*?)\*\*/g, "$1") // bold
    .replace(/\*(.*?)\*/g, "$1") // italic
    .replace(/!\[.*?\]\(.*?\)/g, "") // images
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links
    .replace(/[-_*]{2,}/g, "") // separators
    .replace(/\n+/g, " ") // new lines → space
    .replace(/\s+/g, " ") // extra spaces
    .trim();


export const cleanText = (text = "") =>
    text
      .replace(/^#+\s*/g, "")
      .replace(/^-\s*/g, "")
      .replace(/\*\*/g, "")
      .trim();