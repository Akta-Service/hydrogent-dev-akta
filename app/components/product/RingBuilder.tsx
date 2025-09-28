"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"

interface RingVisualizerProps {
  csvMedia?: string | null
  fallbackRingImageUrl: string
  itemHeight?: number
  hasCSVMedia: boolean
}

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <div className={`bg-white ${className}`}>{children}</div>
}

const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-2 ${className}`}>{children}</div>
}

export default function RingVisualizer({
  csvMedia,
  fallbackRingImageUrl,
  itemHeight = 550,
  hasCSVMedia,
}: RingVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [skinTone, setSkinTone] = useState(1.0)
  const [isLoading, setIsLoading] = useState(true)
  const originalImageDataRef = useRef<ImageData | null>(null)
  const handImageRef = useRef<HTMLImageElement | null>(null)
  const ringImageRef = useRef<HTMLImageElement | null>(null)

  const isHandPixel = useCallback((r: number, g: number, b: number, a: number) => {
    const whiteThreshold = 250
    const isWhiteBackground = r >= whiteThreshold && g >= whiteThreshold && b >= whiteThreshold

    const lightGrayThreshold = 245
    const isLightBackground =
      r >= lightGrayThreshold &&
      g >= lightGrayThreshold &&
      b >= lightGrayThreshold &&
      Math.abs(r - g) < 10 &&
      Math.abs(g - b) < 10

    return !isWhiteBackground && !isLightBackground && a > 200
  }, [])

  const hslToRgb = useCallback((h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }, [])

  const applyBrightness = useCallback(
    (imageData: ImageData, brightness: number) => {
      const data = imageData.data
      const newImageData = new ImageData(new Uint8ClampedArray(data), imageData.width, imageData.height)

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]

        if (isHandPixel(r, g, b, a)) {
          newImageData.data[i] = Math.min(255, Math.max(0, r * brightness))
          newImageData.data[i + 1] = Math.min(255, Math.max(0, g * brightness))
          newImageData.data[i + 2] = Math.min(255, Math.max(0, b * brightness))
          newImageData.data[i + 3] = a
        } else {
          newImageData.data[i] = r
          newImageData.data[i + 1] = g
          newImageData.data[i + 2] = b
          newImageData.data[i + 3] = a
        }
      }

      return newImageData
    },
    [isHandPixel],
  )

  const drawComposite = useCallback(
    (brightness: number) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (!canvas || !ctx || !handImageRef.current || !ringImageRef.current || !originalImageDataRef.current) return

      const filteredImageData = applyBrightness(originalImageDataRef.current, brightness)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.putImageData(filteredImageData, 0, 0)

      const ringScale = 0.064
      const ringWidth = ringImageRef.current.width * ringScale
      const ringHeight = ringImageRef.current.height * ringScale
      const ringX = canvas.width * 0.354 - ringWidth / 2
      const ringY = canvas.height * 0.44 - ringHeight / 2

      ctx.drawImage(ringImageRef.current, ringX, ringY, ringWidth, ringHeight)
    },
    [applyBrightness],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    let loadedImages = 0
    const totalImages = 2

    const checkAllLoaded = () => {
      loadedImages++
      if (loadedImages === totalImages) {
        canvas.width = handImageRef.current!.width
        canvas.height = handImageRef.current!.height
        ctx.drawImage(handImageRef.current!, 0, 0)
        originalImageDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height)
        drawComposite(skinTone)
        setIsLoading(false)
      }
    }

    const handImg = new Image()
    handImg.crossOrigin = "anonymous"
    handImg.onload = () => {
      handImageRef.current = handImg
      checkAllLoaded()
    }
    handImg.src = hasCSVMedia && csvMedia ? csvMedia : "/ring-builder/hand1.jpg"

    const ringImg = new Image()
    ringImg.crossOrigin = "anonymous"
    ringImg.onload = () => {
      ringImageRef.current = ringImg
      checkAllLoaded()
    }
    ringImg.src = fallbackRingImageUrl

  }, [drawComposite, skinTone, csvMedia, fallbackRingImageUrl, hasCSVMedia])

  useEffect(() => {
    if (!isLoading) {
      drawComposite(skinTone)
    }
  }, [skinTone, drawComposite, isLoading])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkinTone(Number.parseFloat(e.target.value))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto rounded-lg">
      <CardContent className="px-6 ">
        <div className="flex justify-center">
          <div className="relative inline-block">
            {isLoading && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg z-10"
                style={{ minHeight: itemHeight ? `${itemHeight}px` : "550px" }}
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Animated Ring Icon */}
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-black rounded-full opacity-20"></div>
                    </div>
                  </div>
                  
                  {/* Loading Text */}
                  <div className="text-center">
                    <div className="text-lg font-medium text-gray-700 mb-1">Loading Preview</div>
                    <div className="text-sm text-gray-500">Preparing your ring visualization...</div>
                  </div>
                  
                  {/* Animated Dots */}
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <canvas
              ref={canvasRef}
              className={`max-w-full h-auto rounded-lg transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              style={{ maxHeight: itemHeight ? `${itemHeight}px` : "550px" }}
            />
            
            <div className={`absolute h-[400px] top-1/2 -translate-y-1/2 right-[-20px] flex flex-col items-center transition-opacity duration-300 ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              <span className="text-[14px] outfit font-light text-[#454545] mb-2">Fair</span>
              <input
                type="range"
                min="0.6"
                max="1.1"
                step="0.01"
                value={skinTone}
                onChange={handleSliderChange}
                className="appearance-none h-[400px] w-1 bg-[#6D6D6D] custom-slider"
                style={{
                  writingMode: "bt-lr" as any,
                  WebkitAppearance: "slider-vertical",
                }}
                disabled={isLoading}
              />
              <span className="text-[14px] outfit font-light text-[#454545] mb-2">Deep</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}