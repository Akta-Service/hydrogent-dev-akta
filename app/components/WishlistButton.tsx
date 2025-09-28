import React, { useState } from 'react';
import { useWishlistItem } from '~/hooks/useWishlist';
import type { WishlistItem } from '~/lib/wishlist.service';
import LoginModal from '~/components/ui/forms/login';
import { useRouteLoaderData } from '@remix-run/react';

interface WishlistButtonProps {
  product: {
    id: string;
    handle: string;
    title: string;
    featuredImage?: {
      url: string;
      altText?: string;
    };
    priceRange?: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    variants?: {
      nodes: Array<{
        id: string;
        price: {
          amount: string;
          currencyCode: string;
        };
      }>;
    };
  };
  variant?: 'icon' | 'button' | 'card';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  onToggle?: (isInWishlist: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  product,
  variant = 'icon',
  size = 'md',
  className = '',
  showLabel = false,
  onToggle,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isInWishlist, isLoading, toggle } = useWishlistItem(product.id);
  
  const rootData = useRouteLoaderData('root') as { isLoggedIn: boolean } | null;
  const isLoggedIn = rootData?.isLoggedIn ?? false;

  const prepareProductData = (): Omit<WishlistItem, 'id' | 'createdAt'> => {
    const price = product.variants?.nodes?.[0]?.price?.amount || 
                  product.priceRange?.minVariantPrice?.amount || '0';
    
    return {
      productId: product.id,
      title: product.title,
      handle: product.handle,
      price: price,
      image: product.featuredImage ? {
        url: product.featuredImage.url,
        altText: product.featuredImage.altText || product.title,
      } : undefined,
    };
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading || isAnimating) return;

    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsAnimating(true);
    
    try {
      const productData = prepareProductData();
      const success = await toggle(productData);
      
      if (success) {
        onToggle?.(!isInWishlist);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginSuccess = async () => {
    setIsLoginModalOpen(false);
    
    setTimeout(async () => {
      try {
        const productData = prepareProductData();
        const success = await toggle(productData);
        
        if (success) {
          onToggle?.(!isInWishlist);
        }
      } catch (error) {
        console.error('Error adding to wishlist after login:', error);
      }
    }, 1000);
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      icon: 'w-4 h-4',
      button: 'px-2 py-1 text-xs',
      text: 'text-xs',
    },
    md: {
      icon: 'w-5 h-5',
      button: 'px-3 py-2 text-sm',
      text: 'text-sm',
    },
    lg: {
      icon: 'w-6 h-6',
      button: 'px-4 py-2 text-base',
      text: 'text-base',
    },
  };

  // Base classes
  const baseClasses = 'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50';
  
  const renderHeartIcon = () => (
    <svg
      className={`w-full h-full transition-all duration-200 ${isAnimating ? 'animate-pulse' : ''}`}
      fill={isInWishlist ? 'currentColor' : 'none'}
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={isInWishlist ? 0 : 2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );

  const renderLoadingSpinner = () => (
    isLoading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin opacity-60" />
      </div>
    )
  );

  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleToggle}
          disabled={isLoading || isAnimating}
          className={`
            ${baseClasses}
            relative
            ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}
            ${isAnimating ? 'scale-110' : 'hover:scale-105'}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${className}
          `}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <div className={`${sizeConfig[size].icon} relative`}>
            {renderHeartIcon()}
            {renderLoadingSpinner()}
          </div>
        </button>
        
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={handleLoginModalClose}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  if (variant === 'button') {
    return (
      <>
        <button
          onClick={handleToggle}
          disabled={isLoading || isAnimating}
         className="cursor-pointer h-[50px] w-full rounded-[9px] border border-[#D1D1D1] text-[15px] outfit font-semibold uppercase text-primary mr-6"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
       {!isInWishlist ? 'Add to Wishlist' : 'Remove from Wishlist'}
          
          {isLoading ? (
            <span className={sizeConfig[size].text}>
              {isInWishlist ? 'Removing...' : 'Adding...'}
            </span>
          ) : (
            showLabel && (
              <span className={sizeConfig[size].text}>
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </span>
            )
          )}
        </button>
        
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={handleLoginModalClose}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  if (variant === 'card') {
    return (
      <>
        <button
          onClick={handleToggle}
          disabled={isLoading || isAnimating}
          className={`
            ${baseClasses}
            absolute top-3 right-3 z-0
            w-8 h-8 rounded-full
            bg-white bg-opacity-90 backdrop-blur-sm
            shadow-md hover:shadow-lg
            ${isInWishlist ? 'text-red-500' : 'text-gray-600 hover:text-red-400'}
            ${isAnimating ? 'scale-110' : 'hover:scale-105'}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            flex items-center justify-center
            ${className}
          `}
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <div className="w-8 h-8 relative p-1">
            {renderHeartIcon()}
          </div>
          
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-full">
              <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>
        
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={handleLoginModalClose}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  return null;
};

export default WishlistButton;