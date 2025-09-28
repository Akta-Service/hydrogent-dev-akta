"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";


interface OrderProps {
  status: "Delivered" | "Canceled";
  summary: string;
  images: string[];
  children:any
}

const OrderCard = ({ status, summary, images, children }: OrderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusStyle = status === "Delivered"
    ? "bg-green-700 text-[#E7E7E7]"
    : "bg-red-700 text-[#E7E7E7]";

  return (
    <div className="newcustombg rounded-md p-4 mb-4 border-l-2 border-white">
      <div className="flex justify-between items-center">
        {/* Left side */}
        <div className="space-y-1 text-sm text-primary">
          <div className="flex mb-3 gap-2 text-[13px] outfit font-light text-[#E7E7E7] items-center">
            <span>Order Number</span>
            <span>Date</span>
          </div>
          <span className={`px-3 py-1 text-[13px] outfit font-light rounded-full ${statusStyle}`}>
            {status}
          </span>
        </div>

        {/* Center */}
        <div className="text-primary">
          <div className="text-[13px] outfit font-light text-[#B0B0B0]">Summary</div>
          <div className="text-[18px] outfit text-[#E7E7E7]">{summary}</div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <span className="text-[#E7E7E7] text-[18px] outfit">+1</span>
          <div className="flex space-x-2">
            {images.slice(0, 3).map((src, index) => (
              <img
                key={index}
                src={src}
                alt="ring"
                width={40}
                height={40}
                className="rounded-md"
              />
            ))}
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="ml-2">
            {isOpen ? (
              <ChevronUp className="text-primary" />
            ) : (
              <ChevronDown className="text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
