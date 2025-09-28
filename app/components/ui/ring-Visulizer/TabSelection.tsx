"use client"

import type React from "react"
import diamondImg from "~/assets/images/demo/diamondcollection.png";
import settingImg from "~/assets/images/demo/perfectsettings.png";
import rightchevron from "~/assets/images/svg/chevronright.svg";

interface TabSelectionProps {
  onTabSelect: (tab: number) => void
}

export const TabSelection: React.FC<TabSelectionProps> = ({ onTabSelect }) => {
  return (
    <>
      <div className="max-w-[1000px] mx-auto text-center px-[15px] md:pt-0 pt-[50px]">
        <h2 className="md:capitalize uppercase md:text-[56px] sm:text-[45px] text-[34px] md:leading-[65px] sm:leading-[48px] leading-[38px] playfair font-normal mb-4 text-primary">
          Hand-Forged Rings, Designed by You
        </h2>
        <p className="text-primary md:text-[20px] md:max-w-[920px] text-[16px] outfit font-medium">
          This is YOUR moment
        </p>
        <p className="text-primary md:text-[18px] md:max-w-[920px] text-[16px] outfit font-normal">
          Your ring should reflect it
        </p>
        <p className="text-primary md:text-[18px] md:max-w-[920px] text-[16px] outfit font-normal mb-6">
          Start with the diamond or the setting and we’ll hand-forge every detail to match your vision.
        </p>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 max-w-[650px] md:max-w-full">
        <button
          onClick={() => onTabSelect(0)}
          className="cursor-pointer relative"
          aria-label="Select The Perfect Diamond"
        >
          <img src={diamondImg || "/placeholder.svg"} alt="Choose Diamond" style={{width:"100%"}}/>
          <div className="absolute w-full top-0 left-0 cursor-pointer flex items-center p-4 justify-between">
            <p className="text-[18px] outfit font-medium text-white">Select The Perfect Diamond</p>
            <span>
              <img src={rightchevron || "/placeholder.svg"} alt="Next" />
            </span>
          </div>
        </button>
        <button
          onClick={() => onTabSelect(1)}
          className="cursor-pointer relative"
          aria-label="Select The Perfect Setting"
        >
          <img src={settingImg || "/placeholder.svg"} alt="Choose Setting" style={{width:"100%"}}/>
          <div className="absolute w-full top-0 left-0 cursor-pointer flex items-center p-4 justify-between">
            <p className="text-[18px] outfit font-medium text-white">Select The Perfect Setting</p>
            <span>
              <img src={rightchevron || "/placeholder.svg"} alt="Next" />
            </span>
          </div>
        </button>
      </div>
    </>
  )
}
