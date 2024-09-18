'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"; 
import {
  PlusIcon,
  MinusIcon,
  Image,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface ImageUploaderProps {
  onImageChange: (type: 'gallery' | 'primary', imageURL: string | null) => void; 
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [imageGallery, setImageGallery] = useState<{ id: string; url: string }[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);

  // Handle uploading of the primary image
  const handlePrimaryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPrimaryPhoto(imageUrl);
      onImageChange('primary', imageUrl);
    }
  };

  // Handle uploading of gallery images
  const handleGalleryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file), // Unique key using URL
      url: URL.createObjectURL(file),
    }));
    setImageGallery(prev => [...prev, ...newImages]);
  };

  // Handle removal of an image from the gallery
  const handleRemoveImage = (id: string) => {
    setImageGallery(prev => prev.filter(image => image.id !== id));
    onImageChange('gallery', null); // Notify parent component if needed
  };

  // Handle drag-and-drop reordering of images in the gallery
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(imageGallery);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setImageGallery(reorderedImages);
  };

  return (
    <div>
      {/* Product Preview Section */}
      <div className="rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 h-auto p-6">
        <h2 className="text-lg font-bold mb-2">Product Image Preview</h2>
        <div className="relative w-full mb-4">
          <div className="w-full" style={{ paddingBottom: '56.25%' }}>
            <img
              src={primaryPhoto || 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg'}
              alt="Primary Preview"
              className="absolute inset-0 w-full h-full object-cover rounded-lg"
            />
          </div>
          {primaryPhoto && (
            <div className="mt-2">
              <h3 className="text-sm font-semibold">Primary Photo</h3>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setPrimaryPhoto(null)}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Primary Photo Upload */}
      <div className="mt-4">
        <label className="block mb-2">Upload Primary Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePrimaryImageUpload}
        />
      </div>

      {/* Gallery Upload */}
      <div className="mt-4">
        <label className="block mb-2">Upload Gallery Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryImageUpload}
        />
      </div>

      {/* Gallery Section with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-wrap gap-2 mt-4"
            >
              {imageGallery.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative w-24 h-24"
                      style={{ ...provided.draggableProps.style }}
                    >
                      <img
                        src={image.url}
                        alt={`Gallery ${index}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-0 right-0 h-4 w-4 p-0"
                        onClick={() => handleRemoveImage(image.id)}
                      >
                        <MinusIcon className="h-2 w-2" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ImageUploader;
