"use client"

import type React from "react"

interface DiamondData {
  carat?: string
  shape?: string
  color?: string
  clarity?: string
  price?: string
}

interface FrameData {
  metal?: string
  style?: string
  size?: string
  price?: string
}

interface StepIndicatorProps {
  currentStep: number
  diamondData?: DiamondData
  frameData?: FrameData
  settingFirstFlow?: boolean
  onViewDiamond?: () => void
  onViewFrame?: () => void
  onEditDiamond?: () => void
  onEditFrame?: () => void
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  diamondData,
  frameData,
  settingFirstFlow = false,
  onViewDiamond,
  onViewFrame,
  onEditDiamond,
  onEditFrame,
}) => {
  const step1Data = settingFirstFlow ? frameData : diamondData
  const step2Data = settingFirstFlow ? diamondData : frameData
  const step1Label = settingFirstFlow ? "Settings" : "Choose a Diamond"
  const step2Label = settingFirstFlow ? "Diamond" : "Setting"


  const renderDiamondData = (data: DiamondData) => (
    <>
      <p className="text-[14px] outfit font-normal">
        Diamond - {data.carat || "N/A"} ct. {data.shape || "Round"} Lab Grown
      </p>
      <p className="text-[14px] outfit font-light">
        {data.color || "N/A"} | {data.clarity || "N/A"} - {data.price || "$N/A"}
      </p>
    </>
  )

  const renderFrameData = (data: FrameData) => (
    <>
      <p className="text-[14px] outfit font-normal">
        {data.metal || "Yellow Gold"}, {data.style || "Classic"}, {data.size || "N/A"}
      </p>
      <p className="text-[14px] outfit font-light">{data.price || "$N/A"}</p>
    </>
  )

  return (
    <div className="container md:max-w-[1440px] max-w-[1350px] mx-auto px-[15px] lg:px-[40px]">
      <div
        className="h-auto rounded-[8px] md:p-2 steps text-primary kk"
        // style={{
        //   background: "linear-gradient(29.29deg, #09090A 15.55%, #535D6E 154.94%)",
        // }}
      >
        <div className="grid md:grid-cols-3 gap-2">
          {/* Step 1 */}
          <div
            className={`rounded-[8px] flex flex-col justify-center relative md:px-4 px-2 min-h-[55px] ${
              currentStep === 1 ? "bg-black shadow-[0px_0px_8px_0px_#FFFFFF66] text-white" : "bg-transparent text-primary"
            }`}
          >
            <p className="text-[14px] outfit font-light ">Step 1</p>

            <div className="w-[80%]">
              {step1Data ? (
                settingFirstFlow ? (
                  renderFrameData(step1Data as FrameData)
                ) : (
                  renderDiamondData(step1Data as DiamondData)
                )
              ) : (
                <p className="text-[14px] md:text-[16px] outfit font-light">{step1Label}</p>
              )}
            </div>
            { step1Data && (
              <div className="flex space-x-3 mt-1 md:absolute top-6 right-3">
                <button
                  className="text-[13px] outfit text-primary/80 underline"
                  onClick={settingFirstFlow ? onViewFrame : onViewDiamond}
                >
                  View
                </button>
                <button
                  className="text-[13px] outfit text-primary/80 underline"
                  onClick={settingFirstFlow ? onEditFrame : onEditDiamond}
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Step 2 */}
          <div
            className={`rounded-[8px] flex justify-center relative flex-col md:px-4 px-2 min-h-[55px] ${
              currentStep === 2 ? "bg-black shadow-[0px_0px_8px_0px_#FFFFFF66] text-white" : "bg-transparent text-primary"
            }`}
          >
            <p className="text-[14px] outfit font-light">Step 2</p>
            <div className="w-[80%]">
              {step2Data ? (
                settingFirstFlow ? (
                  renderDiamondData(step2Data as DiamondData)
                ) : (
                  renderFrameData(step2Data as FrameData)
                )
              ) : (
                <p className="text-[14px] md:text-[16px] outfit font-light">{step2Label}</p>
              )}
            </div>
            { step2Data && (
              <div className="flex space-x-3 mt-1 md:absolute top-6 right-3">
                <button
                  className="text-[13px] outfit text-primary/80 underline"
                  onClick={settingFirstFlow ? onViewDiamond : onViewFrame}
                >
                  View
                </button>
                <button
                  className="text-[13px] outfit text-primary/80 underline"
                  onClick={settingFirstFlow ? onEditDiamond : onEditFrame}
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Step 3 */}
          <div
            className={`rounded-[8px] flex justify-center flex-col px-2 md:px-4 min-h-[55px] ${
              currentStep === 3 ? "bg-black shadow-[0px_0px_8px_0px_#FFFFFF66] text-white" : "bg-transparent text-primary"
            }`}
          >
            <p className="text-[14px] outfit font-light">Step 3</p>
            <p className="text-[16px] outfit font-light">Preview</p>
          </div>
        </div>
      </div>
    </div>
  )
}
