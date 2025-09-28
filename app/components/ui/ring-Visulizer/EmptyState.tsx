"use client"

import type React from "react"

interface EmptyStateProps {
  onReset: () => void
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onReset }) => {
  return (
    <div className="text-center py-8">
      <p className="text-primary text-lg outfit font-light">
        No products found. Try adjusting your filters or selecting a different shape, style, color, or clarity.
      </p>
      <button
        onClick={onReset}
        className="mt-4 px-4 py-2 bg-white text-black rounded-[8px] outfit font-medium hover:bg-gray-200 transition-colors"
        aria-label="Reset filters"
      >
        Reset Filters
      </button>
    </div>
  )
}
