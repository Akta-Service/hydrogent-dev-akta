import type React from "react"
import { useState, useMemo, memo, useEffect, useRef, useCallback } from "react"
import { Play, ChevronUp, ChevronDown } from "lucide-react";
import threesixty from "~/assets/images/demo/360-view.png";


interface MediaItem {
  url: string
  altText: string
  type: "image" | "video" | "iframe"
  id?: string
  width?: number
  height?: number
  title?: string
}

interface EnhancedSliderGalleryProps {
  images: MediaItem[]
  videos?: MediaItem[]
  hasCSVMedia?: boolean
}

const EnhancedSliderGallery: React.FC<EnhancedSliderGalleryProps> = ({ images, videos = [], hasCSVMedia = false }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [mouseStart, setMouseStart] = useState<{ x: number; y: number } | null>(null)
  const [isShaking, setIsShaking] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const mainSliderRef = useRef<HTMLDivElement>(null)
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  // Helper function to properly append query parameters to URLs
  const appendQueryParams = useCallback((url: string, params: Record<string, string | number>): string => {
    try {
      const urlObj = new URL(url)
      Object.entries(params).forEach(([key, value]) => {
        urlObj.searchParams.set(key, String(value))
      })
      return urlObj.toString()
    } catch (error) {
      // If URL parsing fails, fall back to simple string concatenation
      const separator = url.includes('?') ? '&' : '?'
      const paramString = Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
      return `${url}${separator}${paramString}`
    }
  }, [])

  // Optimize media processing with better memoization
  const processedMediaItems = useMemo(() => {
    const allItems = [...images, ...videos]

    if (allItems.length === 0) {
      return [
        {
          url: "/placeholder.svg?height=546&width=546",
          altText: "Placeholder image",
          type: "image" as const,
          id: "fallback",
          thumbnail: "/placeholder.svg?height=108&width=108",
        },
      ]
    }

    return allItems.map((item, index) => ({
      ...item,
      id: item.id || `item-${index}`,
      url: item.type === "iframe" ? item.url : hasCSVMedia ? item.url : appendQueryParams(item.url, { width: 546, format: "webp" }),
      thumbnail:
        item.type === "video"
          ? appendQueryParams(item.url, { t: "1" })
          : item.type === "iframe"
            ? "/placeholder.svg?height=108&width=108"
            : hasCSVMedia
              ? item.url
              : appendQueryParams(item.url, { width: 108, format: "webp" }),
    }))
  }, [images, videos, hasCSVMedia, appendQueryParams])

  // Optimize slide navigation
  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < processedMediaItems.length) {
      setActiveIndex(index)
    }
  }, [processedMediaItems.length])

  const triggerShake = useCallback(() => {
    setIsShaking(true)
    
    if (shakeTimeoutRef.current) {
      clearTimeout(shakeTimeoutRef.current)
    }
    
    shakeTimeoutRef.current = setTimeout(() => {
      setIsShaking(false)
    }, 300) // Reduced from 500ms to 300ms
  }, [])

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => {
      const nextIndex = prev + 1
      if (nextIndex >= processedMediaItems.length) {
        triggerShake()
        return prev
      }
      return nextIndex
    })
  }, [processedMediaItems.length, triggerShake])

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => {
      const prevIndex = prev - 1
      if (prevIndex < 0) {
        triggerShake()
        return prev
      }
      return prevIndex
    })
  }, [processedMediaItems.length, triggerShake])

  // Optimize touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Update touch end position during move
    if (touchStart) {
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      })
    }
  }, [touchStart])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart || !touchEnd) {
      return
    }
    
    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const minSwipeDistance = 30 // Reduced from 50 for better responsiveness
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX)
    
    
    if (!isVerticalSwipe) {
      if (isLeftSwipe) {
        goToNext()
      } else if (isRightSwipe) {
        goToPrev()
      }
    }
    
    // Reset touch positions
    setTouchStart(null)
    setTouchEnd(null)
  }, [touchStart, touchEnd, goToNext, goToPrev])

  // Mouse drag handling for desktop
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setMouseStart({
      x: e.clientX,
      y: e.clientY
    })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !mouseStart) return
    
    const deltaX = e.clientX - mouseStart.x
  }, [isDragging, mouseStart])

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !mouseStart) return
    
    const distanceX = mouseStart.x - e.clientX
    const minSwipeDistance = 30 // Reduced from 50 for better responsiveness
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    
    
    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrev()
    }
    
    setIsDragging(false)
    setMouseStart(null)
  }, [isDragging, mouseStart, goToNext, goToPrev])

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      setMouseStart(null)
    }
  }, [isDragging])

  // Optimize thumbnail position calculation
  const calculateThumbnailPosition = useCallback(() => {
    const totalItems = processedMediaItems.length
    const visibleThumbnails = 3 
    const thumbnailHeight = window.innerWidth >= 1536 ? 125 : 80 
        
    if (totalItems <= visibleThumbnails) {
      return 0
    }
    
    const maxScrollPosition = (totalItems - visibleThumbnails) * thumbnailHeight
    
    if (activeIndex === 0) {
      return 0
    }
    
    if (activeIndex === 1) {
      return 0
    }
    
    const centeredPosition = (activeIndex - 1) * thumbnailHeight
    const finalPosition = Math.min(centeredPosition, maxScrollPosition)
    return finalPosition
  }, [activeIndex, processedMediaItems.length])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrev()
    } else if (e.key === 'ArrowRight') {
      goToNext()
    }
  }, [goToPrev, goToNext])

  // Optimize initialization effects
  useEffect(() => {
    setIsMounted(true)
    const hydrationTimer = setTimeout(() => {
      setIsHydrated(true)
    }, 50) // Reduced from 100ms
    
    return () => {
      setIsMounted(false)
      clearTimeout(hydrationTimer)
    }
  }, [])

  useEffect(() => {
    setActiveIndex(0)

    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current)
    }

    initTimeoutRef.current = setTimeout(() => {
      // Initialization logic if needed
    }, 100) // Reduced from 150ms

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
    }
  }, [processedMediaItems, isMounted, isHydrated])

  useEffect(() => {
    if (isMounted && isHydrated && containerRef.current) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isMounted, isHydrated, handleKeyDown])

  // Optimize mouse drag handling
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!mouseStart) return
        const deltaX = e.clientX - mouseStart.x
      }

      const handleGlobalMouseUp = (e: MouseEvent) => {
        if (!mouseStart) return
        
        const distanceX = mouseStart.x - e.clientX
        const minSwipeDistance = 30 // Reduced from 50
        const isLeftSwipe = distanceX > minSwipeDistance
        const isRightSwipe = distanceX < -minSwipeDistance
        
        
        if (isLeftSwipe) {
          goToNext()
        } else if (isRightSwipe) {
          goToPrev()
        }
        
        setIsDragging(false)
        setMouseStart(null)
      }

      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }
  }, [isDragging, mouseStart, goToNext, goToPrev])

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current)
      }
    }
  }, [])

  // Optimize video handling
  const handleVideoRef = useCallback(
    (el: HTMLVideoElement | null, index: number) => {
      if (!el) return

      // Store reference for better management
      if (!videoRefs.current[index]) {
        videoRefs.current[index] = el;
      }

      if (activeIndex === index) {
        // Reduced error handling for better performance
        el.play().catch(() => {})
      } else {
        el.pause()
      }
    },
    [activeIndex],
  )

  // Optimize loading state
  if (!isMounted || !isHydrated || processedMediaItems.length === 0) {
    return (
      <div className="flex flex-row-reverse lg:items-center relative md:h-[540px] sm:h-[500px] h-[350px]">
        <div className="xl:pl-[10px] mainslide flex-1">
          <div className="h-[350px] sm:h-[500px] md:h-auto rounded-2xl bg-gray-100 animate-pulse 2xl:max-w-[546px] lg:max-w-[490px] md:max-w-[360px] aspect-[1/1] flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="mt-[35px] md:mt-0 flex flex-row-reverse lg:items-center relative md:h-[540px] sm:h-[500px] h-[350px]"
    >
      {/* Main Slider */}
      <div className="xl:pl-[10px] mainslide flex-1 w-full md:w-1/2">
        <div
          ref={mainSliderRef}
          className="relative h-[350px] sm:h-[500px] md:h-auto rounded-2xl overflow-hidden 2xl:max-w-[546px] lg:max-w-[490px] md:max-w-[360px] aspect-[1/1] cursor-grab active:cursor-grabbing select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          tabIndex={0}
          style={{ touchAction: 'pan-y pinch-zoom' }}
        >
          {/* Main Slides Container */}
          <div 
            className="flex transition-transform duration-300 ease-out h-full"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {processedMediaItems.map((item, index) => (
              <div 
                key={`main-${item.id}-${index}`} 
                className="flex-shrink-0 w-full h-full relative"
              >
                <div className="relative w-full h-full mainslidedata">
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover rounded-2xl pointer-events-none select-none"
                      muted
                      autoPlay={activeIndex === index}
                      playsInline
                      loop
                      ref={(el) => handleVideoRef(el, index)}
                      // Add loading optimization
                      preload="metadata"
                    />
                  ) : item.type === "iframe" ? (
                    <iframe
                      src={item.url}
                      title={item.title || item.altText}
                      className="w-full h-full rounded-2xl border-0"
                      allowFullScreen
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  ) : (
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={item.altText}
                      className=" object-cover rounded-2xl pointer-events-none select-none"
                      loading={index === 0 ? "eager" : "lazy"}
                      draggable={false}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=546&width=546"
                      }}
                      // Add performance optimizations
                      decoding="async"
                      
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots - optimized rendering */}
          {processedMediaItems.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {processedMediaItems.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    activeIndex === index ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Slider */}
      {processedMediaItems.length > 1 && (
        <div className="relative hidden xl:block">
          {/* Thumbnail Navigation */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
            <button 
              className={`flex items-center justify-center cursor-pointer shadow-[0px_92px_202px_0px_#0611461A] h-[36px] w-[36px] bg-[#3D3D3D] rounded-[4px] text-primary transition-colors ${
                activeIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4D4D4D]'
              }`}
              onClick={() => {
                const newIndex = Math.max(0, activeIndex - 1)
                goToSlide(newIndex)
              }}
              disabled={activeIndex === 0}
              aria-label="Previous thumbnail"
            >
              <ChevronUp className="w-4 h-4 text-white"/>
            </button>
          </div>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-10">
            <button 
              className={`flex items-center justify-center cursor-pointer shadow-[0px_92px_202px_0px_#0611461A] h-[36px] w-[36px] bg-[#3D3D3D] rounded-[4px] text-primary transition-colors ${
                activeIndex === processedMediaItems.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4D4D4D]'
              }`}
              onClick={() => {
                const newIndex = Math.min(processedMediaItems.length - 1, activeIndex + 1)
                goToSlide(newIndex)
              }}
              disabled={activeIndex === processedMediaItems.length - 1}
              aria-label="Next thumbnail"
            >
              <ChevronDown className="w-4 h-4 text-white"/>
            </button>
          </div>

          {/* Custom Thumbnail Container */}
          <div className="2xl:h-[355px] h-[245px] 2xl:w-[108px] w-[70px] overflow-hidden">
            <div 
              className="flex flex-col transition-transform duration-300 ease-out"
              style={{
                transform: `translateY(-${calculateThumbnailPosition()}px)`
              }}
            >
              {processedMediaItems.map((item, index) => (
                <div
                  key={`thumb-${item.id}-${index}`}
                  className={`cursor-pointer mb-[10px] last:mb-0 ${activeIndex === index ? 'opacity-100' : 'opacity-70'}`}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    goToSlide(index)
                  }}
                >
                  <div className="relative">
                    {item.type === "video" ? (
                      <div className="relative">
                        <video
                          src={item.url}
                          className={`w-full 2xl:h-[115px] h-[70px] object-cover rounded-lg border cursor-pointer hover:border-white transition-all ${
                            activeIndex === index ? 'border-white' : 'border-gray-300'
                          }`}
                          muted
                          autoPlay
                          loop
                          playsInline
                          preload="metadata"
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            goToSlide(index)
                          }}
                        />
                        <div 
                          className="absolute inset-0 flex items-center justify-center"
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            goToSlide(index)
                          }}
                        >
                          <div className="bg-white bg-opacity-80 rounded-full p-1">
                            <Play className="w-3 h-3 text-gray-800" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    ) : item.type === "iframe" ? (
                      <div 
                        className={`relative w-full 2xl:h-[115px] h-[70px] rounded-lg border cursor-pointer hover:border-white transition-all flex items-center justify-center ${
                          activeIndex === index ? 'border-white' : 'border-gray-300'
                        }`}
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          goToSlide(index)
                        }}
                      >
                        <div className="rounded-full p-2">
                          <img src={threesixty} alt=""/>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.thumbnail || item.url}
                        alt={`Thumbnail ${item.altText}`}
                        className={`w-full 2xl:h-[115px] h-[70px] object-cover rounded-lg border cursor-pointer hover:border-white transition-all ${
                          activeIndex === index ? 'border-white' : 'border-gray-300'
                        }`}
                        loading="lazy"
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          goToSlide(index)
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=108&width=108"
                        }}
                        // Add performance optimizations
                        decoding="async"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(EnhancedSliderGallery)