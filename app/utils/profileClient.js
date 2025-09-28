// Profile API Client utility
// This utility provides client-side functions to interact with the profile API

/**
 * Fetch current user profile from the API
 * @returns {Promise<Object>} Profile data or error
 */
export async function fetchUserProfile() {
  try {
    
    const response = await fetch('/api/profile', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    
    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: 'User not authenticated',
          requiresLogin: true,
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data: data.customer,
      error: null,
    };
    
  } catch (error) {
    console.error('ProfileClient: Error fetching profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile',
      data: null,
    };
  }
}

/**
 * Get user email from profile API
 * @returns {Promise<string|null>} User email or null if not authenticated
 */
export async function getUserEmail() {
  try {
    const result = await fetchUserProfile();
    
    if (result.success && result.data?.email) {
      return result.data.email;
    }
    
    return null;
    
  } catch (error) {
    console.error('ProfileClient: Error getting user email:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user is logged in
 */
export async function isUserAuthenticated() {
  try {
    const result = await fetchUserProfile();
    return result.success && !!result.data;
  } catch (error) {
    console.error('ProfileClient: Error checking authentication:', error);
    return false;
  }
}

/**
 * Get user profile with error handling for React components
 * @returns {Promise<Object>} Profile result with loading states
 */
export async function getProfileForComponent() {
  const startTime = Date.now();
  
  try {
    const result = await fetchUserProfile();
    const loadTime = Date.now() - startTime;
    
    
    return {
      ...result,
      loadTime,
      timestamp: new Date().toISOString(),
    };
    
  } catch (error) {
    const loadTime = Date.now() - startTime;
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null,
      loadTime,
      timestamp: new Date().toISOString(),
    };
  }
}