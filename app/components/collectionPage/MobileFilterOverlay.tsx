"use client"

import type React from "react"

interface MobileFilterOverlayProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function MobileFilterOverlay({ isOpen, onClose, children }: MobileFilterOverlayProps) {
  if (!isOpen) return null

  return (
    <div className="overflow-y-scroll fixed inset-0 z-50 flex justify-center items-start bg-black bg-opacity-60 transition-opacity duration-300">
      <div
        className={`relative w-full h-full bg-white transform transition-transform duration-500 ease-out p-4 pr-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 text-primary text-2xl z-50 cursor-pointer"
          onClick={onClose}
          aria-label="Close filter"
        >
          ✕
        </button>
        <div className="h-full w-full max-w-full pr-4 mt-9 max-h-[calc(100vh-10px)] custom-scroll overflow-x-hidden overflow-y-scroll">
          <h3 className="playfair text-2xl font-normal text-primary mb-8">Filters</h3>
          {children}
        </div>
      </div>
    </div>
  )
}
