import { useEffect } from 'react';

/**
 * Lightweight, zero-dependency document metadata hook for React SPAs
 * Ensures correct page title, meta description, and canonical state
 */
export function useSEO({
  title,
  description,
  canonicalUrl = 'https://portfolio-ritik-live.vercel.app/'
}) {
  useEffect(() => {
    const baseTitle = 'Ritik Suthar | Full Stack Developer & MERN Specialist';
    const originalTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const canonicalLink = document.querySelector('link[rel="canonical"]');

    if (title) {
      const fullTitle = `${title} | Ritik Suthar`;
      document.title = fullTitle;
      if (ogTitle) ogTitle.setAttribute('content', fullTitle);
      if (twitterTitle) twitterTitle.setAttribute('content', fullTitle);
    } else {
      document.title = baseTitle;
    }

    if (description && metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    if (canonicalUrl && canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    return () => {
      document.title = originalTitle;
    };
  }, [title, description, canonicalUrl]);
}

export default function SEO({ title, description, canonicalUrl }) {
  useSEO({ title, description, canonicalUrl });
  return null;
}
