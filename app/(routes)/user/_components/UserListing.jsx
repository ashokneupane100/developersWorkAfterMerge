"use client";

import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client';
import { Bath, BedDouble, MapPin, Ruler, ShieldAlert, Trash2, Edit } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { formatCurrency } from '@/components/helpers/formatCurrency';
import { useAuth } from '@/contexts/AuthContext';

function UserListing() {
    const { user, profile, loading: authLoading } = useAuth();
    const [listing, setListing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (user) {
            // If admin, fetch all listings, otherwise fetch only user's listings
            const fetchListing = async () => {
                try {
                    let query = supabase
                        .from('listing')
                        .select(`*, listingImages(url, listing_id)`);

                    // If not admin, only show user's listings (agents can only see their own)
                    if (!isAdmin) {
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

    // Check user roles (using the enum values from database)
    const isAdmin = profile?.user_role === 'Admin' || user?.email === 'ashokabrother@gmail.com';
    const isAgent = profile?.user_role === 'Agent';

    const handleEditClick = (e) => {
        if (authLoading) return;
        
        if (!isAdmin && !isAgent) {
            e.preventDefault();
            toast.error("Only administrators and agents can edit listings", {
                description: "Please contact the administrator for any changes.",
                duration: 4000,
            });
        }
    };

    // Check if user can edit a specific listing
    const canEditListing = (listingCreatedBy) => {
        if (isAdmin) return true; // Admin can edit all
        if (isAgent && listingCreatedBy === user?.email) return true; // Agent can only edit their own
        return false;
    };

    const handleDeleteClick = async (itemId, itemTitle) => {
        if (!isAdmin) {
            toast.error("Only administrators can delete listings", {
                description: "Please contact the administrator for any changes.",
                duration: 4000,
            });
            return;
        }

        if (!confirm(`Are you sure you want to delete "${itemTitle}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingId(itemId);
        try {
            const { error } = await supabase
                .from('listing')
                .delete()
                .eq('id', itemId);

            if (error) throw error;

            toast.success('Listing deleted successfully');
            // Remove the deleted item from the list
            setListing(prev => prev.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error deleting listing:', error);
            toast.error('Failed to delete listing');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading || authLoading) {
        return <div>Loading...</div>;
    }

    const getListingHeader = () => {
        if (isAdmin) {
            return "Manage All Listings (Admin View)";
        }
        if (isAgent) {
            return "Your Listings (Agent View)";
        }
        return "Your Listings";
    };

    const getRoleBadge = () => {
        if (isAdmin) {
            return <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Admin Access</div>;
        }
        if (isAgent) {
            return <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Agent Access</div>;
        }
        return null;
    };

    const getPermissionMessage = () => {
        if (isAdmin) {
            return "You have full access to edit and delete all listings.";
        }
        if (isAgent) {
            return "You can edit only your own listings. Contact admin for other changes.";
        }
        return "Only administrators and agents can edit listings. Contact admin for any changes.";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className='font-bold text-2xl'>{getListingHeader()}</h2>
                {getRoleBadge()}
            </div>

            <div className={`border-l-4 p-4 mb-4 ${
                isAdmin ? 'bg-green-50 border-green-400' : 
                isAgent ? 'bg-blue-50 border-blue-400' : 
                'bg-yellow-50 border-yellow-400'
            }`}>
                <div className="flex items-center">
                    <ShieldAlert className={`h-5 w-5 mr-2 ${
                        isAdmin ? 'text-green-400' : 
                        isAgent ? 'text-blue-400' : 
                        'text-yellow-400'
                    }`} />
                    <p className={`text-sm ${
                        isAdmin ? 'text-green-700' : 
                        isAgent ? 'text-blue-700' : 
                        'text-yellow-700'
                    }`}>
                        {getPermissionMessage()}
                    </p>
                </div>
            </div>

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
                                    
                                    {canEditListing(item.createdBy) ? (
                                        <Link href={`/edit-listing/${item.id}`} className="flex-1">
                                            <Button 
                                                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                                                size="sm"
                                            >
                                                <Edit className="h-4 w-4" />
                                                {isAdmin ? 'Edit as Admin' : 'Edit as Agent'}
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button 
                                            className="w-full flex-1"
                                            size="sm"
                                            onClick={handleEditClick}
                                            variant="secondary"
                                            disabled
                                        >
                                            {isAgent && item.createdBy !== user?.email ? 'Edit (Your Posts Only)' : 'Edit (Admin/Agent Only)'}
                                        </Button>
                                    )}
                                </div>

                                {/* Delete button - only for admin */}
                                {isAdmin && (
                                    <Button 
                                        className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white border-red-600 flex items-center justify-center gap-2"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteClick(item.id, item.post_title || 'Untitled Property')}
                                        disabled={deletingId === item.id}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        {deletingId === item.id ? 'Deleting...' : 'Delete Listing'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UserListing;