/* eslint-disable @next/next/no-img-element */
'use client'
import { useQuery, useMutation } from '@apollo/client'; 
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon, Image, FileImage } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GET_PRODUCT, GET_PRODUCT_VERSIONS, UPDATE_PRODUCT_VERSION } from '@/app/(shell)/(main)/queries';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Textarea } from '@/components/ui/textarea';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { GitBranch } from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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

interface Version {
  id: string;
  versionNumber: number;
  changes: string;
  data: any;
  createdAt: string;
}

function VersionControl({ productId, setProductData, previewData }: { productId: string, setProductData: any, previewData: any }) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [activeVersion, setActiveVersion] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { data, loading, error } = useQuery(GET_PRODUCT_VERSIONS, {
    variables: { productId },
  });

  const [saveProductVersion] = useMutation(UPDATE_PRODUCT_VERSION, {
    onCompleted: (data: any) => {
      console.log('Version saved:', data);
      fetchVersions();
      setHasUnsavedChanges(false);
    },
    onError: (error: any) => {
      console.error('Error saving version:', error);
    },
  });

  useEffect(() => {
    if (data) {
      const storedVersionId = localStorage.getItem('productVersionId');
      const loadedProductVersions = data.ProductVersion;
      setVersions(loadedProductVersions);

      // Set the active version based on localStorage or the latest version
      if (storedVersionId) {
        const storedVersion = loadedProductVersions.find((version: { id: string; }) => version.id === storedVersionId);
        if (storedVersion) {
          setActiveVersion(storedVersion.id);
          setProductData(storedVersion.data);
        }
      } else {
        const latestVersion = loadedProductVersions[loadedProductVersions.length - 1];
        setActiveVersion(latestVersion.id);
        setProductData(latestVersion.data);
      }
    }
  }, [data]);

  const fetchVersions = () => {
    // Fetch versions again if needed or handle via refetch
  };

  const handleSave = () => {
    console.log('Saving changes...');
    console.log("Form Data:", previewData);
    console.log("Custom Fields:", versions);

    const newVersion: Version = {
      id: uuidv4(),
      versionNumber: versions.length + 1,
      changes: 'Updated product information',
      data: previewData,
      createdAt: new Date().toISOString(),
    };

    saveProductVersion({
      variables: {
        productId,
        versionNumber: newVersion.versionNumber,
        changes: newVersion.changes,
        data: JSON.stringify(previewData),
      },
    });

    setVersions([...versions, newVersion]);
    setActiveVersion(newVersion.id);
    setHasUnsavedChanges(false);

    // Update the active version in localStorage
    localStorage.setItem('productVersionId', newVersion.id);
  };

  const handleSwitchVersion = (version: Version) => {
    setActiveVersion(version.id);
    setProductData(version.data);

    // Store the selected version ID in localStorage
    localStorage.setItem('productVersionId', version.id);
  };

  if (loading) return <div>Loading versions...</div>;
  if (error) return <div>Error loading versions: {error.message}</div>;

  return (
    <Card className="mt-2 bg-white backdrop-blur-lg border-0">
      <CardHeader>
        <CardTitle className="text-xs">Version History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[100px]">
          {versions.map((version) => (
            <div key={version.id} className="flex items-center justify-between py-1 border-b border-white last:border-b-0">
              <div className="flex items-center space-x-1">
                <Badge variant={version.id === activeVersion ? "default" : "secondary"} className="text-[10px]">v{version.versionNumber}</Badge>
                <span className="text-[10px]">{new Date(version.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => handleSwitchVersion(version)} className="h-5 w-5 p-0">
                      <GitBranch className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-[10px]">Switch to this version</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-[10px] text-muted-foreground">{version.changes}</span>
              </div>
            </div>
          ))}
        </ScrollArea>
        <Button variant="outline" onClick={handleSave} disabled={!hasUnsavedChanges}>
          Save New Version
        </Button>
      </CardContent>
    </Card>
  );
}

const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";

const ImageUploader: React.FC = () => {
  const { data, loading, error } = useQuery<{ Product: ProductData[] }>(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID },
  });

  const [productData, setProductData] = useState<ProductData | null>(null);
  const [imageGallery, setImageGallery] = useState<{ id: string; url: string }[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    keywords: '',
  });

  useEffect(() => {
    if (data) {
      const loadedProductData = data.Product[0];
      setProductData(loadedProductData);
      setPrimaryPhoto(loadedProductData.primaryPhoto || localStorage.getItem('primaryPhoto'));
      setOgImage(loadedProductData.ogImage || null);
      setMetadata({
        title: loadedProductData.metadata?.title || '',
        description: loadedProductData.metadata?.description || '',
        keywords: loadedProductData.metadata?.keywords || '',
      });
      const initialGallery = loadedProductData.imageGallery?.map((url) => ({
        id: url,
        url,
      })) || JSON.parse(localStorage.getItem('imageGallery') || '[]');
      setImageGallery(initialGallery);
    }
  }, [data]);

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
                        accept="image/*"
                      />
                      <Image className="h-6 w-6 text-muted-foreground" />
                    </label>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Gallery Section */}
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

            {/* OG Image Section */}
            <AccordionItem value="og-image">
              <AccordionTrigger className="text-sm font-semibold">
                OG Image
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      {ogImage ? (
                        <div className="w-16 h-16 relative">
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
                            accept="image/*"
                          />
                          <FileImage className="h-6 w-6 text-muted-foreground" />
                        </label>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Set Open Graph image for social sharing
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Metadata Section */}
            <AccordionItem value="metadata">
              <AccordionTrigger className="text-sm font-semibold">
                Metadata
              </AccordionTrigger>
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

        {/* Product Preview Section */}
        <ResizableHandle />
        <ResizablePanel defaultSize={30}>
          <div className="p-4">
            {productData && (
              <div>
                <div className="relative w-full mb-4">
                  <div className="w-full" style={{ paddingBottom: '56.25%' }}>
                    <img
                      src={primaryPhoto ??'/placeholder.svg'}
                      alt="Primary"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
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
        <VersionControl productId={PRODUCT_ID} setProductData={setProductData} previewData={{ primaryPhoto, imageGallery, ogImage, metadata }} />
      </ResizablePanelGroup>
    </div>
  );
};

export default ImageUploader;
