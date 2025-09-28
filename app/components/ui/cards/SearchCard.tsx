"use client"

import type React from "react"
import { Link } from "@remix-run/react"
import { Image } from '@shopify/hydrogen';
import ArrowIcon from "~/assets/svg/ArrowIcon"
import WishIcon from "~/assets/images/svg/wishlist.svg"

interface SearchCardProps {
  title: string
  price: string | React.ReactNode
  image: any
  category: string
  to: string
  onClick?: () => void
}

const SearchCard = ({ image, title, price, category, to, onClick }: SearchCardProps) => {
  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (onClick) onClick()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick(e)
    }
  }

  return (
    <Link to={to} onClick={handleClick}>
      <div className="w-full">
        <div className="imgCard rounded-[8px] overflow-hidden border border-black relative">
          <Image 
            src={image || "/placeholder.svg"} 
            alt={title} 
            className="w-full" 
            width={400}
            height={400}
            sizes="(min-width: 45em) 400px, 200px"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-[0px] left-0 flex align-center w-full justify-between p-2">
            <p className="text-primary bg-[#f6f6f6] rounded-[4px] py-[2px] px-[8px] font-light outfit text-[14px]">
              {category}
            </p>
            <button className="cursor-pointer" aria-label="Add to wishlist">
              <img src={WishIcon || "/placeholder.svg"} alt="Wishlist" loading="lazy" />
            </button>
          </div>
        </div>
        <div className="mt-4 cardInfo w-full flex justify-between align-start">
          <div>
            <h5 className="text-[18px] font-medium playfairsb text-primary">{title}</h5>
            <p className="mt-[3px] outfit text-[16px] outfit text-primary">{price}</p>
          </div>
          <ArrowIcon rotate={0} size={24} className="text-primary" />
        </div>
      </div>
    </Link>
  )
}

export default SearchCard