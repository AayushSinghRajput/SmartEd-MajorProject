"use client";

import React from "react";

/**
 * TypingDots Component
 * Shows 3 animated dots for "bot is typing..." effect
 */
export default function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
        </div>
      </div>
    </div>
  );
}
