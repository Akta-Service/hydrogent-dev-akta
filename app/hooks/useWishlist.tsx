import React, { createContext, useContext, useReducer, useEffect, useCallback, useState, useRef } from 'react';
import { wishlistService, type WishlistItem } from '~/lib/wishlist.service';
import { ProfileAPI } from '~/utils/shopifyClient';

// Wishlist State Interface
interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// Action Types
type WishlistAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: WishlistItem[] }
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'SET_INITIALIZED'; payload: boolean };

// Initial State
const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  isInitialized: false,
};

// Reducer
function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload, error: null };
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        error: null,
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.productId !== action.payload),
        error: null,
      };
    case 'CLEAR_WISHLIST':
      return { ...state, items: [], error: null };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    default:
      return state;
  }
}

// Context Interface
interface WishlistContextType {
  state: WishlistState;
  addToWishlist: (productData: Omit<WishlistItem, 'id' | 'createdAt'>) => Promise<boolean>; // Now handles toggle behavior
  removeFromWishlist: (productId: string) => Promise<boolean>;
  toggleWishlist: (productData: Omit<WishlistItem, 'id' | 'createdAt'>) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  loadWishlist: () => Promise<void>;
  clearWishlist: () => void;
  getWishlistCount: () => number;
}

// Create Context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Add a cache for wishlist data
const wishlistCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Provider Component
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const wishlistRequestRef = useRef<Promise<any> | null>(null);

  // Get user email from profile API
  const getUserEmail = useCallback(async (): Promise<string | null> => {
    try {
      const email = await ProfileAPI.getUserEmail();
      
      if (email) {
        setUserEmail(email);
        return email;
      }
      
      return null;
    } catch (error) {
      console.error('useWishlist: Error getting user email via ProfileAPI:', error);
      return null;
    }
  }, []);

  // Optimized wishlist loading with caching
  const loadWishlist = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const email = userEmail || await getUserEmail();
      
      if (!email) {
        dispatch({ type: 'SET_ITEMS', payload: [] });
        dispatch({ type: 'SET_ERROR', payload: null });
        return;
      }
      
      // Check cache first
      const cacheKey = `wishlist_${email}`;
      const cachedData = wishlistCache.get(cacheKey);
      const now = Date.now();
      
      if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
        dispatch({ type: 'SET_ITEMS', payload: cachedData.data });
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_INITIALIZED', payload: true });
        return;
      }
      
      // Prevent duplicate requests
      if (wishlistRequestRef.current) {
        await wishlistRequestRef.current;
        return;
      }
      
      const apiUrl = `https://api.belloDiamonds.com/api/wishlist/${encodeURIComponent(email)}`;
      
      // Create and store the request promise
      wishlistRequestRef.current = fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const response = await wishlistRequestRef.current;
      wishlistRequestRef.current = null; // Clear the reference
      
      if (!response.ok) {
        if (response.status === 404) {
          dispatch({ type: 'SET_ITEMS', payload: [] });
          // Cache empty result
          wishlistCache.set(cacheKey, {
            data: [],
            timestamp: now
          });
          return;
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json() as {
        data?: {
          products?: WishlistItem[] | string[];
        };
      };
      
      const productsData = data.data?.products || [];
      
      if (productsData.length === 0) {
        dispatch({ type: 'SET_ITEMS', payload: [] });
        // Cache empty result
        wishlistCache.set(cacheKey, {
          data: [],
          timestamp: now
        });
        return;
      }
      
      let wishlistItems: WishlistItem[];
      if (typeof productsData[0] === 'string') {
        wishlistItems = (productsData as string[]).map(productId => ({
          id: `item_${Date.now()}_${Math.random()}`,
          productId,
          title: '', 
          handle: '',
          variantId: '',
          price: '',
          image: { url: '', altText: '' },
          createdAt: new Date().toISOString(),
        }));
      } else {
        wishlistItems = productsData as WishlistItem[];
      }
      
      dispatch({ type: 'SET_ITEMS', payload: wishlistItems });
      
      // Cache the result
      wishlistCache.set(cacheKey, {
        data: wishlistItems,
        timestamp: now
      });
      
    } catch (error) {
      dispatch({ type: 'SET_ITEMS', payload: [] });
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load wishlist' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_INITIALIZED', payload: true });
    }
  }, [userEmail, getUserEmail]);

  // Optimized addToWishlist with better state management
  const addToWishlist = useCallback(async (
    productData: Omit<WishlistItem, 'id' | 'createdAt'>
  ): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const email = userEmail || await getUserEmail();
      
      if (!email) {
        dispatch({ type: 'SET_ERROR', payload: 'Please login to add items to wishlist' });
        return false;
      }
      
      // Update local state optimistically
      const newItem: WishlistItem = {
        ...productData,
        id: `temp_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      
      // Check if item already exists
      const existingItemIndex = state.items.findIndex(item => item.productId === productData.productId);
      let updatedItems: WishlistItem[];
      
      if (existingItemIndex !== -1) {
        // Remove item if it exists (toggle behavior)
        updatedItems = state.items.filter(item => item.productId !== productData.productId);
        dispatch({ type: 'REMOVE_ITEM', payload: productData.productId });
      } else {
        // Add new item
        updatedItems = [...state.items, newItem];
        dispatch({ type: 'ADD_ITEM', payload: newItem });
      }
      
      // Clear cache for this user
      const cacheKey = `wishlist_${email}`;
      wishlistCache.delete(cacheKey);
      
      // Make API call in background
      const apiUrl = `https://api.belloDiamonds.com/api/wishlist/${encodeURIComponent(email)}`;
      
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: updatedItems, 
        }),
      }).catch(error => {
        console.error('Background wishlist update failed:', error);
        // Revert optimistic update on error
        if (existingItemIndex !== -1) {
          dispatch({ type: 'ADD_ITEM', payload: state.items[existingItemIndex] });
        } else {
          dispatch({ type: 'REMOVE_ITEM', payload: productData.productId });
        }
      });
      
      return true;
      
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to update wishlist' 
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [userEmail, getUserEmail, state.items]);

  // Optimized removeFromWishlist with better error handling
  const removeFromWishlist = useCallback(async (productId: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const email = userEmail || await getUserEmail();
      
      if (!email) {
        dispatch({ type: 'SET_ERROR', payload: 'Please login to manage wishlist' });
        return false;
      }
      
      // Update local state optimistically
      const updatedWishlistItems = state.items.filter(item => item.productId !== productId);
      dispatch({ type: 'REMOVE_ITEM', payload: productId });
      
      // Clear cache for this user
      const cacheKey = `wishlist_${email}`;
      wishlistCache.delete(cacheKey);
      
      // Make API call in background
      const apiUrl = `https://api.belloDiamonds.com/api/wishlist/${encodeURIComponent(email)}`;
      
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: updatedWishlistItems,
        }),
      }).catch(error => {
        console.error('Background wishlist update failed:', error);
        // Revert optimistic update on error
        const removedItem = state.items.find(item => item.productId === productId);
        if (removedItem) {
          dispatch({ type: 'ADD_ITEM', payload: removedItem });
        }
      });
      
      return true;
      
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to remove from wishlist' 
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [userEmail, getUserEmail, state.items]);

  const isInWishlist = useCallback((productId: string): boolean => {
    return state.items.some(item => item.productId === productId);
  }, [state.items]);

  const toggleWishlist = useCallback(async (
    productData: Omit<WishlistItem, 'id' | 'createdAt'>
  ): Promise<boolean> => {
    return await addToWishlist(productData);
  }, [addToWishlist]);

  const clearWishlist = useCallback(() => {
    dispatch({ type: 'CLEAR_WISHLIST' });
  }, []);

  const getWishlistCount = useCallback((): number => {
    return state.items.length;
  }, [state.items.length]);

  // Optimize initialization effect
  useEffect(() => {
    let isMounted = true;
    
    if (!state.isInitialized) {
      (async () => {
        const email = await getUserEmail(); 
        if (isMounted) {
          await loadWishlist();
        }
      })();
    }
    
    return () => {
      isMounted = false;
    };
  }, [loadWishlist, getUserEmail, state.isInitialized]);

  const contextValue: WishlistContextType = {
    state,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    loadWishlist,
    clearWishlist,
    getWishlistCount,
  };

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  
  return context;
}

export function useWishlistItem(productId: string) {
  const { isInWishlist, toggleWishlist, state } = useWishlist();
  
  const isInList = isInWishlist(productId);
  const isLoading = state.loading;
  
  const toggle = useCallback(async (productData: Omit<WishlistItem, 'id' | 'createdAt'>) => {
    return await toggleWishlist(productData);
  }, [toggleWishlist]);
  
  return {
    isInWishlist: isInList,
    isLoading,
    toggle,
  };
}