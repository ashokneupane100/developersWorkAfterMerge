'use client';

import { useEffect } from 'react';

export default function ClientScript() {
  useEffect(() => {
    // Page load transition
    document.body.style.opacity = '1';
    
    // Add smooth scrolling
    const handleSmoothScroll = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => anchor.addEventListener('click', handleSmoothScroll));

    return () => {
      anchors.forEach(anchor => anchor.removeEventListener('click', handleSmoothScroll));
    };
  }, []);

  return null;
}