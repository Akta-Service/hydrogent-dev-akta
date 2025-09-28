import React from 'react';
import { Link } from '@remix-run/react';
import linkArrow from '~/assets/images/svg/link_icon.svg';
import ArrowIcon from '~/assets/svg/ArrowIcon';
import WishlistButton from '~/components/WishlistButton';

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
  media?: any; 
  title: string;
  price: number | string;
  fallbackImage?: string; 
  handle?: string;
  id?: string;
  showWishlistButton?: boolean;
}

const BasicCard = ({ media, title, price, fallbackImage = '', handle, id, showWishlistButton = false }: BasicCardProps) => {
  const imageUrl = media?.edges?.[0]?.node.image?.url || fallbackImage;
  const altText = media?.edges?.[0]?.node.image?.altText || title;


  return (
    <div className="card relative h-full rounded-lg">
      <Link to={`/products/${handle}`} className="block">
        <div className="cardImage overflow-hidden h-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={altText || title}
              className="w-full sm:w-auto h-full transition-transform duration-1000 ease-in-out hover:scale-140"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span>No image available</span>
            </div>
          )}
        </div>
        <div className="w-full lg:p-4 p-4 cardTitle flex items-center justify-between absolute bottom-2 left-0">
          <div>
            <h4 className="playfair text-[16px] md:text-[18px] md:leading-[19px] md:mb-[5px] lg:mb-[0] text-white font-medium capitalize">
              {title}
            </h4>
            <p className="outfit text-white text-[14px] md:mt-1 md:text-[16px] font-normal">
              {price}
            </p>
          </div>
          <ArrowIcon rotate={0} size={24} className="text-white" />
        </div>
      </Link>
      
      {showWishlistButton && id && handle && (
        <WishlistButton
          product={{
            id: id,
            handle: handle,
            title: title,
            featuredImage: imageUrl ? {
              url: imageUrl,
              altText: altText || title,
            } : undefined,
            priceRange: {
              minVariantPrice: {
                amount: price.toString(),
                currencyCode: 'USD',
              },
            },
          }}
          variant="card"
          size="md"
        />
      )}
    </div>
  );
};

export default BasicCard;