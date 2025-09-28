"use client"

import type React from "react"

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="text-center py-8">
      <p className="text-red-500 text-lg outfit font-medium">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-white text-black rounded-[8px] outfit font-medium hover:bg-gray-200 transition-colors"
        aria-label="Clear filters and retry"
      >
        Clear Filters & Retry
      </button>
    </div>
  )
}
