'use client';

import { useEffect } from 'react';

export default function ClientFadeIn() {
  useEffect(() => {
    // Wait for a short moment to ensure smooth transition
    const timer = setTimeout(() => {
      document.body.classList.remove('opacity-0');
      document.body.classList.add('opacity-100');
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}