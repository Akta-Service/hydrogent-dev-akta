"use client"

import { useState, useEffect } from "react"

/**
 * A custom hook that debounces a value.
 *
 * @template T The type of the value to debounce.
 * @param {T} value The value to debounce.
 * @param {number} [delay=500] The debounce delay in milliseconds. Defaults to 500ms.
 * @returns {T} The debounced value.
 */
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
