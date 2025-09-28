"use client"

import { memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "@remix-run/react"
import { Image } from "@shopify/hydrogen"
import ArrowIcon from "~/assets/svg/ArrowIcon"
import Button from "../ui/buttons/Button"

interface Collection {
  node: {
    id: string
    title: string
    handle: string
    description: string
    fresh_n_fine: {
      value: string
    }
    image: {
      altText: string | null
      url: string
      width: number
      height: number
    }
  }
}

interface SimplifiedFreshFineSectionProps {
  freshFineCollection: Collection[]
}

const CollectionCard = memo(
  ({
    collection,
    imageHeight = "h-[455px]",
  }: {
    collection: Collection["node"]
    imageHeight?: string
  }) => {
    if (!collection) return null

    return (
      <Link to={`/collections/${collection.handle}`} className="cursor-pointer">
        <Image
          src={collection.image?.url || "/placeholder.svg"}
          alt={collection.image?.altText || collection.title}
          width={500}
          height={561}
          sizes="(min-width: 768px) 100vw, 100vw"
          className={`w-full md:h-[561px] object-cover rounded-[3px] grayscale hover:grayscale-0 transition duration-500 ${imageHeight}`}
        />
        <div className="flex justify-between items-center mt-2">
          <div>
            <h3 className="text-[16px] leading-[17px] md:text-[18px] playfairsb capitalize text-[#454545] font-medium md:leading-[130%]">
              {collection.title}
            </h3>
          </div>
          <button aria-label={`View ${collection.title}`}>
            <ArrowIcon className="h-5 w-5 cursor-pointer" />
          </button>
        </div>
      </Link>
    )
  },
)
CollectionCard.displayName = "CollectionCard"

// <CHANGE> Simplified AnimatedProductCard component for collections
const AnimatedCollectionCard = memo(
  ({
    collection,
    index,
    imageHeight,
  }: {
    collection: Collection["node"]
    index: number
    imageHeight?: string
  }) => {
    if (!collection) return null

    return (
      <AnimatePresence mode="wait" key={`collection-container-${index}`}>
        <motion.div
          key={`collection-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <CollectionCard collection={collection} imageHeight={imageHeight} />
        </motion.div>
      </AnimatePresence>
    )
  },
)
AnimatedCollectionCard.displayName = "AnimatedCollectionCard"

// <CHANGE> Main component simplified - removed all navigation props and buttons
const SimplifiedFreshFineSection = ({
  freshFineCollection,
}: SimplifiedFreshFineSectionProps) => {
  // <CHANGE> Take only first 5 collections
  const displayedCollections = freshFineCollection.slice(0, 5)

  return (
    <div className="w-full md:py-[75px] py-[25px]">
      <div className="container max-w-[1440px] mx-auto px-[19px] md:px-[40px]">
        {/* Header and top row collections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Header section */}
          <div className="md:col-span-1 flex flex-col justify-between bg-[url('/bello-transparent.png')] bg-no-repeat bg-left-bottom">
            <div>
              <h1 className="border border-bottom playfair text-[32px] leading-[38px] md:text-[64px] md:leading-[70px] font-serif font-medium mb-6 custom-border-bottom-black">
                Explore The <span className="lg:block lg:text-right lg:pr-[68px]">Look</span>
              </h1>
              <p className="text-[16px] md:text-[20px] md:leading-[150%] tracking-[-1%] outfit md:font-light font-semibold mb-6 text-[rgba(0,0,0,0.8)]">
                {`Do You Love What Our Models Chose? Click any of the Photos to Shop. Ready to Make Them Yours? We Can't Wait to See you Sparkle!`}
              </p>
            </div>
          </div>

          {/* Desktop top row collections */}
          {[0, 1].map((index) => (
            <div key={`desktop-collection-${index}`} className="md:col-span-1 relative group hidden md:block">
              {displayedCollections[index] && (
                <AnimatedCollectionCard
                  collection={displayedCollections[index].node}
                  index={index}
                  imageHeight="h-[218px]"
                />
              )}
            </div>
          ))}

          {/* Mobile top row collections */}
          <div className="md:hidden grid grid-cols-2 gap-2 md:gap-6 w-full">
            {[0, 1].map((index) => (
              <div key={`mobile-collection-${index}`}>
                {displayedCollections[index] && (
                  <AnimatedCollectionCard
                    collection={displayedCollections[index].node}
                    index={index}
                    imageHeight="h-[218px]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row collections */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6">
          {[2, 3, 4].map((index) => (
            <div key={`bottom-collection-${index}`}>
              {displayedCollections[index] && (
                <AnimatedCollectionCard
                  collection={displayedCollections[index].node}
                  index={index}
                  imageHeight="h-[218px]"
                />
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-6 md:hidden">
          {[2].map((index) => (
            <div key={`bottom-collection-${index}`}>
              {displayedCollections[index] && (
                <AnimatedCollectionCard
                  collection={displayedCollections[index].node}
                  index={index}
                  imageHeight="h-[218px]"
                />
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6 md:hidden mt-6">
          {[3, 4].map((index) => (
            <div key={`bottom-collection-${index}`}>
              {displayedCollections[index] && (
                <AnimatedCollectionCard
                  collection={displayedCollections[index].node}
                  index={index}
                  imageHeight="h-[218px]"
                />
              )}
            </div>
          ))}
        </div>
         <div className="text-center md:mt-[55px] mt-[25px] relative md:max-w-[230px] w-full mx-auto">
          <Button className="md:w-[250px] w-full" to="/collections">
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  )
}

export default memo(SimplifiedFreshFineSection)
