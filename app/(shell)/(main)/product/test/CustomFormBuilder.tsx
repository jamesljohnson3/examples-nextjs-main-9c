"use client"
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
  RefreshCcw
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
import React, { useState, useEffect, memo, useCallback, useMemo, ChangeEvent } from 'react';
import { useQuery, useMutation } from '@apollo/client'; 
import { GET_PRODUCT, SAVE_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS, UPDATE_SEGMENT, GET_PRODUCT_VERSIONS } from '@/app/(shell)/(main)/queries';
import { v4 as uuidv4 } from 'uuid';
 import { DELETE_SEGMENT } from './mutations';

 import Uppy, { SuccessResponse, UploadedUppyFile, UppyFile } from '@uppy/core';
 import Transloadit from '@uppy/transloadit';
 

 import '@uppy/core/dist/style.css';
 import '@uppy/drag-drop/dist/style.css';
import { MagicWandIcon } from "@radix-ui/react-icons";
import axios from 'axios';
import Link from 'next/link';

import {  downloadFileFromUrl, uploadFileToS3  } from '@/utils/uppy-s3'; // Import your utility function
import { ProcessResult, UploadedImage } from "@/types/api";


 const TRANSLOADIT_KEY = '5fbf6af63e0e445abcc83a050048a887';
 const TEMPLATE_ID = '9e9d24fbce8146369ce9faab869bfba1';
 const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
 const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';
 
 const uppyInstance = new Uppy({
   autoProceed: true,
   restrictions: { maxNumberOfFiles: 20, allowedFileTypes: ['image/*'] },
 }).use(Transloadit, {
   params: {
     auth: { key: TRANSLOADIT_KEY },
     template_id: TEMPLATE_ID,
   },
 });
 
 interface Image {
   id: string;
   url: string;
 }
 // Define the type for the images in the gallery
type ImageGalleryItem = {
  id: string;
  url: string;
};
interface FormElement {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  label: string;
  options?: string[];
}

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


