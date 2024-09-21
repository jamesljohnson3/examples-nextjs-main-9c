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
import React, { useState, useEffect, memo, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client'; 
import { GET_PRODUCT, SAVE_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS, UPDATE_SEGMENT, GET_PRODUCT_VERSIONS } from '@/app/(shell)/(main)/queries';
import { v4 as uuidv4 } from 'uuid';
 import { DELETE_SEGMENT } from './mutations';

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


export default function EnhancedProductMoodboard() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [remainingFields, setRemainingFields] = useState<FormField[]>(initialAvailableFields);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [imageGallery, setImageGallery] = useState<{ id: string; url: string }[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
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
  const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
  const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';
  const SEGMENT_ID = 'unique-segment-id';

  const [deleteSegment, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_SEGMENT, {
    onCompleted: () => alert('Segment deleted successfully!'),
    onError: (error) => {
      console.error('Error deleting segment:', error);
      alert('Error deleting segment.');
    }
  });
  
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
  
  const { data: productDataQuery, loading: loadingProduct } = useQuery(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID }
  });

  const { data: segmentsData, loading: loadingSegments } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID }
  });

  const [updateProductVersion] = useMutation(UPDATE_PRODUCT_VERSION);
  const [publishSegments] = useMutation(PUBLISH_SEGMENTS);
  const [saveProduct] = useMutation(SAVE_PRODUCT);
  const [UpdateSegment] = useMutation(UPDATE_SEGMENT);
  
  
  
  useEffect(() => {
    // Reserved fields validation and dynamic check
    // const reservedFields = RESERVED_FIELDS;

    if (productDataQuery?.Product) {
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
      const initialGallery = loadedProductData.imageGallery?.map((url: any) => ({
        id: url,
        url,
      })) || JSON.parse(localStorage.getItem('imageGallery') || '[]');
      setImageGallery(initialGallery);

      // Initialize form fields from available fields and product data
      const initialFields = initialAvailableFields.map(field => ({
        ...field,
        value: loadedProductData[field.id] || '',
      }));

      // Filter out fields already populated in the form
      const excludedFields = new Set(initialFields.map(field => field.id));
      const updatedRemainingFields = initialAvailableFields.filter(field => !excludedFields.has(field.id));

      setFormFields(initialFields);  // Set initialized fields
      setRemainingFields(updatedRemainingFields);  // Set remaining available fields
    }

    if (segmentsData) {
      setSegments(segmentsData.Segment);

      // Extract and flatten segment fields
      const segmentFields = segmentsData.Segment.flatMap((segment: Segment) =>
        Object.values(segment.post).map(field => ({
          id: field.id || uuidv4(),  // Unique ID if missing
          type: field.type || 'text',  // Default to 'text'
          label: field.label || '',  // Default empty label
          value: field.value || '',  // Default empty value
          options: field.options || [],  // Default empty options array
        }))
      );

      // Merge formFields and segmentFields, avoiding duplicates by id or label
      const mergedFields = [...formFields, ...segmentFields].reduce((acc: FormField[], current: FormField) => {
        if (!acc.find(field => field.id === current.id || field.label === current.label)) {
          acc.push(current);
        }
        return acc;
      }, []);

      setFormFields(mergedFields);  // Set merged fields in the form
    }
  }, [productDataQuery, segmentsData]);

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
          imageGallery: imageGallery.map((img) => img.url), // Save the updated image gallery order
        },
      });

      const versionNumber = Math.floor(Date.now() / 1000);
      const uuid = uuidv4();

      await updateProductVersion({
        variables: {
          productId: PRODUCT_ID,
          versionNumber,
          changes: "Updated product version",
          data: productData,
          id: uuid,
        },
      });

      localStorage.setItem('productVersionId', uuid);
      setHasUnsavedChanges(false);
      alert('Product version updated and saved!');
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

    
  if (loadingProduct || loadingSegments) {
    return <div>Loading...</div>;
  }


  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'gallery' | 'primary' | 'og'
  ) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        switch (type) {
          case 'gallery':
            setImageGallery([...imageGallery, reader.result as string]);
            break;
          case 'primary':
            setPrimaryPhoto(reader.result as string);
            break;
          case 'og':
            setOgImage(reader.result as string);
            break;
        }
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMetadataChange = (
    key: 'title' | 'description' | 'keywords',
    value: string
  ) => {
    setMetadata({ ...metadata, [key]: value });
    setHasUnsavedChanges(true);
  };




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
    setHasUnsavedChanges(true);
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
    <div className="container mx-auto p-2 space-y-2 text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-6">
            <ChevronLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
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
        className="w-full h-12"
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