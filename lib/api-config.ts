/**
 * API Configuration
 *
 * CUSTOMIZATION REQUIRED:
 * Replace 'your-institution-slug' with your actual institution slug
 * This slug must match the one registered in the backend system
 */

export const API_CONFIG = {
  // Your institution's unique identifier
  INSTITUCION_SLUG: "your-institution-slug",

  // API endpoints
  ENDPOINTS: {
    SUBSCRIBE: "/api/v1/enrollment/subscribe",
    CHECK_DNI: "/api/v1/enrollment/check-dni",
    SUBMIT: "/api/v1/enrollment/submit",
  },

  // API base URL (if different from current domain)
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
}

/**
 * Helper function to build full API URL
 */
export function getApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}
