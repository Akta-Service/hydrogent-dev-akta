import React from 'react';
import { Link } from '@remix-run/react';
import { useWishlist } from '~/hooks/useWishlist';
import type { WishlistItem as WishlistItemType } from '~/lib/wishlist.service';
import ArrowIcon from '~/assets/svg/ArrowIcon';

interface WishlistItemProps {
  item: WishlistItemType;
  className?: string;
  showRemoveButton?: boolean;
  onRemove?: () => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  item,
  className = '',
  showRemoveButton = true,
  onRemove,
}) => {
  const { removeFromWishlist, state } = useWishlist();

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const success = await removeFromWishlist(item.productId);
      if (success && onRemove) {
        onRemove();
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return price;
    return `$${numPrice.toFixed(2)}`;
  };

  return (
    <div className={`wishlist-item bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${className}`}>
      <Link
        to={`/products/${item.handle}`}
        className="block relative group"
        aria-label={`View ${item.title}`}
      >
        <div className="aspect-square overflow-hidden bg-gray-100">
          {item.image?.url ? (
            <img
              src={item.image.url}
              alt={item.image.altText || item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-gray-400 text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs">No image</p>
              </div>
            </div>
          )}
          
          {showRemoveButton && (
            <button
              onClick={handleRemove}
              disabled={state.loading}
              className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg hover:bg-opacity-100 transition-all duration-200 flex items-center justify-center group/remove"
              aria-label="Remove from wishlist"
              title="Remove from wishlist"
            >
              {state.loading ? (
                <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  className="w-4 h-4 text-gray-600 group-hover/remove:text-red-500 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 playfair text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {item.title}
              </h3>
              
              <p className="mt-2 text-primary font-medium outfit text-lg">
                {formatPrice(item.price)}
              </p>
              
              {item.createdAt && (
                <p className="mt-1 text-xs text-gray-500 outfit">
                  Added {new Date(item.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
            
            <ArrowIcon 
              rotate={0} 
              size={20} 
              className="text-gray-400 group-hover:text-primary transition-colors duration-200 flex-shrink-0 mt-1" 
            />
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4">
        <div className="flex gap-2">
          <Link
            to={`/products/${item.handle}`}
            className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-md hover:bg-primary/90 transition-colors duration-200 outfit font-medium text-sm"
          >
            View Product
          </Link>
          
          {showRemoveButton && (
            <button
              onClick={handleRemove}
              disabled={state.loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 outfit font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove from wishlist"
            >
              {state.loading ? (
                <div className="w-4 h-4 border border-gray-400 border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                'Remove'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;