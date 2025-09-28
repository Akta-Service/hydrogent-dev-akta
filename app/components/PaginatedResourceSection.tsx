import {useLocation, useSearchParams, useNavigate} from '@remix-run/react';
import {useCallback, useEffect, useRef, useState} from 'react';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {ChevronLeft, ChevronRight} from 'lucide-react';

// Fallback ProductConnection type to resolve missing export
interface ProductConnection {
  nodes: ProductItemFragment[];
  pageInfo: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
  };
}

interface PaginatedResourceSectionProps {
  connection: ProductConnection;
  resourcesClassName?: string;
  children: (args: {node: any; index: number}) => JSX.Element;
  onPageInfoChange?: () => void;
}

export function PaginatedResourceSection({
  connection,
  resourcesClassName,
  children,
  onPageInfoChange,
}: PaginatedResourceSectionProps) {
  const {nodes, pageInfo} = connection;
  const {hasPreviousPage, hasNextPage, startCursor, endCursor} = pageInfo;

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPaginatingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  const getPaginationUrl = useCallback(
    (direction: 'next' | 'previous') => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('cursor');
      newSearchParams.delete('direction');

      if (direction === 'next' && endCursor) {
        newSearchParams.set('cursor', endCursor);
        newSearchParams.set('direction', 'next');
      } else if (direction === 'previous' && startCursor) {
        newSearchParams.set('cursor', startCursor);
        newSearchParams.set('direction', 'previous');
      }

      return `${location.pathname}?${newSearchParams.toString()}`;
    },
    [searchParams, location.pathname, startCursor, endCursor],
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      // Ensure top of page on initial load
      window.scrollTo({top: 0, behavior: 'auto'});
      isInitialLoad.current = false;
    } else if (isPaginatingRef.current && gridRef.current) {
      // Smooth scroll to grid only after pagination
      gridRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
    }

    if (isPaginatingRef.current && onPageInfoChange) {
      onPageInfoChange();
    }
    isPaginatingRef.current = false;
  }, [searchParams, onPageInfoChange]);

  const handlePaginationClick = useCallback(
    (direction: 'next' | 'previous') => {
      isPaginatingRef.current = true;
      setIsLoading(true);
      const url = getPaginationUrl(direction);
      navigate(url, {preventScrollReset: true});

      // Reset the ref after a short delay to allow navigation to complete
      setTimeout(() => {
        setIsLoading(false);
        isPaginatingRef.current = false;
      }, 300);
    },
    [navigate, getPaginationUrl],
  );

  // Render paginated resources
  const resourcesMarkup = nodes.map((node, index) => children({node, index}));

  return (
    <div>
      {/* Load Previous link (above content) */}
      {hasPreviousPage && (
        <button
          onClick={() => handlePaginationClick('previous')}
          className="block text-center text-primary text-[13px] mb-4"
          disabled={isLoading}
        >
          {isLoading && 'Loading...'}
        </button>
      )}

      {/* Grid content */}
      <div
        ref={gridRef}
        className="grid kk grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-[15px]"
      >
        {resourcesClassName ? (
          <div className={resourcesClassName}>{resourcesMarkup}</div>
        ) : (
          resourcesMarkup
        )}
      </div>

      {/* Load More (Next) -- client asked to hide load more as navigation is working*/}
      {/* {hasNextPage && (
        <button
          onClick={() => handlePaginationClick('next')}
          className={`cursor-pointer w-[101px] h-[26px] block mx-auto mt-[10px] text-center text-[13px] border border-gradient-to-r from-[#F4C7BD] to-[#C9A4D0] rounded-[4px] leading-[26px] ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )} */}

      {/* ALWAYS VISIBLE Navigation Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        {/* Previous Button */}
        <button
          onClick={() => handlePaginationClick('previous')}
          disabled={!hasPreviousPage || isLoading}
          className={`w-10 h-10 rounded-lg flex items-center justify-center border border-[#d1d1d1] transition-colors ${
            !hasPreviousPage || isLoading
              ? 'text-gray-400 bg-gray-100 opacity-50 cursor-not-allowed'
              : 'text-black bg-white hover:bg-gray-50 cursor-pointer'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          onClick={() => handlePaginationClick('next')}
          disabled={!hasNextPage || isLoading}
          className={`w-10 h-10 rounded-lg flex items-center justify-center border border-[#d1d1d1] transition-colors ${
            !hasNextPage || isLoading
              ? 'text-gray-400 bg-gray-100 opacity-50 cursor-not-allowed'
              : 'text-black bg-white hover:bg-gray-50 cursor-pointer'
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
