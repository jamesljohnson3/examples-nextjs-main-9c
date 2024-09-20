'use client'
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MinusIcon, GripVertical, PlusIcon } from 'lucide-react';
import { GET_PRODUCT, SAVE_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS } from '@/app/(shell)/(main)/queries';
import { v4 as uuidv4 } from 'uuid';



// Define types for images and file upload
interface ImageGalleryProps {
  images: string[];
  onImageUpload: (file: File) => void;
}

interface ProductImageProps {
  image: string | null;
  onImageUpload: (file: File) => void;
}

const ProductImage: React.FC<ProductImageProps> = ({ image, onImageUpload }) => {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm">Primary Photo:</label>
      <Input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={image} alt="Primary" className="mt-2 w-full max-w-xs" />}
    </div>
  );
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImageUpload }) => {
  const handleGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => onImageUpload(file));
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm">Gallery:</label>
      <Input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
      <div className="mt-2 flex flex-wrap gap-2">
        {images.map((img, index) => (
          <img key={index} src={img} alt={`Gallery ${index}`} className="w-24 h-24 object-cover" />
        ))}
      </div>
    </div>
  );
};

const EnhancedProductImageGallery: React.FC = () => {
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [imageGallery, setImageGallery] = useState<string[]>([]);

  const handlePrimaryPhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPrimaryPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageGallery([...imageGallery, reader.result as string]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Product Image</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductImage image={primaryPhoto} onImageUpload={handlePrimaryPhotoUpload} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Image Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageGallery images={imageGallery} onImageUpload={handleGalleryImageUpload} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedProductImageGallery;
