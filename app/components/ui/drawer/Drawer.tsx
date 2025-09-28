import type React from "react"
import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  direction?: string
  className?: string
  children: React.ReactNode
}

export default function Drawer({ isOpen, onClose, children }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 80,
              mass: 1.5,
              duration: 0.6,
            }}
            className="fixed inset-0 w-full z-50 shadow-lg"
          >
            <div
              ref={drawerRef}
              className=" flex items-center justify-center"
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}