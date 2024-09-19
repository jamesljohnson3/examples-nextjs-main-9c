"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon, Image } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GET_PRODUCT } from '@/app/(shell)/(main)/queries'; // Import your GraphQL query

interface ProductData {
  id: string;
  name: string;
  description: string;
  quantity: number;
  category: string;
  price?: number; // Optional price
  primaryPhoto?: string;
  imageGallery?: string[];
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn"; // Example product ID

const ImageUploader: React.FC = () => {
  const { data, loading, error } = useQuery<{ Product: ProductData[] }>(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID },
  });
  
  const productData = data?.Product[0];
  
  const [imageGallery, setImageGallery] = useState<{ id: string; url: string }[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);

  // Load from GraphQL data or fallback to localStorage
  useEffect(() => {
    if (productData) {
      // Set primary photo and gallery from product data
      setPrimaryPhoto(productData.primaryPhoto || localStorage.getItem('primaryPhoto'));
      const initialGallery = productData.imageGallery?.map((url) => ({
        id: url,
        url,
      })) || JSON.parse(localStorage.getItem('imageGallery') || '[]');
      setImageGallery(initialGallery);
    }
  }, [productData]);

  // Save gallery and primary photo to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('imageGallery', JSON.stringify(imageGallery));
  }, [imageGallery]);

  useEffect(() => {
    if (primaryPhoto) {
      localStorage.setItem('primaryPhoto', primaryPhoto);
    } else {
      localStorage.removeItem('primaryPhoto');
    }
  }, [primaryPhoto]);

  // Handle uploading of the primary image
  const handlePrimaryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPrimaryPhoto(imageUrl);
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
  };

  // Handle drag-and-drop reordering of images in the gallery and save the order
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(imageGallery);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);

    setImageGallery(reorderedImages);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading product data: {error.message}</div>;

  return (
    <div className="w-full space-y-2">
      <Accordion type="single" collapsible className="w-full space-y-4">
        
        {/* Primary Photo Section inside Accordion */}
        <AccordionItem value="primary-photo">
          <AccordionTrigger className="text-sm font-semibold">
            Primary Photo
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              {productData && productData.primaryPhoto ? (
                <div className="relative w-16 h-16">
                  <img
                    src={productData.primaryPhoto}
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

            
          </AccordionContent>
        </AccordionItem>

        {/* Gallery Section inside Accordion */}
        <AccordionItem value="image-gallery">
          <AccordionTrigger className="text-sm font-semibold">
            Image Gallery
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* Mockup for previewing the primary photo */}
      <div className="rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50 h-auto p-6 mt-4">
              {productData && (
                <div className="relative w-full mb-4">
                  <div className="w-full" style={{ paddingBottom: '56.25%' }}>
                    <img
                      src={productData.primaryPhoto || primaryPhoto}
                      alt="Primary"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h2 className="text-lg font-bold mb-2">{productData.name}</h2>
                  <p className="text-sm text-gray-500">{productData.description}</p>
                  <p className="text-md font-bold">${productData.price?.toFixed(2)}</p>
                  <p className="text-sm">Quantity: {productData.quantity}</p>
                  <p className="text-sm">Category: {productData.category}</p>
                </div>
              )}
            </div>

    </div>
  );
};

export default ImageUploader;
