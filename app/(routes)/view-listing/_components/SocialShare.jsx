"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

const SocialShare = ({ listingDetail }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && listingDetail) {
      setShareUrl(window.location.href);
      setTitle(`${listingDetail.propertyType} for ${listingDetail.action} in ${
        listingDetail.address?.split(", Nepal")[0] || ''
      } at Rs ${listingDetail.price}`);
    }
  }, [listingDetail]);

  const handleShare = async (platform) => {
    if (!shareUrl) return;

    const shareData = {
      facebook: {
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        width: 626,
        height: 436
      },
      twitter: {
        url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
        width: 600,
        height: 400
      },
      linkedin: {
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
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
      
      window.open(share.url, 'share', windowFeatures);
    } catch (error) {
      toast.error('Failed to share. Please try again.');
    }
  };

  return (
    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
      <Button 
        className="flex items-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-full"
        onClick={() => handleShare('facebook')}
      >
        <Facebook size={20} />
        <span className="hidden sm:inline">Share on Facebook</span>
      </Button>
      
      <Button 
        className="flex items-center gap-2 w-full sm:w-auto bg-black hover:bg-gray-800 text-white shadow-md rounded-full"
        onClick={() => handleShare('twitter')}
      >
        <span className="font-bold text-lg">X</span>
        <span className="hidden sm:inline">Share on X</span>
      </Button>
      
      <Button 
        className="flex items-center gap-2 w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white shadow-md rounded-full"
        onClick={() => handleShare('linkedin')}
      >
        <Linkedin size={20} />
        <span className="hidden sm:inline">Share on LinkedIn</span>
      </Button>
    </div>
  );
};

export default SocialShare;