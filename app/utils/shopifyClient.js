const SHOPIFY_DOMAIN = import.meta.env.PUBLIC_STORE_DOMAIN || 'azt0aw-u9.myshopify.com';
const STOREFRONT_ACCESS_TOKEN =import.meta.env.PUBLIC_STOREFRONT_API_TOKEN || 'df89570a9de86b5e7bb473b43f68ba4d';

export async function fetchStorefront(query, variables = {}, signal = {}) {
  const url = `https://${SHOPIFY_DOMAIN}/api/2025-04/graphql.json`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    signal
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

export const ProfileAPI = {

  async fetchProfile() {
    try {
      
      const response = await fetch('/internal/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
            
      if (response.status === 401) {
        return {
          success: false,
          error: 'User not authenticated',
          requiresLogin: true,
          data: null,
        };
      }
      
      if (response.status === 404) {
        return {
          success: false,
          error: 'Profile API endpoint not found',
          data: null,
        };
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Profile API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.customer) {
        return {
          success: true,
          data: result.customer,
          error: null,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to fetch profile',
          data: null,
        };
      }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
        data: null,
      };
    }
  },

  
  async getUserEmail() {
    const result = await this.fetchProfile();
    return result.success ? result.data?.email || null : null;
  },

    async getUserToken() {
    const result = await this.fetchProfile();
    return {
      email: result.success ? result.data?.email || null : null,
      token: result.success ? result.data?.customerAccessToken || null : null
    }
  },



  async isAuthenticated() {
    const result = await this.fetchProfile();
    return result.success && !!result.data;
  },

  async getProfileData() {
    const result = await this.fetchProfile();
    return result.success ? result.data : null;
  },
};