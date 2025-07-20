"use client";

import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client';
import { Bath, BedDouble, MapPin, Ruler, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { formatCurrency } from '@/components/helpers/formatCurrency';
import { useAuth } from '@/contexts/AuthContext';

function UserListing() {
    const { user, loading: authLoading } = useAuth();
    const [listing, setListing] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            // If admin, fetch all listings, otherwise fetch only user's listings
            const fetchListing = async () => {
                try {
                    let query = supabase
                        .from('listing')
                        .select(`*, listingImages(url, listing_id)`);

                    // If not admin, only show user's listings
                    if (user?.email !== 'ashokabrother@gmail.com') {
                        query = query.eq('createdBy', user?.email);
                    }

                    const { data, error } = await query;

                    if (error) throw error;
                    setListing(data || []);
                } catch (error) {
                    console.error('Error fetching listings:', error);
                    toast.error('Failed to load listings');
                } finally {
                    setLoading(false);
                }
            };

            fetchListing();
        }
    }, [user]);

    // Check if user is admin
    const isAdmin = user?.email === 'ashokabrother@gmail.com';

    const handleEditClick = (e) => {
        if (authLoading) return;
        
        if (!isAdmin) {
            e.preventDefault();
            toast.error("Only administrators can edit listings", {
                description: "Please contact the administrator for any changes.",
                duration: 4000,
            });
        }
    };

    if (loading || authLoading) {
        return <div>Loading...</div>;
    }

    const getListingHeader = () => {
        if (isAdmin) {
            return "Manage All Listings (Admin View)";
        }
        return "Your Listings";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className='font-bold text-2xl'>{getListingHeader()}</h2>
                {isAdmin && (
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        Admin Access
                    </div>
                )}
            </div>

            {!isAdmin && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex items-center">
                        <ShieldAlert className="h-5 w-5 text-yellow-400 mr-2" />
                        <p className="text-sm text-yellow-700">
                            Note: Only administrators can edit listings. Contact admin for any changes.
                        </p>
                    </div>
                </div>
            )}

            {listing.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500">No listings found</p>
                    <Link href="/add-new-listing">
                        <Button className="mt-4">Create your first listing</Button>
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {listing.map((item) => (
                        <div 
                            key={item.id} 
                            className='p-4 border hover:border-primary rounded-lg transition-all duration-200 relative'
                        >
                            <div className='relative'>
                                <div className="absolute top-2 left-2 z-10 flex gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                                        ${item.active ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}
                                    >
                                        {item.active ? 'Published' : 'Draft'}
                                    </span>
                                    {isAdmin && item.createdBy !== user?.email && (
                                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                            Other's Post
                                        </span>
                                    )}
                                </div>
                                <Image 
                                    src={item?.listingImages?.[0]?.url || '/placeholder.svg'}
                                    width={800}
                                    height={150}
                                    className='rounded-lg object-cover h-[200px] w-full'
                                    alt={`Listing ${item.id}`}
                                    priority
                                />
                            </div>

                            <div className='flex mt-4 flex-col gap-3'>
                                <h2 className='font-bold text-xl'>Rs {formatCurrency(item?.price)}</h2>
                                <h2 className='flex items-center gap-2 text-sm text-gray-600'>
                                    <MapPin className='h-4 w-4 flex-shrink-0'/>
                                    <span className="line-clamp-1">{item.address}</span>
                                </h2>

                                {item.propertyType !== 'Land' && (
                                    <div className='grid grid-cols-3 gap-2'>
                                        <div className='flex items-center justify-center gap-1 bg-gray-100 rounded-md p-2'>
                                            <BedDouble className='h-4 w-4 text-gray-600'/>
                                            <span className='text-sm text-gray-600'>{item?.rooms || 0}</span>
                                        </div>
                                        <div className='flex items-center justify-center gap-1 bg-gray-100 rounded-md p-2'>
                                            <Bath className='h-4 w-4 text-gray-600'/>
                                            <span className='text-sm text-gray-600'>{item?.bathrooms || 0}</span>
                                        </div>
                                        <div className='flex items-center justify-center gap-1 bg-gray-100 rounded-md p-2'>
                                            <Ruler className='h-4 w-4 text-gray-600'/>
                                            <span className='text-sm text-gray-600'>{item?.area}</span>
                                        </div>
                                    </div>
                                )}

                                <div className='flex gap-2 mt-2'>
                                    <Link href={`/view-listing/${item.id}`} className="flex-1">
                                        <Button 
                                            variant="outline" 
                                            className="w-full"
                                            size="sm"
                                        >
                                            View
                                        </Button>
                                    </Link>
                                    
                                    {isAdmin ? (
                                        <Link href={`/edit-listing/${item.id}`} className="flex-1">
                                            <Button 
                                                className="w-full bg-blue-600 hover:bg-blue-700"
                                                size="sm"
                                            >
                                                Edit as Admin
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button 
                                            className="w-full flex-1"
                                            size="sm"
                                            onClick={handleEditClick}
                                            variant="secondary"
                                        >
                                            Edit (Admin Only)
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserListing;