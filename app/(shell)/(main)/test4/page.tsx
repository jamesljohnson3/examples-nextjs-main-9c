"use client"

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
      {/* Primary Photo Section */}
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
                onClick={() => setPrimaryPhoto(null)}
              >
                <MinusIcon className="h-2 w-2" />
              </Button>
            </div>
          ) : (
            <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
              <input
                type="file"
                className="hidden"
                onChange={handlePrimaryImageUpload}
                accept="image/*"
              />
              <Image className="h-6 w-6 text-muted-foreground" />
            </label>
          )}
        </div>
      </div>

      {/* Gallery Section with Drag and Drop */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2">Image Gallery</h3>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="gallery">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-2"
              >
                {imageGallery.map((image, index) => (
                  <Draggable key={image.id} draggableId={image.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative w-16 h-16"
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
                <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleGalleryImageUpload}
                    accept="image/*"
                    multiple
                  />
                  <PlusIcon className="h-6 w-6 text-muted-foreground" />
                </label>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ImageUploader;
