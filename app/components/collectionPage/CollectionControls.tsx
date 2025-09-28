"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import filterIcon from "~/assets/images/svg/filtericons.svg"
import sortIcon from "~/assets/images/svg/black-sort.svg"

interface CollectionControlsProps {
  productCount: number
  isSortOpen: boolean
  setIsSortOpen: (open: boolean) => void
  selectedSort: string
  onSortChange: (value: string) => void
  onFilterClick: () => void
  sortOptions: Array<{ label: string; value: string }>
}

const TickIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="11"
    viewBox="0 0 16 11"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M15.707 0.28a1 1 0 0 1 0 1.414L6.214 10.72a1 1 0 0 1-1.414 0L0.305 6.415a1 1 0 0 1 1.414-1.414L5.508 8.69l8.786-8.41a1 1 0 0 1 1.414 0Z"
      fill="#000"
    />
  </svg>
)

export default function CollectionControls({
  productCount,
  isSortOpen,
  setIsSortOpen,
  selectedSort,
  onSortChange,
  onFilterClick,
  sortOptions,
}: CollectionControlsProps) {
  const sortDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setIsSortOpen])

  return (
    <div className="flex flex-row py-3 justify-between relative">
      <ul className="flex items-center">
        <li>
          <button
            type="button"
            className="mb-0 text-sm outfit font-light text-primary cursor-pointer bg-transparent border-none flex items-center"
            onClick={onFilterClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onFilterClick()
              }
            }}
            aria-label="Open filters"
          >
            <img src={filterIcon || "/placeholder.svg"} className="pr-3" alt="Filter" />
            Filters
          </button>
        </li>
        {/* <li className="mb-0 ml-8 text-base outfit font-light text-primary">{productCount} products</li> */}
      </ul>
      <ul>
        <li className="mb-0 text-sm outfit font-light text-primary">
          <div ref={sortDropdownRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex gap-2 items-center px-4 py-2 rounded-md cursor-pointer"
              aria-expanded={isSortOpen}
              aria-controls="sort-dropdown"
            >
              <img src={sortIcon} className="pr-3" alt="Filter" />
              Sort
            </button>
            {isSortOpen && (
              <div id="sort-dropdown" className="z-100 absolute shadow-md z-10 mt-2 w-60 right-0 rounded-md bg-white p-4 pl-2 pr-6">
                <div className="flex flex-col gap-3">
                  {sortOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex pl-7 items-center gap-2 outfit text-sm md:text-base cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={option.value}
                        checked={selectedSort === option.value}
                        onChange={() => onSortChange(option.value)}
                        className="peer hidden"
                      />
                      <TickIcon
                        className={`w-4 h-4 absolute left-3 text-primary ${
                          selectedSort === option.value ? "block" : "hidden"
                        }`}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </li>
      </ul>
    </div>
  )
}
