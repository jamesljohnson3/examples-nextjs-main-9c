
"use client"

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon, Image, FileImage } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Textarea } from '@/components/ui/textarea';
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from 'uuid';

// GraphQL Queries and Mutations
const GET_PRODUCT = gql`
  query GetProduct($productId: String!) {
    Product(where: {id: {_eq: $productId}}) {
      id
      name
      description
      price
      quantity
      category
      primaryPhoto
      imageGallery
      ogImage
      metadata {
        title
        description
        keywords
      }
    }
  }
`;

const SAVE_PRODUCT = gql`
  mutation SaveProduct($productId: String!, $name: String, $description: String, $price: float8, $quantity: Int, $category: String, $primaryPhoto: String, $ogImage: String, $imageGallery: [String!], $metadata: jsonb) {
    update_Product(where: {id: {_eq: $productId}}, _set: {name: $name, description: $description, price: $price, quantity: $quantity, category: $category, primaryPhoto: $primaryPhoto, ogImage: $ogImage, imageGallery: $imageGallery, metadata: $metadata}) {
      returning {
        id
        name
        description
        price
        quantity
        category
        primaryPhoto
        imageGallery
        ogImage
        metadata
      }
    }
  }
`;

const UPDATE_PRODUCT_VERSION = gql`
  mutation UpdateProductVersion($productId: String!, $versionNumber: Int!, $changes: String!, $data: jsonb, $id: String!) {
    insert_ProductVersion(objects: {productId: $productId, versionNumber: $versionNumber, changes: $changes, data: $data, id: $id}) {
      returning {
        id
        versionNumber
        changes
        data
      }
    }
  }
`;

const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn"; // Example product ID

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
}

const ImageUploader: React.FC = () => {
  const { data, loading, error } = useQuery<{ Product: ProductData[] }>(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID },
  });
  
  const [saveProduct] = useMutation(SAVE_PRODUCT);
  const [updateProductVersion] = useMutation(UPDATE_PRODUCT_VERSION);
  
  const productData = data?.Product[0];
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [imageGallery, setImageGallery] = useState<{ id: string; url: string }[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    keywords: '',
  });

  // Load product data into state
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
    setMetadata((prev) => ({
      ...prev,
      [key]: value,
    }));
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

  const handleSave = async () => {
    if (!productData) {
      alert('No product data to save!');
      return;
    }

    const { id, name, description, price, quantity, category } = productData;
    const parsedPrice = parseFloat(price as unknown as string);
    const parsedQuantity = parseInt(quantity as unknown as string);

    if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
      alert('Invalid price or quantity');
      return;
    }

    try {
      // Save product information including metadata, primary photo, OG image, and gallery
      await saveProduct({
        variables: {
          productId: PRODUCT_ID,
          name,
          description,
          price: parsedPrice,
          quantity: parsedQuantity,
          category,
          metadata: {
            title: metadata.title,
            description: metadata.description,
            keywords: metadata.keywords,
          },
          primaryPhoto,
          ogImage,
          imageGallery: imageGallery.map((img) => img.url), // Save the updated image gallery order
        },
      });

      // Save product version for history tracking
      const versionNumber = Math.floor(Date.now() / 1000);
      const uuid = uuidv4();

      await updateProductVersion({
        variables: {
          productId: PRODUCT_ID,
          versionNumber,
          changes: 'Updated product details and images',
          data: productData,
          id: uuid,
        },
      });

      localStorage.setItem('productVersionId', uuid);
      setHasUnsavedChanges(false);
      alert('Product updated and saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading product data: {error.message}</div>;

  return (
    <div className="w-full space-y-2">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <Accordion type="single" collapsible className="w-full space-y-4">
            
            {/* Primary Photo Section */}
            <AccordionItem value="primary-photo">
              <AccordionTrigger className="text-sm font-semibold">
                Primary Photo
              </AccordionTrigger>
              <AccordionContent>
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
                        onChange={(e) => handleImageUpload(e, 'primary')}
                      />
                      <Image className="h-6 w-6 text-muted-foreground" />
                    </label>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* OG Image Section */}
            <AccordionItem value="og-image">
              <AccordionTrigger className="text-sm font-semibold">
                OG Image
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center space-x-2">
                  {ogImage ? (
                    <div className="relative w-16 h-16">
                      <img
                        src={ogImage}
                        alt="OG"
                        className="w-full h-full object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-0 right-0 h-4 w-4 p-0"
                        onClick={() => setOgImage(null)}
                      >
                        <MinusIcon className="h-2 w-2" />
                      </Button>
                    </div>
                  ) : (
                    <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'og')}
                      />
                      <FileImage className="h-6 w-6 text-muted-foreground" />
                    </label>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Image Gallery Section */}
            <AccordionItem value="image-gallery">
              <AccordionTrigger className="text-sm font-semibold">
                Image Gallery
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <div className="flex space-x-2 overflow-auto">
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="image-gallery" direction="horizontal">
                        {(provided) => (
                          <div
                            className="flex space-x-2"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {imageGallery.map((image, index) => (
                              <Draggable key={image.id} draggableId={image.id} index={index}>
                                {(provided) => (
                                  <div
                                    className="relative w-16 h-16"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
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

                  <label className="block mt-4">
                    <input
                      type="file"
                      multiple
                      onChange={handleGalleryImageUpload}
                      className="hidden"
                    />
                    <Button variant="outline">
                      <PlusIcon className="h-4 w-4 mr-2" /> Add Images
                    </Button>
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Metadata Section */}
            <AccordionItem value="metadata">
              <AccordionTrigger className="text-sm font-semibold">
                Metadata
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="space-y-2">
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        type="text"
                        value={metadata.title}
                        onChange={(e) => handleMetadataChange('title', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={metadata.description}
                        onChange={(e) => handleMetadataChange('description', e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-sm font-medium">Keywords</label>
                      <Textarea
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
        
        {/* Save Button */}
        <ResizableHandle />
        <ResizablePanel defaultSize={30}>
          <div className="flex items-center justify-center h-full">
            <Button size="lg" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ImageUploader;
