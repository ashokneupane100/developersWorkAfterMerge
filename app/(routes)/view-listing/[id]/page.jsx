import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import ViewListing from './ViewListing';

const FB_APP_ID = '1112654223121169';
const FB_APP_SECRET = 'a0a3c1daa704548be926d80c578dd370';

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY,
  {
    auth: {
      persistSession: false
    }
  }
);

async function getFacebookAccessToken() {
  try {
    const response = await fetch(
      `https://graph.facebook.com/oauth/access_token?client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&grant_type=client_credentials`
    );
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Failed to get Facebook access token:', error);
    return null;
  }
}

async function purgeFacebookCache(url) {
  try {
    const accessToken = await getFacebookAccessToken();
    if (!accessToken) return false;

    const response = await fetch(
      `https://graph.facebook.com/v18.0/?id=${encodeURIComponent(url)}&scrape=true&access_token=${accessToken}`,
      { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    const data = await response.json();
    return response.ok && data;
  } catch (error) {
    console.error('Failed to purge Facebook cache:', error);
    return false;
  }
}

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const headersList = await headers();
  const fullUrl = `https://www.onlinehome.com.np/view-listing/${params.id}`;
  const userAgent = headersList.get('user-agent')?.toLowerCase() || '';
  
  const isSocialCrawler = (
    userAgent.includes('facebookexternalhit') ||
    userAgent.includes('twitterbot') ||
    userAgent.includes('linkedinbot') ||
    userAgent.includes('whatsapp') ||
    userAgent.includes('telegram') ||
    userAgent.includes('viber')
  );

  try {
    const { data: listing, error } = await supabase
      .from('listing')
      .select('*, listingImages(url)')
      .eq('id', params.id)
      .single();

    if (error || !listing) {
      console.error('Supabase error:', error);
      return {
        title: 'Property Not Found',
        description: 'The requested property listing could not be found.',
        robots: { index: false }
      };
    }

    // Get the first image from the listing's images
    const firstImage = listing.listingImages?.[0]?.url;
    
    // Fix the image URL - remove any duplicate paths
    let imageUrl;
    if (firstImage) {
      // Make sure we're not duplicating the storage URL
      if (firstImage.startsWith('http')) {
        imageUrl = firstImage;
      } else {
        // This is just the filename, so prepend the storage URL
        imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${firstImage}`;
      }
    } else {
      imageUrl = 'https://www.onlinehome.com.np/homepageFacebook.jpg';
    }
      
    // Create a property title
    const propertyTitle = `${listing.propertyType || 'Property'} for ${listing.action || 'Sale/Rent'} in ${listing.address?.split(', Nepal')[0] || 'Nepal'}`;
    const description = listing.description 
      ? listing.description.substring(0, 150) + '...' 
      : `Find this ${listing.propertyType || 'property'} and more on OnlineHome - Nepal's trusted real estate platform.`;

    if (isSocialCrawler) {
      await purgeFacebookCache(fullUrl);
    }

    console.log("Using image URL:", imageUrl); // Debug output

    return {
      title: propertyTitle,
      description: description,
      metadataBase: new URL('https://www.onlinehome.com.np'),
      openGraph: {
        title: propertyTitle,
        description: description,
        url: fullUrl,
        siteName: 'onlinehome.com.np',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: propertyTitle,
            type: 'image/jpeg',
          }
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: propertyTitle,
        description: description,
        creator: '@room_and_home',
        site: '@room_and_home',
        images: {
          url: imageUrl,
          alt: propertyTitle
        }
      },
      alternates: {
        canonical: fullUrl,
      },
      robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
        googleBot: {
          index: true,
          follow: true,
        },
      },
      verification: {
        google: 'dnGQ_kVUDLmTQwPb4dTLXkMHlIJe4d0rjYQ8jJkDCrc',
      },
      other: {
        'fb:app_id': '1112654223121169',
        'viber:image': imageUrl,
        'viber:title': propertyTitle,
        'viber:description': description,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Property Listing',
      description: 'View property details on onlinehome.com.np',
      robots: { index: false }
    };
  }
}

export default function Page({ params }) {
  return <ViewListing params={params} />;
}

export function formatCurrency(number) {
  if (isNaN(number)) {
    return "Invalid Number";
  }

  const hundred = 100;
  const thousand = 1000;
  const lakh = 100000;
  const crore = 10000000;

  if (number >= crore) {
    return `${Math.floor(number / crore)} Crore ${formatCurrency(number % crore)}`.replace(/^\s+|\s+$/g, '');
  } else if (number >= lakh) {
    return `${Math.floor(number / lakh)} Lakh ${formatCurrency(number % lakh)}`.replace(/^\s+|\s+$/g, '');
  } else if (number >= thousand) {
    return `${Math.floor(number / thousand)} Thousand ${formatCurrency(number % thousand)}`.replace(/^\s+|\s+$/g, '');
  } else if (number >= hundred) {
    return `${Math.floor(number / hundred)} Hundred ${formatCurrency(number % hundred)}`.replace(/^\s+|\s+$/g, '');
  } else {
    return number === 0 ? '' : `${number}`; // Return empty string for 0 to avoid trailing '0'
  }
}