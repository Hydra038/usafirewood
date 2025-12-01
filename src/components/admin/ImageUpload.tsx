'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface ImageUploadProps {
  productId?: string;
  existingImages?: Array<{
    id: string;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
  }>;
  onImagesChange: (images: Array<{ url: string; isPrimary: boolean; altText: string }>) => void;
}

export default function ImageUpload({ productId, existingImages = [], onImagesChange }: ImageUploadProps) {
  const [images, setImages] = useState<Array<{ url: string; isPrimary: boolean; altText: string; file?: File }>>(
    existingImages.map(img => ({
      url: img.image_url,
      isPrimary: img.is_primary,
      altText: img.alt_text || '',
    }))
  );
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Please select valid image files');
      return;
    }

    setUploading(true);

    const newImages = await Promise.all(
      imageFiles.map(async (file) => {
        // For new uploads, create a temporary URL for preview
        const tempUrl = URL.createObjectURL(file);
        return {
          url: tempUrl,
          isPrimary: images.length === 0, // First image is primary
          altText: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          file, // Store file for actual upload later
        };
      })
    );

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
    setUploading(false);
  };

  const uploadToSupabase = async (file: File, productIdForUpload: string): Promise<string | null> => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${productIdForUpload}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    
    // If we removed the primary image, make the first remaining image primary
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    
    setImages(newImages);
    onImagesChange(newImages);
  };

  const setPrimaryImage = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setImages(newImages);
    onImagesChange(newImages);
  };

  const updateAltText = (index: number, altText: string) => {
    const newImages = [...images];
    newImages[index].altText = altText;
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Expose upload function for parent component
  const uploadAllImages = async (productIdForUpload: string) => {
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        if (image.file) {
          // Upload new image
          const publicUrl = await uploadToSupabase(image.file, productIdForUpload);
          return publicUrl ? { ...image, url: publicUrl, file: undefined } : null;
        }
        // Keep existing image
        return image;
      })
    );

    return uploadedImages.filter((img): img is { url: string; isPrimary: boolean; altText: string } => img !== null);
  };

  // Store upload function in a ref so parent can call it
  (ImageUpload as any).uploadAllImages = uploadAllImages;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="space-y-3">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div>
            <button
              type="button"
              onClick={handleButtonClick}
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Click to upload
            </button>
            <span className="text-gray-600"> or drag and drop</span>
          </div>
          
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF, WebP up to 5MB
          </p>
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative border-2 rounded-lg p-2 ${
                image.isPrimary ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
              }`}
            >
              {/* Image */}
              <div className="relative aspect-square mb-2">
                <Image
                  src={image.url}
                  alt={image.altText || 'Product image'}
                  fill
                  className="object-cover rounded"
                />
              </div>

              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs px-2 py-1 rounded font-semibold">
                  Primary
                </div>
              )}

              {/* Alt Text Input */}
              <input
                type="text"
                value={image.altText}
                onChange={(e) => updateAltText(index, e.target.value)}
                placeholder="Alt text"
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 mb-2"
              />

              {/* Actions */}
              <div className="flex gap-2">
                {!image.isPrimary && (
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(index)}
                    className="flex-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 rounded font-medium"
                  >
                    Set Primary
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="flex-1 text-xs bg-red-600 hover:bg-red-700 text-white py-1 rounded font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-sm text-gray-600">Processing images...</p>
        </div>
      )}
    </div>
  );
}
