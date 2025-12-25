'use client';

import { getAbsoluteUrl } from '@/app/lib/site-config';
import { useEffect } from 'react';

export default function PrivacySchema() {
  useEffect(() => {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Privacy Policy - DraftMaster FC',
        description: 'Privacy policy outlining how DraftMaster FC collects, uses, and protects your personal data.',
        dateModified: '2024-10-24',
        mainEntity: {
          '@type': 'CreativeWork',
          name: 'Privacy Policy',
          datePublished: '2024-10-24',
          copyrightYear: 2024,
          publisher: {
            '@type': 'Organization',
            name: 'DraftMaster FC',
            url: getAbsoluteUrl('/')
          }
        }
      }

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