import React from 'react';
import { Link } from '@remix-run/react';
import linkArrow from '~/assets/images/svg/link_icon.svg';
import ArrowIcon from '~/assets/svg/ArrowIcon';

interface Media {
  __typename: string;
  id: string;
  mediaContentType: string;
  alt?: string;
  image?: {
    url: string;
    altText?: string;
  };
}

interface BasicCardProps {
  media?: { edges: Array<{ node: Media }> }; 
  title: string;
  price: number | string;
  fallbackImage?: string; 
  handle?: string;
}

const BasicCard = ({ media, title, price, fallbackImage = '',handle }: BasicCardProps) => {
  // Use the first image from media if available, otherwise fallback to provided image
  const imageUrl = media?.edges?.[0]?.node.image?.url || fallbackImage;
  const altText = media?.edges?.[0]?.node.image?.altText || title;


  return (
    <div className="card relative">
      <Link to={`/products/${handle}`} className="block">
        <div className="cardImage overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={altText || title}
              className="transition-transform duration-300 ease-in-out hover:scale-120"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span>No image available</span>
            </div>
          )}
        </div>
        <div className="w-full lg:p-4 md:p-2 cardTitle flex items-center justify-between absolute bottom-2 left-0">
          <div>
            <h4 className="playfair text-[16px] md:text-[18px] md:leading-[19px] md:mb-[5px] lg:mb-[0] text-primary font-medium">
              {title}
            </h4>
            <p className="outfit text-primary text-[14px] md:text-[16px] font-normal">
              €{price}
            </p>
          </div>
          <ArrowIcon rotate={0} size={24} className="text-primary" />
        </div>
      </Link>
    </div>
  );
};

export default BasicCard;