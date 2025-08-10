import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Property - OnlineHome',
  description: 'Submit your property requirements and let us find the perfect match for you on OnlineHome - Nepal\'s trusted real estate platform.',
  openGraph: {
    title: 'Request Property - OnlineHome',
    description: 'Submit your property requirements and let us find the perfect match for you on OnlineHome - Nepal\'s trusted real estate platform.',
    url: 'https://www.onlinehome.com.np/request-property',
    siteName: 'OnlineHome',
    images: [
      {
        url: 'https://www.onlinehome.com.np/property-request-og.png',
        width: 1200,
        height: 630,
        alt: 'Request Property - OnlineHome',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Request Property - OnlineHome',
    description: 'Submit your property requirements and let us find the perfect match for you on OnlineHome.',
    images: ['https://www.onlinehome.com.np/property-request-og.png'],
  },
  alternates: {
    canonical: 'https://www.onlinehome.com.np/request-property',
  },
};

export default function RequestPropertyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  );
}