const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB in bytes


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
  setImageGallery,
  refetchProduct,
  refetchVersions,
  handleSave,
  versions
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
  refetchProduct: () => Promise<any>;
  refetchVersions: () => Promise<any>;
  handleSave: () => void; // Add handleSave as a prop
  versions: Version[];  // Receive versions as a prop


}) {

  const { data, loading, error } = useQuery(GET_PRODUCT_VERSIONS, {
    variables: { productId },
  });

  const [activeVersion, setActiveVersion] = useState<string | null>(null);

  useEffect(() => {
    if (data?.ProductVersion.length > 0) {
      const latestVersion = data.ProductVersion[data.ProductVersion.length - 1];
      setActiveVersion(latestVersion.id);
      setProductData(latestVersion.data);
      setPrimaryPhoto(latestVersion.data.primaryPhoto || null);
      setOgImage(latestVersion.data.ogImage || null);
    }
  }, [data]); // Re-run when data updates

  
  const handleSwitchVersion = async (version: Version) => {
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

    // Refetch product data when switching versions
    await refetchProduct();
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


export default function EnhancedProductMoodboard() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [remainingFields, setRemainingFields] = useState<FormField[]>(initialAvailableFields);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasUnsavedImageGalleryChanges, setHasUnsavedImageGalleryChanges] = useState(false);
  const [imageGallery, setImageGallery] = useState<{ id: string; url: string }[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [downloadPrimaryPhotoLink, setDownloadPrimaryPhotoLink] = useState<string | null>(null);
  const [downloadOgLink, setDownloadOgLink] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    keywords: '',
  });
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldType, setCustomFieldType] = useState('text');
  const [customFieldOptions, setCustomFieldOptions] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'refine' | 'analytics'>(
    'form'
  );
  const [files, setFiles] = useState<UppyFile<Record<string, unknown>, Record<string, unknown>>[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  
  const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
  const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';
  const SEGMENT_ID = 'unique-segment-id';


  const detectChanges = () => {
    let changes = "";
  
    if (productData && productDataQuery) {
      const loadedProductData = productDataQuery.Product[0];
  
      // Check if product metadata (title, description, keywords) has changed
      if (
        metadata.title !== loadedProductData.metadata?.title ||
        metadata.description !== loadedProductData.metadata?.description ||
        metadata.keywords !== loadedProductData.metadata?.keywords
      ) {
        changes += "Updated product metadata. ";
      }
  
      // Check if primary photo or OG image has changed
      if (primaryPhoto !== loadedProductData.primaryPhoto) {
        changes += "Updated primary photo. ";
      }
      if (ogImage !== loadedProductData.ogImage) {
        changes += "Updated OG image. ";
      }
  
      // Check if the image gallery has changed
      const initialGallery = loadedProductData.imageGallery?.map((img: any) => img?.url) || [];
      const currentGallery = imageGallery.map((img) => img?.url).filter(Boolean);
      if (JSON.stringify(initialGallery) !== JSON.stringify(currentGallery)) {
        changes += "Updated image gallery. ";
      }
  
      // Check if any of the basic product fields (name, description, price, quantity, category) have changed
      if (
        productData.name !== loadedProductData.name ||
        productData.description !== loadedProductData.description ||
        productData.price !== loadedProductData.price ||
        productData.quantity !== loadedProductData.quantity ||
        productData.category !== loadedProductData.category
      ) {
        changes += "Updated product details. ";
      }
  
      // If no specific changes were detected, mark it as a general product version update
      if (!changes) {
        changes = "Updated product version.";
      }
    }
  
    return changes.trim();
  };

  
  const [deleteSegment, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_SEGMENT, {
    onCompleted: () => alert('Segment deleted successfully!'),
    onError: (error) => {
      console.error('Error deleting segment:', error);
      alert('Error deleting segment.');
    }
  });
  

  const { data: productDataQuery, loading: loadingProduct, refetch: refetchProduct  } = useQuery(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID }
  });
  // Query to get product versions
  const {data: versionData,  refetch: refetchVersions } = useQuery(GET_PRODUCT_VERSIONS, {
    variables: { productId: PRODUCT_ID }, // Adjust productId as needed
  });
  const { data: segmentsData, loading: loadingSegments } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID }
  });
  const storedImages = JSON.parse(localStorage.getItem('imageGallery') || '[]') as Image[];

  const [updateProductVersion] = useMutation(UPDATE_PRODUCT_VERSION);
  const [publishSegments] = useMutation(PUBLISH_SEGMENTS);
  const [saveProduct] = useMutation(SAVE_PRODUCT);
  const [UpdateSegment] = useMutation(UPDATE_SEGMENT);
  
  
  // Calculate merged fields using useMemo OUTSIDE of useEffect 
  const mergedFields = useMemo(() => {
    if (productDataQuery?.Product && !loadingProduct && !loadingSegments) {
      const loadedProductData = productDataQuery.Product[0];

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
      // Set form fields and remaining fields
      setFormFields(mergedFields);
      setRemainingFields(initialAvailableFields.filter(field => !mergedFields.some((mergedField: { id: string; }) => mergedField.id === field.id)));
    }
  }, [mergedFields]); 

  const handleInputChange = useCallback((fieldId: string, value: string | number) => {
    if (productData) {
      const parsedValue = (typeof value === 'string' && isNaN(Number(value))) ? value : parseFloat(value as string);
      setProductData(prev => ({
        ...prev!,
        [fieldId]: parsedValue
      }));
    }
    setFormFields(prev =>
      prev.map(field => (field.id === fieldId ? { ...field, value } : field))
    );
    setHasUnsavedChanges(true);
  }, [productData, formFields]);

  const handleAddField = (newField: FormField) => {
    setFormFields(prev => [...prev, newField]);
    setRemainingFields(prev => prev.filter(field => field.id !== newField.id));
    setHasUnsavedChanges(true);
  };

  const handleRemoveField = (index: number) => {
    setFormFields(prev => {
      const updatedFields = [...prev];
      const removedField = updatedFields.splice(index, 1)[0];
      setRemainingFields(prev => [...prev, removedField].sort((a, b) => a.label.localeCompare(b.label)));
      return updatedFields;
    });
    setHasUnsavedChanges(true);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedFields = Array.from(formFields);
    const [reorderedItem] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, reorderedItem);
    setFormFields(reorderedFields);
    setHasUnsavedChanges(true);
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
          imageGallery: imageGallery.map((img) => img?.url).filter(Boolean), // Filter out any falsy values (null or undefined)
        },
      });
  
      // Detect changes and update product version with appropriate message
      const changes = detectChanges();
  
      const versionNumber = Math.floor(Date.now() / 1000);
      const uuid = uuidv4();
  
      await updateProductVersion({
        variables: {
          productId: PRODUCT_ID,
          versionNumber,
          changes,
          data: {
            ...productData, // Spread existing product data
            imageGallery: imageGallery.map((img) => img.url).filter(Boolean) // Include updated image gallery here
          },
          id: uuid,
        },
      });
  
      localStorage.setItem('productVersionId', uuid);
      setHasUnsavedChanges(false);
      await refetchVersions(); // This will refetch the version history
  
      alert('Product version updated and saved with message: ' + changes);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    }
  };
  

  const handlePublish = async () => {
    try {
      const productVersionId = localStorage.getItem('productVersionId');

      if (!productVersionId) {
        alert('Product version ID not found in local storage.');
        return;
      }

      const postData = formFields.reduce((acc, field) => {
        acc[field.id] = {
          type: field.type,
          label: field.label,
          value: field.value,
          options: field.options || [],
        };
        return acc;
      }, {} as Record<string, any>);

      const segmentId = SEGMENT_ID;

      if (!segmentId) {
        alert('No segment ID available.');
        return;
      }

      await publishSegments({
        variables: { id: segmentId, productVersionId },
      });

      await UpdateSegment({
        variables: {
          id: segmentId,
          post: postData,
        },
      });

      alert('Segment published and updated!');
    } catch (error) {
      console.error('Error publishing segment:', error);
      alert('Error publishing segment.');
    }
  };

  const handleAddCustomField = () => {
    if (RESERVED_FIELDS.has(customFieldLabel)) {
      alert(`The label "${customFieldLabel}" is a reserved field name and cannot be used.`);
      return;
    }

    const newCustomField: FormField = {
      id: uuidv4(),
      label: customFieldLabel,
      type: customFieldType,
      options: customFieldType === 'select' ? customFieldOptions.split(',').map(opt => opt.trim()) : [],
      value: ''
    };

    setFormFields(prev => [...prev, newCustomField]);
    setCustomFieldLabel('');
    setCustomFieldType('text');
    setCustomFieldOptions('');
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

  // Cancel all uploads
  const handleCancel = () => {
    uppyInstance.cancelAll();
    setFiles([]);
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

// Save uploaded image from S3 Bucket (simulating database save here)
const saveImageS3 = (uploadedUrl: string): void => {
  if (uploadedUrl) {
    setImageGallery((prev: ImageGalleryItem[]) => {
      // Create a new gallery with the uploaded image
      const newGallery: ImageGalleryItem[] = [...prev, { id: uuidv4(), url: uploadedUrl }];
      return removeDuplicates(newGallery); // Remove duplicates after adding
    });
    setHasUnsavedImageGalleryChanges(true); // Flag to indicate unsaved changes
  }
};


    useEffect(() => {
      if (primaryPhoto) {
        localStorage.setItem('primaryPhoto', primaryPhoto);
      } else {
        localStorage.removeItem('primaryPhoto');
      }
    }, [primaryPhoto]);

    const uploadtoBucket = async (file: File): Promise<string | null> => {
      const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1);
      const uuid = uuidv4();
      const fileName = `${uuid}-file.${fileExt}`;
  
      try {
        const { data } = await axios.post(`/api/uploader`, file, {
          headers: {
            'content-type': file.type,
            'x-filename': fileName,
          },
        });
  
        return data.url; // Return the download link
      } catch (err) {
        console.error(err);
        return null;
      }
    };
  
    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>, type: 'primary' | 'og') => {
      const file = event.target.files?.[0];
      if (file) {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
          setErrorMessage("File size must be 4 MB or less.");
          return;
        } else {
          setErrorMessage(null); // Clear error message
        }
        const imageUrl = await uploadtoBucket(file);
        const downloadLink = URL.createObjectURL(file);
        setHasUnsavedChanges(true)
        if (type === 'primary') {
          setPrimaryPhoto(imageUrl);
          setDownloadPrimaryPhotoLink(downloadLink);
        } else if (type === 'og') {
          setOgImage(imageUrl);
          setDownloadOgLink(downloadLink);
        }
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
    if (file) {
      const uploadedUrl = response.body.url; // Ensure URL exists
      if (uploadedUrl) {
        setImageGallery((prev) => {
          const newGallery = [...prev, { id: uuidv4(), url: uploadedUrl }];
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
      const downloadResult = await downloadFileFromUrl(file.uploadURL); // Download the file

      if (downloadResult.success) {
        const uploadResult = await uploadFileToS3(downloadResult.file); // Upload to S3
        if (uploadResult.success) {
          // Save the uploaded image URL to the gallery only once
          saveImageS3(uploadResult.url); // Save the uploaded image URL
        } else {
          console.error('Upload to S3 failed:', uploadResult.message);
        }
      } else {
        console.error('Download failed:', downloadResult.message);
      }
    }
    setIsUploading(false);
  });

  return () => {
    uppyInstance.close(); // Cleanup Uppy instance on unmount
  };
}, [uppyInstance]);
  
  if (loadingProduct || loadingSegments) {
    return <div>Loading...</div>;
  }

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
      setHasUnsavedChanges(true)

    }
  };

  const handleGalleryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInput(event)
  };  // Handle removing image from gallery


  const handleSaveOrder = () => {
    localStorage.setItem('imageGallery', JSON.stringify(imageGallery));
    setHasUnsavedImageGalleryChanges(false); // Reset to no unsaved changes
    alert('Image order saved!');
  };

  const handleGalleryRemoveImage = (id: string) => {
    setImageGallery((prev) => prev.filter((image) => image.id !== id));
    setHasUnsavedImageGalleryChanges(true); // Mark as changed
    setHasUnsavedChanges(true)

  };

  // Handle drag-and-drop reordering of images
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedImages = Array.from(imageGallery);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setImageGallery(reorderedImages);
    setHasUnsavedImageGalleryChanges(true); // Mark as changed
    setHasUnsavedChanges(true)

  };


  const handleMetadataChange = (
    key: 'title' | 'description' | 'keywords',
    value: string
  ) => {
    setMetadata({ ...metadata, [key]: value });
    setHasUnsavedChanges(true);
  };

  const handleDeleteSegment = async (segmentId: any) => {
    if (!window.confirm('Are you sure you want to delete this segment?')) {
      return;
    }
    try {
      await deleteSegment({ variables: { segmentId } });
    } catch (error) {
      console.error('Error executing delete mutation:', error);
    }
  };
  

  if (deleteLoading) return <p>Deleting...</p>;
  if (deleteError) return <p>Error deleting segment.</p>;
  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'form':
        return (
          <Accordion type="single" collapsible className="w-full space-y-2">
          
          
        <Card>
                      <CardContent>
                        <div className="flex justify-between items-center mt-4 mb-2">
                          <div className="flex space-x-1">
                            {remainingFields.map((field) => (
                              <Button
                                key={field.id}
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddField(field)}
                                className="text-xs py-1 px-2"
                              >
                                <PlusIcon className="h-3 w-3 mr-1" /> {field.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <DragDropContext onDragEnd={onDragEnd}>
                          <Droppable droppableId="form-fields">
                            {(provided) => (
                              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                                {formFields.map((field, index) => (
                                  <Draggable key={field.id} draggableId={field.id} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="flex items-center space-x-1 bg-white p-1 rounded-md transition-all duration-200 hover:bg-white/20"
                                      >
                                        <GripVertical className="h-3 w-3 text-muted-foreground" />
                                        <div className="flex-grow">
                                          <label>{field.label}</label>
                                          {field.type === 'text' && (
                                            <Input className="h-6 text-xs"
                                              value={field.value || ''}
                                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                                            />
                                          )}
                                          {field.type === 'textarea' && (
                                            <Textarea className="h-6 text-xs"
                                              value={field.value || ''}
                                              onChange={(e) => handleInputChange(field.id, e.target.value)}
                                            />
                                          )}
                                          {field.type === 'number' && (
                                            <Input className="h-6 text-xs"
                                              type="number"
                                              value={field.value || ''}
                                              onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value))}
                                            />
                                          )}
                                          {field.type === 'select' && (
                                            <Select 
                                              onValueChange={(value) => handleInputChange(field.id, value)}
                                              defaultValue={field.value as string}
                                            >
                                              <SelectTrigger className="h-6 text-xs">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {field.options?.map((option) => (
                                                  <SelectItem key={option} value={option}>
                                                    {option}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          )}
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => handleRemoveField(index)} className="h-6 w-6 p-0">
                                          <MinusIcon className="h-3 w-3" />
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
                        <div className="flex justify-end space-x-4 mt-4 mr-4">
    <Button size="sm" disabled={!hasUnsavedChanges} onClick={handleSave}>
      <Save className="h-4 w-4 mr-2" />
      Save
    </Button>
  </div>
                      </CardContent>
                    </Card>

             
            {/* Primary Photo Section */}
            <AccordionItem value="primary-photo">
        <AccordionTrigger className="text-sm font-semibold">Primary Photo</AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center space-x-2">
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}

            {primaryPhoto ? (
              <div className="relative w-16 h-16">
                <img src={primaryPhoto} alt="Primary" className="w-full h-full object-cover rounded" />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-0 right-0 h-4 w-4 p-0"
                  onClick={() => {
                    setPrimaryPhoto(null);
                    setDownloadPrimaryPhotoLink(null);
                  }}
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
          {downloadPrimaryPhotoLink && (
            <a href={downloadPrimaryPhotoLink} target="_blank" rel="noopener noreferrer">
              Download Primary Photo
            </a>
          )}
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
                     <img src={image?.url} alt={`Gallery ${index}`} className="w-full h-full object-cover rounded" />
                    <Button
                                  size="sm"
                                  variant="destructive"
                                  className="absolute top-0 right-0 h-4 w-4 p-0"
                                  onClick={() => handleGalleryRemoveImage(image.id)}
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
                {isUploading && <div>Uploading...</div>}
        {isUploading && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}   {/* Reload button to trigger refetch */}

{!storedImages?.length && (
  <Button onClick={() => refetchProduct()}>
    <RefreshCcw />
  </Button>
)}


                <Button onClick={handleCancel} disabled={files.length === 0}>
          Cancel Upload
        </Button>


                                <Button                         disabled={!hasUnsavedImageGalleryChanges}
 onClick={handleSaveOrder}>Save Order</Button>
 <Button onClick={() => refetchProduct()}>
 <MagicWandIcon />
</Button>


              </AccordionContent>
            </AccordionItem>

          

            {/* OG Image Section */}
            <AccordionItem value="og-image">
        <AccordionTrigger className="text-sm font-semibold">OG Image</AccordionTrigger>
        <AccordionContent>

        {errorMessage && <div className="text-red-500">{errorMessage}</div>}

          <div className="flex items-center space-x-2">
            {ogImage ? (
              <div className="relative w-16 h-16">
                <img src={ogImage} alt="OG" className="w-full h-full object-cover rounded" />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-0 right-0 h-4 w-4 p-0"
                  onClick={() => {
                    setOgImage(null);
                    setDownloadOgLink(null);
                  }}
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
          </div>
          {downloadOgLink && (
            <a href={downloadOgLink} target="_blank" rel="noopener noreferrer">
              Download OG Image
            </a>
          )}
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
                        onChange={(e: { target: { value: string; }; }) => handleMetadataChange('title', e.target.value)}
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
                        onChange={(e: { target: { value: string; }; }) => handleMetadataChange('keywords', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>


             {/* Add Custom Field */}
             <AccordionItem value="custom-fields">
              <AccordionTrigger className="text-sm font-semibold">
            Advanced Options
              </AccordionTrigger>
              <AccordionContent>
               
              <h3 className="mt-4 text-xs font-semibold">Add Custom Field</h3>
        <div className="space-y-1 max-w-sm"
         id="custom-field-form">
        
                        
                          <Input
                                      className="text-xs h-7"
                            value={customFieldLabel}
                            onChange={(e) => setCustomFieldLabel(e.target.value)}
                            placeholder="Field Label"
                          />
                          <Select value={customFieldType} onValueChange={(value) => setCustomFieldType(value)}>
                            <SelectTrigger className="text-xs h-7">
                              <SelectValue  placeholder="Field Type">{customFieldType}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem className="text-xs" value="text">Text</SelectItem>
                              <SelectItem className="text-xs"  value="textarea">Textarea</SelectItem>
                              <SelectItem className="text-xs"  value="number">Number</SelectItem>
                              <SelectItem className="text-xs"  value="select">Select</SelectItem>
                            </SelectContent>
                          </Select>
                          {customFieldType === 'select' && (
                               <Input
              placeholder="Enter options (comma-separated)"
                              value={customFieldOptions}
                              onChange={(e) => setCustomFieldOptions(e.target.value)}
                              className="text-xs h-7"

                             />
                          )}
                          <Button  className="text-xs h-7" size="sm" onClick={handleAddCustomField}>
                            <PlusIcon className="mr-1" /> Add Field
                          </Button>
                        </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      case 'refine':
        return (
          
          
          <>coming sooon</>
        );
      case 'analytics':
        return (
          
          <>coming soon</>
        );
      default:
        return null;
    }
  };

  return (
    <div className="  w-full rounded-md mx-auto p-2 space-y-4 text-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Link href={"/"}>
          <Button variant="ghost" size="sm" className="h-6">
            <ChevronLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
          </Link>
         
          <div className="text-muted-foreground">
            Products /BREADCRUMBS
          </div>
        </div>
       
      </div>
      

     

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="pr-2" defaultSize={80}>

        <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full h-14"
      >
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="form" className="text-xs">
            Form Builder
          </TabsTrigger>
          <TabsTrigger value="refine" className="text-xs">
            Refine with AI
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">
            Analytics
          </TabsTrigger>
        </TabsList>
      </Tabs>

     
          {renderTabContent()}
          <div className="flex items-center space-x-2">
        
         
        </div>
        </ResizablePanel>
        <ResizableHandle withHandle />

        <ResizablePanel className=" pl-2 flex flex-col gap-8" defaultSize={30}>
        <Card>
                  <CardContent>
                    <div className="flex items-center space-x-4">
                    {hasUnsavedChanges && <span className="text-yellow-500 text-sm">Unsaved changes</span>}

                    </div>

                    <div className="p-4">
            {productData && (
              <div>
                <div className="relative w-full mb-4">
                  <div className="w-full" style={{ paddingBottom: '56.25%' }}>
                  <img
  src={primaryPhoto || '/placeholder.svg'} // Ensure fallback is handled
  alt="Primary"
  className="absolute inset-0 w-full h-full object-cover rounded-lg"
/>

                  </div>
                </div>
                <h3 className="mt-4 text-xl font-semibold">{productData.name}</h3>
                <p className="text-sm">{productData.description}</p>
                <p className="text-sm">Category: {productData.category}</p>
                <p className="text-sm">Price: ${productData.price?.toFixed(2)}</p>
                <p className="text-sm">Quantity: {productData.quantity}</p>
              </div>
            )}
          </div>



                    <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleDeleteSegment(SEGMENT_ID)}>Delete Segment</button>
                  </CardContent>
                </Card>
            
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
          handleSave={handleSave}  // Pass the save handler here
          versions={versionData?.ProductVersion || []}  // Pass the latest version data
          refetchProduct={refetchProduct}
          refetchVersions={refetchVersions}
        />


          <Button
            size="sm"
            className="h-6"
            onClick={handlePublish}
          >
            <Upload className="h-3 w-3 mr-1" />
            Publish
          </Button>
        </ResizablePanel>
      </ResizablePanelGroup>

      
    </div>
  );
}