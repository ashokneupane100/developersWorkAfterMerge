export const metadata = {
  title: 'Monthly EMI Calculator - OnlineHome Nepal',
  description: 'Calculate your monthly home loan EMI instantly. Find out how much you can afford for your dream home or car.',
  metadataBase: new URL('https://onlinehome.com.np'),
  openGraph: {
    type: 'website',
    url: 'https://onlinehome.com.np/kistacalculator',
    title: 'सजिलैसंग घर गाडीको किस्ता पत्ता लगाउनुहोस-By onlinehome.com.np ',
    description: 'Calculate your monthly home loan EMI instantly. Find out how much you can afford for your dream home or car.',
    siteName: 'OnlineHome Nepal',
    images: [{
      url: 'https://onlinehome.com.np/masikKista.png', // Use absolute URL
      width: 1200,
      height: 630,
      alt: 'EMI Calculator',
    }],
  },
  facebook: {
    appId: '1112654223121169',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@room_and_home',
    creator: '@room_and_home',
    title: 'सजिलैसंग घर गाडीको किस्ता पत्ता लगाउनुहोस-By onlinehome.com.np',
    description: 'Calculate your monthly home loan EMI instantly. Find out how much you can afford for your dream home or car.',
    images: [{
      url: 'https://onlinehome.com.np/masikKista.png', // Use absolute URL
      alt: 'EMI Calculator'
    }]
  },
  alternates: {
    canonical: 'https://onlinehome.com.np/kistacalculator',
  }
};
  
  export default function Layout({ children }) {
    return children;
  }