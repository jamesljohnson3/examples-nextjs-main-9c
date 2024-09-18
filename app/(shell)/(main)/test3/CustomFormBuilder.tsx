"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"; 
import {
  PlusIcon,
  MinusIcon,
  Image,
} from 'lucide-react';

interface ImageUploaderProps {
  onImageChange: (type: 'gallery' | 'primary', imageURL: string | null) => void; 
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [imageGallery, setImageGallery] = useState<string[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);

  // Mock data for preview
  const productData = primaryPhoto ? {
    name: "Sample Product",
    description: "This is a description of the product.",
    price: 29.99,
    quantity: 10,
    category: "Category Name"
  } : null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'primary') => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const imageUrls = fileArray.map(file => {
        const reader = new FileReader();
        return new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imageUrls).then(urls => {
        if (type === 'gallery') {
          setImageGallery(prevGallery => [...prevGallery, ...urls]);
        } else {
          setPrimaryPhoto(urls[0]);
        }
        onImageChange(type, type === 'gallery' ? urls[0] : urls[0]); // Notify parent component
      }).catch(error => {
        console.error('Error reading file:', error);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedGallery = [...imageGallery];
    updatedGallery.splice(index, 1);
    setImageGallery(updatedGallery);
  };

  const handleRemovePrimary = () => {
    setPrimaryPhoto(null);
    onImageChange('primary', null); // Notify parent component
  };

  return (
    <div>
      {/* Product Preview Section */}
      <div className="rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 h-auto p-6">
        {productData ? (
          <div className="relative w-full mb-4">
            {/* Responsive Placeholder Image */}
            <div className="w-full" style={{ paddingBottom: '56.25%' }}>
              <img
                src={primaryPhoto || 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg'}
                alt="Primary Preview"
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
            <h2 className="text-lg font-bold mb-2">{productData.name}</h2>
            <p className="text-sm text-gray-500">{productData.description}</p>
            <p className="text-md font-bold">${productData.price.toFixed(2)}</p>
            <p className="text-sm">Quantity: {productData.quantity}</p>
            <p className="text-sm">Category: {productData.category}</p>
          </div>
        ) : (
          <p>No product data available.</p>
        )}
      </div>

      {/* Primary Photo Section */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">Primary Photo</h3>
        <div className="flex items-center space-x-2">
          {primaryPhoto ? (
            <div className="relative w-16 h-16">
              <img
                src={primaryPhoto}
                alt="Primary"
                className="w-full h-full object-cover rounded"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-0 right-0 h-4 w-4 p-0"
                onClick={handleRemovePrimary}
              >
                <MinusIcon className="h-2 w-2" />
              </Button>
            </div>
          ) : (
            <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'primary')}
                accept="image/*"
              />
              <Image className="h-6 w-6 text-muted-foreground" />
            </label>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">Image Gallery</h3>
        <div className="flex flex-wrap gap-2">
          {imageGallery.map((img, index) => (
            <div key={index} className="relative w-16 h-16">
              <img
                src={img}
                alt={`Gallery ${index}`}
                className="w-full h-full object-cover rounded"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-0 right-0 h-4 w-4 p-0"
                onClick={() => handleRemoveImage(index)}
              >
                <MinusIcon className="h-2 w-2" />
              </Button>
            </div>
          ))}
          <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleImageUpload(e, 'gallery')}
              accept="image/*"
              multiple
            />
            <PlusIcon className="h-6 w-6 text-muted-foreground" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
