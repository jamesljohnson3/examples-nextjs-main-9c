'use client'
import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  PlusIcon,
  MinusIcon,
  GripVertical,
  ImageIcon,
  EyeIcon,
  BarChart3Icon,
  Sliders,
  MessageSquare,
  ChevronLeft,
  Save,
  Upload,
  Image,
  FileImage,
  X,
  RefreshCcw,
} from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { GitBranch } from 'lucide-react';

import { useQuery, useMutation } from '@apollo/client'; 
import { GET_PRODUCT, SAVE_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS, UPDATE_SEGMENT, GET_PRODUCT_VERSIONS } from '@/app/(shell)/(main)/queries';
import { v4 as uuidv4 } from 'uuid';
 import { DELETE_SEGMENT } from './mutations';
 import Uppy, { UploadedUppyFile, UppyFile } from '@uppy/core';
 import { DragDrop, StatusBar } from '@uppy/react';
 import Transloadit from '@uppy/transloadit';
 import '@uppy/core/dist/style.css';
 import '@uppy/status-bar/dist/style.css';
 import '@uppy/drag-drop/dist/style.css';
import { MagicWandIcon } from "@radix-ui/react-icons";

 const RESERVED_FIELDS = new Set([
  'id', 'name', 'description', 'price', 'quantity', 'category', 'organizationId', 'createdById',
  'primaryPhoto', 'imageGallery', 'ogImage', 'metadata', 'createdAt', 'updatedAt', 'designConcepts',
  'aiSuggestions', 'Segment'
]);

interface FormField {
  id: string;
  type: string;
  label: string;
  options?: string[];
  value?: string | number;
}

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
interface Segment {
  id: string;
  name: string;
  slug: string;
  post: { [key: string]: FormField };
}
interface Image {
  id: string;
  url: string;
}


const initialAvailableFields: FormField[] = [
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'description', type: 'textarea', label: 'Description' },
  { id: 'price', type: 'number', label: 'Price' },
  { id: 'quantity', type: 'number', label: 'Quantity' },
  { id: 'category', type: 'select', label: 'Category', options: ['Electronics', 'Clothing', 'Food'] },
];

interface Version {
  id: string;
  versionNumber: number;
  changes: string;
  data: any;
  createdAt: string;
}

