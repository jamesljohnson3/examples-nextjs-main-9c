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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'primary') => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        if (type === 'gallery') {
          setImageGallery([...imageGallery, imageUrl]);
        } else {
          setPrimaryPhoto(imageUrl);
        }
        onImageChange(type, imageUrl); // Notify parent component
      };
      reader.readAsDataURL(file);
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
      <div>
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