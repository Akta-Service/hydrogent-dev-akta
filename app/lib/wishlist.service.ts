// Wishlist Service for external API integration
export interface WishlistItem {
  id: string;
  productId: string;
  variantId?: string;
  title: string;
  handle: string;
  price: string;
  image?: {
    url: string;
    altText?: string;
  };
  createdAt?: string;
}

export interface WishlistResponse {
  success: boolean;
  data?: WishlistItem[];
  message?: string;
}

export class WishlistService {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://api.belloDiamonds.com/api/wishlist') {
    this.baseUrl = baseUrl;
  }

  /**
   * Get user's wishlist items
   */
  async getWishlist(userId: string): Promise<WishlistResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: Array.isArray(data) ? data : (data as any)?.products || [],
      };
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch wishlist',
      };
    }
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(
    userId: string, 
    productData: Omit<WishlistItem, 'id' | 'createdAt'>
  ): Promise<WishlistResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: [productData.productId], // Based on your API screenshot
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: Array.isArray(data) ? data : (data as any)?.products || [],
        message: 'Product added to wishlist successfully',
      };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add product to wishlist',
      };
    }
  }

  /**
   * Remove product from wishlist
   */
  async removeFromWishlist(userId: string, productId: string): Promise<WishlistResponse> {
    try {
      // Note: You might need to implement a DELETE endpoint or modify the API call
      // For now, I'll assume we need to send an updated products array without the removed item
      const currentWishlist = await this.getWishlist(userId);
      
      if (!currentWishlist.success || !currentWishlist.data) {
        throw new Error('Failed to get current wishlist');
      }

      const updatedProducts = currentWishlist.data
        .filter(item => item.productId !== productId)
        .map(item => item.productId);

      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products: updatedProducts,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: Array.isArray(data) ? data : (data as any)?.products || [],
        message: 'Product removed from wishlist successfully',
      };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to remove product from wishlist',
      };
    }
  }

  /**
   * Check if product is in wishlist
   */
  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const wishlist = await this.getWishlist(userId);
      if (!wishlist.success || !wishlist.data) return false;
      
      return wishlist.data.some(item => item.productId === productId);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  }

  /**
   * Toggle product in wishlist (add if not present, remove if present)
   */
  async toggleWishlist(
    userId: string, 
    productData: Omit<WishlistItem, 'id' | 'createdAt'>
  ): Promise<WishlistResponse> {
    try {
      const isInWishlist = await this.isInWishlist(userId, productData.productId);
      
      if (isInWishlist) {
        return await this.removeFromWishlist(userId, productData.productId);
      } else {
        return await this.addToWishlist(userId, productData);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to toggle wishlist',
      };
    }
  }
}

// Export singleton instance
export const wishlistService = new WishlistService();