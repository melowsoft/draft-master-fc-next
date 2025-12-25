'use client';

import { useEffect } from 'react';

export default function TermsSchema() {
  useEffect(() => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Terms of Service',
      description: 'Terms of service for DraftMaster FC.',
      dateModified: '2025-12-24',
      mainEntity: {
        '@type': 'CreativeWork',
        name: 'Terms of Service',
        datePublished: '2025-12-24',
        text: 'Terms and conditions governing the use of DraftMaster FC platform.',
        copyrightYear: 2025
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}