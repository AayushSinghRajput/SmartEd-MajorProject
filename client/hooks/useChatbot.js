"use client";

import { useState } from "react";
import { sendChatMessage } from "../api/chat";
import { useAuth } from "../context/AuthContext";

/**
 * useChatbot Hook
 *
 * Responsibilities:
 * 1. Ensure user is authenticated and a subtopic is selected
 * 2. Send properly structured payload to backend
 * 3. Normalize backend response so UI always receives a string
 * 4. Maintain loading state for UI feedback
 */
export function useChatbot({ metaData, selectedSubtopic }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  /**
   * Ask the chatbot a question
   * @param {string} userMessage - The user's message to the chatbot
   * @returns {Object} { text: string, meta?: object } - Normalized chatbot response
   */
  const askChatbot = async (userMessage) => {
    // ---------------------------
    // Guard clauses: fail early
    // ---------------------------
    if (!user) throw new Error("User not authenticated");
    if (!selectedSubtopic) throw new Error("No subtopic selected for chat");
    if (!userMessage?.trim()) return { text: "" };

    const userId = user?.id ?? user?._id;
    if (!userId) throw new Error("User not authenticated");

    // ---------------------------
    // Construct payload to match backend schema
    // ---------------------------
    const payload = {
      user_id: userId,
      pdf_hash: metaData?.fileHash,
      day: selectedSubtopic.currentDay,
      topic: selectedSubtopic.topicIdx,
      subtopic: selectedSubtopic.subtopicIdx,
      message: userMessage.trim(),
    };

    setLoading(true);

    try {
      // Send the message to backend AI endpoint
      const response = await sendChatMessage(payload);

      // ---------------------------
      // Normalization layer
      // Always return { text: string } to UI
      // ---------------------------
      if (typeof response === "string") return { text: response };
      if (!response || typeof response !== "object") {
        return { text: "⚠️ Invalid response from chatbot." };
      }

      return {
        text:
          typeof response.content === "string"
            ? response.content
            : "⚠️ Empty response from chatbot.",
        meta: {
          title: response.title ?? null,
          page: response.page ?? null,
          pageRange: response.page_range ?? null,
          currentDay: response.currentDay ?? null,
          topicIdx: response.topicIdx ?? null,
          subtopicIdx: response.subtopicIdx ?? null,
        },
      };
    } catch (error) {
      // Handle backend or network errors
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    askChatbot,
    loading,
  };
}