function VersionControl({ 
  productId, 
  setProductData, 
  previewData, 
  primaryPhoto, 
  setPrimaryPhoto, 
  setMetadata,
  setHasUnsavedChanges,
  ogImage, 
  setOgImage, 
  imageGallery, 
  setImageGallery 
}: { 
  productId: string; 
  setProductData: any;
  previewData: any; 
  primaryPhoto: string | null; 
  setPrimaryPhoto: any; 
  setMetadata: any;
  setHasUnsavedChanges: any;
  ogImage: string | null; 
  setOgImage: any; 
  imageGallery: { id: string; url: string }[]; 
  setImageGallery: any; 
}) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [activeVersion, setActiveVersion] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_PRODUCT_VERSIONS, {
    variables: { productId },
  });

  useEffect(() => {
    if (data) {
      const loadedProductVersions = data.ProductVersion;
      setVersions(loadedProductVersions);

      const storedVersionId = localStorage.getItem('productVersionId');
      if (storedVersionId) {
        const storedVersion = loadedProductVersions.find(
          (version: { id: string }) => version.id === storedVersionId
        );
        if (storedVersion) {
          setActiveVersion(storedVersion.id);
          setProductData(storedVersion.data);
          setPrimaryPhoto(storedVersion.data.primaryPhoto || null);
        }
      } else {
        const latestVersion = loadedProductVersions[loadedProductVersions.length - 1];
        setActiveVersion(latestVersion.id);
        setProductData(latestVersion.data);
        setPrimaryPhoto(latestVersion.data.primaryPhoto || null);
      }
    }
  }, [data]);

  const handleSwitchVersion = (version: Version) => {
    setActiveVersion(version.id);
    setProductData(version.data);
    setPrimaryPhoto(version.data.primaryPhoto || null);
    setOgImage(version.data.ogImage || null);
    setImageGallery(version.data.imageGallery || []);
    setMetadata({
      title: version.data.metadata?.title || '',
      description: version.data.metadata?.description || '',
      keywords: version.data.metadata?.keywords || '',
    });
    setHasUnsavedChanges(true);
    localStorage.setItem('productVersionId', version.id);
  };
  const reversedVersions = versions.slice().reverse(); // Create a copy and reverse

  if (loading) return <div>Loading versions...</div>;
  if (error) return <div>Error loading versions: {error.message}</div>;

  return (
    <Card className="mt-2 bg-white backdrop-blur-lg border-0">
      <CardHeader>
        <CardTitle className="text-xs">Version History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[100px]">
        {reversedVersions.map((version, index) => (
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
      </CardContent>
    </Card>
  );
}

const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';
const SEGMENT_ID = 'unique-segment-id';
// Transloadit credentials
const TRANSLOADIT_KEY = '5fbf6af63e0e445abcc83a050048a887';
const TEMPLATE_ID = '9e9d24fbce8146369ce9faab869bfba1';

// Initialize Uppy with restrictions and autoProceed set to true
const uppyInstance = new Uppy({
  autoProceed: true, // Automatically upload files
  restrictions: {
    maxNumberOfFiles: 20, // Restrict to max 20 files
    allowedFileTypes: ['image/*'], // Only allow images
  },
}).use(Transloadit, {
  params: {
    auth: { key: TRANSLOADIT_KEY },
    template_id: TEMPLATE_ID,
  },
});

// Custom Event Listener for Uppy
uppyInstance.on('file-added', (file) => {
  console.log('File added:', file);
});

uppyInstance.on('upload', (data) => {
  console.log('Upload started:', data);
});

uppyInstance.on('upload-success', (file, response) => {
  console.log('Upload success:', file, response);
});

uppyInstance.on('complete', (result) => {
  console.log('Upload complete! Files:', result.successful);
});
const ImageUploader: React.FC = () => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [remainingFields, setRemainingFields] = useState<FormField[]>(initialAvailableFields);
  const [segments, setSegments] = useState<Segment[]>([]); 
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasUnsavedImageGalleryChanges, setHasUnsavedImageGalleryChanges] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [files, setFiles] = useState<UppyFile<Record<string, unknown>, Record<string, unknown>>[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageGallery, setImageGallery] = useState<{ id: string; url: string }[]>([]);
    const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    keywords: '',
  });
  const storedImages = JSON.parse(localStorage.getItem('imageGallery') || '[]') as Image[];

  const { data: productDataQuery, loading: loadingProduct, refetch } = useQuery(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID }
  });

  const { data: segmentsData, loading: loadingSegments } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID }
  });
  // Load product data into state
  
  
  
  // Calculate merged fields using useMemo OUTSIDE of useEffect 
  const mergedFields = useMemo(() => {
    if (productDataQuery?.Product && !loadingProduct && !loadingSegments) {
      const loadedProductData = productDataQuery.Product[0];

      


      // Set the product data and fields
      setProductData(loadedProductData);
      setPrimaryPhoto(loadedProductData.primaryPhoto || localStorage.getItem('primaryPhoto'));
      setOgImage(loadedProductData.ogImage || null);
      setMetadata({
        title: loadedProductData.metadata?.title || '',
        description: loadedProductData.metadata?.description || '',
        keywords: loadedProductData.metadata?.keywords || '',
      });


      // Initialize image gallery
    const storedImages = JSON.parse(localStorage.getItem('imageGallery') || '[]') as Image[];
    
    // Use stored images if available, otherwise use loaded product data
    const initialGallery = storedImages.length > 0 
      ? storedImages 
      : (loadedProductData.imageGallery?.map((url: any) => ({
          id: url,
          url,
        })) || []);

    setImageGallery(initialGallery);


      // Initialize form fields from available fields and product data
      const initialFields = initialAvailableFields.map(field => ({
        ...field,
        value: loadedProductData[field.id] || '',
      }));

      if (segmentsData) {
        const segmentFields = segmentsData.Segment.flatMap((segment: Segment) => {
          if (typeof segment.post !== 'object') {
            console.error('Invalid segment.post data:', segment.post);
            return [];
          }

          return Object.values(segment.post).map((field) => ({
            id: field.id || uuidv4(),
            type: field.type || 'text',
            label: field.label || '',
            value: field.value || '',
            options: field.options || [],
          }));
        });

        return [...initialFields, ...segmentFields].reduce((acc: FormField[], current: FormField) => {
          if (!acc.find(field => field.id === current.id || field.label === current.label)) {
            acc.push(current);
          }
          return acc;
        }, []);
      } else {
        return initialFields; 
      }
    } else { 
      return []; // Return empty array while data is loading
    }
  }, [productDataQuery, loadingSegments, loadingProduct, segmentsData]); 

  useEffect(() => {
    if (mergedFields.length > 0) { // Only update states if mergedFields is calculated
      // Set product data and image states
      const loadedProductData = productDataQuery.Product[0];
      setProductData(loadedProductData);
      // ... set primaryPhoto, ogImage, metadata, imageGallery ... 

      // Set form fields and remaining fields
      setFormFields(mergedFields);
      setRemainingFields(initialAvailableFields.filter(field => !mergedFields.some((mergedField: { id: string; }) => mergedField.id === field.id)));
    }
  }, [mergedFields]); 


  // Handle adding files to Uppy
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
  
    if (selectedFiles) { // Null check
      for (let i = 0; i < selectedFiles.length; i++) {
        uppyInstance.addFile({
          name: selectedFiles[i].name,
          type: selectedFiles[i].type,
          data: selectedFiles[i],
        });
      }
      setFiles(uppyInstance.getFiles());
      setHasUnsavedImageGalleryChanges(true); // Mark as changed

    }
  };

  
  // Cancel all uploads
  const handleCancel = () => {
    uppyInstance.cancelAll();
    setFiles([]);
  };

  
  // Remove duplicates utility function
  const removeDuplicates = (gallery: Image[]) => {
    const seen = new Set();
    return gallery.filter(image => {
      if (!image.url || seen.has(image.url)) {  // Ensure valid URL and no duplicates
        return false;
      }
      seen.add(image.url);
      return true;
    });
  };

  // Save uploaded image to backend or state (simulating database save here)
  const saveImage = async (file: UploadedUppyFile<Record<string, unknown>, Record<string, unknown>>) => {
    const uploadedUrl = file.uploadURL;
    
    if (uploadedUrl) { // Ensure valid upload URL
      setImageGallery((prev) => {
        const newGallery = [...prev, { id: uuidv4(), url: uploadedUrl }];
        return removeDuplicates(newGallery); // Remove duplicates after adding
      });
      setHasUnsavedImageGalleryChanges(true);
    }
  };


  // Handle Uppy events and completion
  useEffect(() => {
    uppyInstance.on('upload', () => {
      setIsUploading(true);
    });

    uppyInstance.on('upload-progress', (file, progress) => {
      setUploadProgress(progress.percentage);
    });

    uppyInstance.on('upload-success', (file, response) => {
      if (file) { // Ensure 'file' is not undefined
        const uploadedUrl = response.body.url; // Ensure URL exists
        if (uploadedUrl) {
          setImageGallery((prev) => {
            const newGallery = [...prev, { id: file.id, url: uploadedUrl }];
            return removeDuplicates(newGallery); // Ensure no duplicates are added
          });
          setUploadProgress(0);
        }
      }
    });
    
    uppyInstance.on('complete', async (result) => {
      const uploadedImages = result.successful;
      
      // Filter out any empty or invalid image objects
      const validImages = uploadedImages.filter(file => file.uploadURL);
      
      for (const file of validImages) {
        await saveImage(file); // Save each image and ensure no duplicates
      }
      setIsUploading(false);
    });

    return () => {
      uppyInstance.close(); // Cleanup Uppy instance on unmount
    };
  }, []);
  

  // Handle removing image from gallery
  const handleRemoveImage = (id: string) => {
    setImageGallery((prev) => prev.filter((image) => image.id !== id));
    setHasUnsavedImageGalleryChanges(true); // Mark as changed

  };

  // Handle drag-and-drop reordering of images
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedImages = Array.from(imageGallery);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setImageGallery(reorderedImages);
    setHasUnsavedImageGalleryChanges(true); // Mark as changed

  };

  const handleSaveOrder = () => {
    localStorage.setItem('imageGallery', JSON.stringify(imageGallery));
    setHasUnsavedImageGalleryChanges(false); // Reset to no unsaved changes
    alert('Image order saved!');
  };
  const handleGalleryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInput(event)
  };


  if (loadingProduct || loadingSegments) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full space-y-2">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <Accordion type="single" collapsible className="w-full space-y-4">
            
           
           

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
                        {imageGallery
                .filter(image => image.url) // Only show images with a valid URL
                .map((image, index) => (
                  <Draggable key={image.id} draggableId={image.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative w-16 h-16"
                      >
                        <img src={image.url} alt={`Gallery ${index}`} className="w-full h-full object-cover rounded" />
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
                            onChange={handleFileInput}
                            accept="image/*"
                            multiple
                          />
                          <PlusIcon className="h-6 w-6 text-muted-foreground" />
                        </label>
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                {isUploading && <div>Uploading...</div>}
        {isUploading && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}   {/* Reload button to trigger refetch */}

{!storedImages?.length && (
  <Button onClick={() => refetch()}>
    <RefreshCcw />
  </Button>
)}


                <Button onClick={handleCancel} disabled={files.length === 0}>
          Cancel Upload
        </Button>


                                <Button                         disabled={!hasUnsavedImageGalleryChanges}
 onClick={handleSaveOrder}>Save Order</Button>
 <Button onClick={() => refetch()}>
 <MagicWandIcon />
</Button>


              </AccordionContent>
            </AccordionItem>

          
          
          </Accordion>
        </ResizablePanel>

        {/* Product Preview Section */}
        <ResizableHandle withHandle />

<ResizablePanel className=" pl-2 flex flex-col gap-8" defaultSize={30}>
 <div className="p-4">
            {productData && (
              <div>
                <div className="relative w-full mb-4">
                  <div className="w-full" style={{ paddingBottom: '56.25%' }}>
                    <img
                      src={primaryPhoto ?? ""}
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
          <VersionControl
          productId={PRODUCT_ID}
          setProductData={setProductData}
          previewData={productData}
          primaryPhoto={primaryPhoto}
          setPrimaryPhoto={setPrimaryPhoto}
          setMetadata={setMetadata}
          setHasUnsavedChanges={setHasUnsavedChanges}
          ogImage={ogImage}
          setOgImage={setOgImage}
          imageGallery={imageGallery}
          setImageGallery={setImageGallery}
        />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ImageUploader;

