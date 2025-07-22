"use client";

import React, { useEffect } from 'react';
import OpenStreetMapSection from '@/app/_components/OpenStreetMapSection.js';
import { formatCurrency } from '@/components/helpers/formatCurrency';
import Image from "next/image";
import { 
  Bath, 
  BedDouble, 
  CarFront, 
  Home, 
  LandPlot,
  MapPin,
  Phone,
  ExternalLink,
  Check,
  PlayCircle
} from 'lucide-react';
import AgentDetail from './AgentDetail';
// import VideoSection from './VideoSection'; // No longer needed for direct embed
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Head from 'next/head';

const FB_APP_ID = '1112654223121169';

function Details({ listingDetail }) {
  if (!listingDetail) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = async (platform) => {
    const baseUrl = 'https://www.onlinehome.com.np';
    const shareUrl = `${baseUrl}/view-listing/${listingDetail.id}`;
    const imageUrl = listingDetail?.listingImages?.[0]?.url || `${baseUrl}/homepageFacebook.jpg`;
    const title = `${listingDetail.propertyType} for ${listingDetail.action} in ${
      listingDetail.address?.split(", Nepal")[0] || ''
    } at Rs ${listingDetail.price} call at ${listingDetail.phone} immediately`;
    const description = listingDetail.description?.substring(0, 155) || 'View property details';

    // Update meta tags before sharing
    const metaTags = document.getElementsByTagName('meta');
    metaTags['og:title']?.setAttribute('content', title);
    metaTags['og:description']?.setAttribute('content', description);
    metaTags['og:image']?.setAttribute('content', imageUrl);
    metaTags['og:url']?.setAttribute('content', shareUrl);

    const shareData = {
      facebook: {
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        width: 626,
        height: 436
      },
      x: {
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
        width: 600,
        height: 400
      },
      linkedin: {
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}&source=onlinehome.com.np`,
        width: 600,
        height: 600
      }
    };

    const share = shareData[platform];
    if (!share) return;

    try {
      const left = (window.screen.width - share.width) / 2;
      const top = (window.screen.height - share.height) / 2;
      const windowFeatures = `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${share.width}, height=${share.height}, top=${top}, left=${left}`;
      
      if (platform === 'facebook') {
        try {
          await fetch(`${baseUrl}/api/purge-facebook-cache`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: shareUrl }),
          });
        } catch (error) {
          console.warn('Error purging Facebook cache:', error);
        }
      }

      window.open(share.url, 'share', windowFeatures);
    } catch (error) {
      toast.error('Failed to share. Please try again.');
    }
  };

  const features = [
    { icon: <Home />, label: 'Property Type', value: listingDetail.propertyType },
    { icon: <LandPlot />, label: 'Total Area', value: listingDetail.area },
    { icon: <BedDouble />, label: 'Bedrooms', value: `${listingDetail.rooms} Rooms` },
    { icon: <Bath />, label: 'Bathrooms', value: `${listingDetail.bathrooms} Bath` },
    { icon: <CarFront />, label: 'Parking', value: `${listingDetail.parking} Parking` }
  ];

  return (
    <>
      <Head>
        <meta property="og:title" content={`${listingDetail.propertyType} for ${listingDetail.action} in ${listingDetail.address?.split(", Nepal")[0] || ''}`} />
        <meta property="og:description" content={listingDetail.description?.substring(0, 155) || 'View property details'} />
        <meta property="og:image" content={listingDetail.listingImages?.[0]?.url || 'https://www.onlinehome.com.np/homepageFacebook.jpg'} />
        <meta property="og:url" content={`https://www.onlinehome.com.np/view-listing/${listingDetail.id}`} />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content={FB_APP_ID} />
      </Head>

      <div className="w-full">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3">
            <div className="flex-grow">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                {listingDetail.post_title}
              </h2>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <MapPin size={16} className="text-green-600" />
                <span>{listingDetail.address}</span>
              </div>
            </div>
            <div className="flex items-end justify-end w-full sm:w-auto flex-wrap gap-2">
              {[{ platform: 'facebook', color: 'bg-blue-600 hover:bg-blue-700', text: 'Facebook Share' },{ platform: 'x', color: 'bg-black hover:bg-gray-800', text: 'Share on X' },{ platform: 'linkedin', color: 'bg-blue-900 hover:bg-blue-800', text: 'LinkedIn Share' }].map((social, index) => (
                <Button 
                  key={index}
                  className={`${social.color} text-white rounded px-3 py-2 text-sm w-full sm:w-auto`}
                  onClick={() => handleShare(social.platform)}
                >
                  {social.text}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm text-center p-2 sm:p-3 border border-gray-200 flex flex-col items-center">
              <div className="p-2 bg-green-50 rounded-full mb-2">
                {React.cloneElement(feature.icon, { size: 20, className: "text-green-600" })}
              </div>
              <p className="text-xs text-gray-500 mb-1">{feature.label}</p>
              <p className="font-medium text-gray-900 text-sm">{feature.value}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 mb-3 sm:mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
            <Check className="text-green-600" /> Property Highlights
          </h2>
          <p className="text-gray-800 leading-relaxed whitespace-pre-line text-sm">{listingDetail.description}</p>
        </div>

        {/* Embedded YouTube Videos - ONLY above the Map */}
        {Array.isArray(listingDetail?.listingVideos) && listingDetail.listingVideos.length > 0 && (
          <div className="mb-3 sm:mb-4 space-y-3 sm:space-y-4">
            {listingDetail.listingVideos.map((video, idx) => {
              // Extract YouTube video ID from various URL formats, including Shorts
              let videoId = null;
              const url = video.url || "";
              const patterns = [
                /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
                /youtube\.com\/watch\?.*v=([\w-]{11})/
              ];
              for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match) {
                  videoId = match[1];
                  break;
                }
              }
              if (!videoId) return null;
              return (
                <div key={idx} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                  <div className="aspect-video w-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`Property Video ${idx + 1}`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Map */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 sm:mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2 sm:mb-3 p-2 sm:p-4 pb-0 flex items-center gap-2">
            <MapPin className="text-green-600" /> Location on Map
          </h2>
          <div className="p-2 sm:p-4 pt-0">
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <div className="h-[250px] sm:h-[300px] md:h-[350px] relative">
                <OpenStreetMapSection
                  coordinates={listingDetail.coordinates}
                  listing={[listingDetail]}
                  className="w-full h-full absolute inset-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Agent */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 sm:mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-2 sm:mb-3 p-2 sm:p-4 pb-0 flex justify-center items-center gap-2">
            <Phone className="text-green-600" /> Contact Agent
          </h2>
          <div className="p-2 sm:p-4 pt-0">
            <AgentDetail listingDetail={listingDetail} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Details;