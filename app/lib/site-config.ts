export const siteConfig = {
  name: 'DraftMaster FC',
  description: 'Fantasy football drafting platform with tactical insights',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/draftmasterfc',
    github: 'https://github.com/draftmasterfc',
  },
};

// Get the site URL from environment variables with fallback
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://draftmasterfc.com';

// Ensure the URL doesn't have a trailing slash for consistency
export const siteUrl = baseUrl.replace(/\/$/, '');

/**
 * Generate an absolute URL for a given path
 * @param path - The path to append (e.g., '/terms', '/privacy')
 * @returns Complete absolute URL
 */
export function getAbsoluteUrl(path: string = ''): string {
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

/**
 * Generate canonical URLs for pages
 * @param path - The path for the canonical URL
 * @returns Canonical URL object for Next.js metadata
 */
export function getCanonicalUrl(path: string = '') {
  return {
    canonical: getAbsoluteUrl(path),
  };
}