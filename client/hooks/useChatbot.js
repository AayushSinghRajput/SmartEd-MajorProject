"use client";

import { useState } from "react";
import { sendChatMessage } from "../api/chat";
import { useAuth } from "../context/AuthContext";

/**
 * useChatbot Hook
 *
 * Responsibilities:
 * 1. Validate required context (auth + selected subtopic)
 * 2. Send correctly-shaped payload to backend
 * 3. Log everything needed to debug 422 / backend failures
 * 4. Normalize response → UI MUST ONLY RENDER STRINGS
 */
export function useChatbot({ metaData, selectedSubtopic }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  /**
   * Ask chatbot a question
   */
  const askChatbot = async (userMessage) => {
    // 🛑 Hard guards (fail early, fail loud)
    if (!user) {
      console.error("[useChatbot] User not authenticated");
      throw new Error("User not authenticated");
    }

    if (!selectedSubtopic) {
      console.error("[useChatbot] No subtopic selected");
      throw new Error("No subtopic selected for chat");
    }

    if (!userMessage?.trim()) {
      console.warn("[useChatbot] Empty message ignored");
      return { text: "" };
    }

    const userId = user?.id ?? user?._id;

    if (!userId) {
      console.error("[useChatbot] Missing user id:", user);
      throw new Error("User not authenticated");
    }

    // 🧾 Payload MUST match FastAPI schema exactly
    const payload = {
      user_id: userId,
      pdf_hash: metaData?.fileHash,
      day: selectedSubtopic.currentDay,
      topic: selectedSubtopic.topicIdx,
      subtopic: selectedSubtopic.subtopicIdx,
      message: userMessage.trim(),
    };

    console.group("[useChatbot] Chat request");
    console.log("Payload →", payload);
    console.groupEnd();

    setLoading(true);

    try {
      const response = await sendChatMessage(payload);

      console.group("[useChatbot] Chat response");
      console.log("Raw response →", response);
      console.groupEnd();

      /**
       * 🔐 NORMALIZATION LAYER
       * React UI must NEVER receive objects or undefined
       */
      if (typeof response === "string") {
        return { text: response };
      }

      if (!response || typeof response !== "object") {
        console.warn("[useChatbot] Invalid response format:", response);
        return { text: "⚠️ Invalid response from chatbot." };
      }

      return {
        text:
          typeof response.content === "string"
            ? response.content
            : "⚠️ Empty response from chatbot.",

        // Optional metadata (safe to ignore in UI)
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
      // 🔥 422 & backend error decoding
      if (error?.response) {
        console.group("[useChatbot] Backend error");
        console.error("Status →", error.response.status);
        console.error("Data →", error.response.data);
        console.groupEnd();
      } else {
        console.error("[useChatbot] Network / JS error →", error);
      }

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
