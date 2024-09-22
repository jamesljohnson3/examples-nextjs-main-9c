
"use client"
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Button } from "@/components/ui/button";
import { PlusIcon, RefreshCcw, MinusIcon, Image, FileImage } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { GET_PRODUCT } from '@/app/(shell)/(main)/queries';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Textarea } from '@/components/ui/textarea';
import { Input } from "@/components/ui/input";

interface ProductData {
  id: string;
  name: string;
  description: string;
  quantity: number;
  category: string;
  price?: number;
  primaryPhoto?: string;
  imageGallery?: string[];
  ogImage?: string;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  [key: string]: any;
}

const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn"; // Example product ID

const ImageUploader: React.FC = () => {
  const { data, loading, error, refetch } = useQuery<{ Product: ProductData[] }>(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID },
  });
  
  const productData = data?.Product[0];
  
  const [imageGallery, setImageGallery] = useState<{ id: string; url: string }[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    keywords: '',
  });

  useEffect(() => {
    if (productData) {
      setPrimaryPhoto(productData.primaryPhoto || localStorage.getItem('primaryPhoto'));
      setOgImage(productData.ogImage || null);
      setMetadata({
        title: productData.metadata?.title || '',
        description: productData.metadata?.description || '',
        keywords: productData.metadata?.keywords || '',
      });
      const initialGallery = productData.imageGallery?.map((url) => ({
        id: url,
        url,
      })) || JSON.parse(localStorage.getItem('imageGallery') || '[]');
      setImageGallery(initialGallery);
    }
  }, [productData]);

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

  const handleGalleryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file),
      url: URL.createObjectURL(file),
    }));
    setImageGallery(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    setImageGallery(prev => prev.filter(image => image.id !== id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedImages = Array.from(imageGallery);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setImageGallery(reorderedImages);
  };

  const handleMetadataChange = (key: string, value: string) => {
    setMetadata(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'primary' | 'og') => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === 'primary') {
        setPrimaryPhoto(imageUrl);
      } else if (type === 'og') {
        setOgImage(imageUrl);
      }
    }
  };

  const handleSaveChanges = () => {
    // Logic to save changes (e.g., to a server)
    // After saving, refetch product data to update UI
    refetch();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading product data: {error.message}</div>;

  return (
    <div className="w-full space-y-2">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="primary-photo">
              <AccordionTrigger className="text-sm font-semibold">Primary Photo</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center space-x-2">
                  {primaryPhoto ? (
                    <div className="relative w-16 h-16">
                      <img src={primaryPhoto} alt="Primary" className="w-full h-full object-cover rounded" />
                      <Button size="sm" variant="destructive" className="absolute top-0 right-0 h-4 w-4 p-0" onClick={() => setPrimaryPhoto(null)}>
                        <MinusIcon className="h-2 w-2" />
                      </Button>
                    </div>
                  ) : (
                    <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                      <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'primary')} accept="image/*" />
                      <Image className="h-6 w-6 text-muted-foreground" />
                    </label>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="image-gallery">
              <AccordionTrigger className="text-sm font-semibold">Image Gallery</AccordionTrigger>
              <AccordionContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="gallery">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-2">
                        {imageGallery.map((image, index) => (
                          <Draggable key={image.id} draggableId={image.id} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="relative w-16 h-16">
                                <img src={image.url} alt={`Gallery ${index}`} className="w-full h-full object-cover rounded" />
                                <Button size="sm" variant="destructive" className="absolute top-0 right-0 h-4 w-4 p-0" onClick={() => handleRemoveImage(image.id)}>
                                  <MinusIcon className="h-2 w-2" />
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                          <input type="file" className="hidden" onChange={handleGalleryImageUpload} accept="image/*" multiple />
                          <PlusIcon className="h-6 w-6 text-muted-foreground" />
                        </label>
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <Button onClick={refetch}>
        <RefreshCcw />
      </Button>

              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="og-image">
              <AccordionTrigger className="text-sm font-semibold">OG Image</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      {ogImage ? (
                        <div className="w-16 h-16 relative">
                          <img src={ogImage} alt="OG" className="w-full h-full object-cover rounded" />
                          <Button size="sm" variant="destructive" className="absolute top-0 right-0 h-4 w-4 p-0" onClick={() => setOgImage(null)}>
                            <MinusIcon className="h-2 w-2" />
                          </Button>
                        </div>
                      ) : (
                        <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'og')} accept="image/*" />
                          <FileImage className="h-6 w-6 text-muted-foreground" />
                        </label>
                      )}
                      <span className="text-xs text-muted-foreground">Set Open Graph image for social sharing</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="metadata">
              <AccordionTrigger className="text-sm font-semibold">Metadata</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-2 space-y-2">
                    <div className="space-y-1">
                      <Input
                        placeholder="Meta Title"
                        className="h-6 text-xs"
                        value={metadata.title}
                        onChange={(e) => handleMetadataChange('title', e.target.value)}
                      />
                      <Textarea
                        placeholder="Meta Description"
                        className="h-12 text-xs"
                        value={metadata.description}
                        onChange={(e) => handleMetadataChange('description', e.target.value)}
                      />
                      <Input
                        placeholder="Keywords (comma-separated)"
                        className="h-6 text-xs"
                        value={metadata.keywords}
                        onChange={(e) => handleMetadataChange('keywords', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={30}>
          <div className="p-4">
            {productData && (
              <div>
                <div className="relative w-full mb-4">
                  <div className="w-full" style={{ paddingBottom: '56.25%' }}>
                    <img src={primaryPhoto ?? ""} alt="Primary" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-semibold">{productData.name}</h3>
                <p className="text-sm text-muted">{productData.description}</p>
                <p className="text-sm">Category: {productData.category}</p>
                <p className="text-sm">Price: ${productData.price?.toFixed(2)}</p>
                <p className="text-sm">Quantity: {productData.quantity}</p>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ImageUploader;

