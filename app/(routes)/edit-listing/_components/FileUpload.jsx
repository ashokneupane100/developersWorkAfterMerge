"use client";
import Image from 'next/image';
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ImagePlus, Trash2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import imageCompression from 'browser-image-compression';

const IMAGE_CONFIG = {
    maxSizeMB: 1,                 // Max size 1MB
    maxWidthOrHeight: 1200,       // Initial resize 
    useWebWorker: true,
    initialQuality: 0.8
  };

function FileUpload({ setImages, imageList, listingId }) {
    const [imagePreview, setImagePreview] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (imageList) {
            setExistingImages(imageList);
        }
    }, [imageList]);

    const IMAGE_CONFIG = {
        maxSizeMB: 0.5,                // Reduced max size to 500KB
        maxWidthOrHeight: 1200,        // Max width will be 1200px
        useWebWorker: true,
        fileType: 'image/webp',        // WebP for better compression
        initialQuality: 0.8,           // Good quality but smaller size
        alwaysKeepResolution: false,   // Allow resizing
        resize: {
            width: 1200,               // Fixed width
            height: 630,               // Fixed height
            fitType: 'cover'           // Maintain aspect ratio and cover
        }
    };
    
    const compressImage = async (file) => {
        try {
          // First compress if file is too large
          let processedFile = file;
          if (file.size > 1024 * 1024) { // if larger than 1MB
            processedFile = await imageCompression(file, IMAGE_CONFIG);
          }
      
          // Create canvas for exact 1200x630 resizing
          const canvas = document.createElement('canvas');
          canvas.width = 1200;
          canvas.height = 630;
          const ctx = canvas.getContext('2d');
      
          // Load image
          const bitmap = await createImageBitmap(processedFile);
      
          // Calculate dimensions to maintain aspect ratio
          const aspectRatio = bitmap.width / bitmap.height;
          const targetAspectRatio = 1200 / 630;
      
          let sw = bitmap.width;
          let sh = bitmap.height;
          let sx = 0;
          let sy = 0;
      
          if (aspectRatio > targetAspectRatio) {
            sw = bitmap.height * targetAspectRatio;
            sx = (bitmap.width - sw) / 2;
          } else {
            sh = bitmap.width / targetAspectRatio;
            sy = (bitmap.height - sh) / 2;
          }
      
          // Draw image
          ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, 1200, 630);
      
          // Convert to file
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
          
          return new File([blob], file.name, { type: 'image/jpeg' });
        } catch (error) {
          console.error('Image processing error:', error);
          toast.error(`Failed to process ${file.name}. Using original file.`);
          return file;
        }
      };

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files || []);
        const totalImagesCount = existingImages.length + imagePreview.length + files.length;

        if (totalImagesCount > 6) {
            toast.error("Maximum 6 images allowed.");
            return;
        }

        if (files.some(file => !file.type.startsWith('image/'))) {
            toast.error("Please upload only image files.");
            return;
        }

        setProcessing(true);

        try {
            const compressedFiles = await Promise.all(
                files.map(async (file) => {
                    const compressed = await compressImage(file);
                    return compressed;
                })
            );

            const previews = compressedFiles.map(file => URL.createObjectURL(file));
            setImagePreview(prev => [...prev, ...previews].slice(0, 6));
            setImages(prev => [...prev, ...compressedFiles].slice(0, 6));
            toast.success("Images processed successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to process images. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    const removeNewImage = (indexToRemove) => {
        try {
            // Revoke the URL to prevent memory leaks
            URL.revokeObjectURL(imagePreview[indexToRemove]);
            
            setImagePreview(prev => prev.filter((_, index) => index !== indexToRemove));
            setImages(prev => prev.filter((_, index) => index !== indexToRemove));
            
            toast.success("Preview image removed");
        } catch (error) {
            console.error("Error removing preview:", error);
            toast.error("Failed to remove preview image");
        }
    };

    const removeExistingImage = async (indexToRemove) => {
        const imageToRemove = existingImages[indexToRemove];

        // Check if this would remove the last image
        if (existingImages.length === 1 && imagePreview.length === 0) {
            toast.error("Please upload a new image before deleting the last one.");
            return;
        }

        try {
            // Keep a copy of the current state for rollback
            const previousState = [...existingImages];
            
            // Optimistically update UI
            setExistingImages(prev => prev.filter((_, index) => index !== indexToRemove));

            const fileName = imageToRemove.url.split("/").pop();

            // Delete from database
            const { error: dbError } = await supabase
                .from("listingImages")
                .delete()
                .match({
                    listing_id: listingId,
                    url: imageToRemove.url
                });

            if (dbError) {
                console.error("DB Error:", dbError);
                setExistingImages(previousState); // Rollback on error
                toast.error("Failed to remove image from database.");
                return;
            }

            // Delete from storage
            const { error: storageError } = await supabase.storage
                .from("listingImages")
                .remove([fileName]);

            if (storageError) {
                console.error("Storage Error:", storageError);
                // Don't rollback here as the database entry is already deleted
            }

            toast.success("Image removed successfully");
        } catch (error) {
            console.error("Error removing image:", error);
            setExistingImages(imageList); // Rollback to original state
            toast.error("Failed to remove image. Please try again.");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center w-full">
                <label 
                    htmlFor="dropzone-file" 
                    className={`flex flex-col items-center justify-center w-full h-40 
                        border-2 border-gray-300 border-dashed rounded-lg cursor-pointer 
                        bg-gray-50 hover:bg-gray-100 transition-all duration-300
                        ${processing ? 'opacity-50 cursor-wait' : 'hover:border-blue-500'}
                    `}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImagePlus 
                            className={`w-8 h-8 mb-3 text-gray-500 
                                ${processing ? 'animate-pulse' : ''}`} 
                        />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 text-center">
                            Upload up to 6 high-quality images<br />
                            Images will be optimized automatically
                            {processing && <span className="block mt-1 text-blue-500">Processing images...</span>}
                        </p>
                    </div>
                    <input
                        id="dropzone-file"
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                        accept="image/*"
                        disabled={processing || (existingImages.length + imagePreview.length) >= 6}
                    />
                </label>
            </div>

            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {/* Existing Images */}
                {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative group">
                        <div className="relative h-[200px] rounded-lg overflow-hidden">
                            <Image
                                src={image.url}
                                alt={`Image ${index + 1}`}
                                className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                                priority={index < 2}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                            <button
                                onClick={() => removeExistingImage(index)}
                                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white 
                                    opacity-0 group-hover:opacity-100 transition-all duration-300
                                    hover:bg-red-600 hover:scale-110"
                                type="button"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* New Image Previews */}
                {imagePreview.map((image, index) => (
                    <div key={`preview-${index}`} className="relative group">
                        <div className="relative h-[200px] rounded-lg overflow-hidden">
                            <Image
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className="rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                                fill
                                sizes="(max-width: 768px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                            <button
                                onClick={() => removeNewImage(index)}
                                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white 
                                    opacity-0 group-hover:opacity-100 transition-all duration-300
                                    hover:bg-red-600 hover:scale-110"
                                type="button"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Image Count Indicator */}
            {(existingImages.length > 0 || imagePreview.length > 0) && (
                <p className="text-sm text-gray-500 text-center mt-4">
                    {existingImages.length + imagePreview.length}/6 images uploaded
                </p>
            )}
        </div>
    );
}

export default FileUpload;