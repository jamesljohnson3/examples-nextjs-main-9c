'use client'
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
import { Card, CardContent } from "@/components/ui/card";
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
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client'; 
import { GET_PRODUCT, SAVE_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS, UPDATE_SEGMENT } from '@/app/(shell)/(main)/queries';
import { v4 as uuidv4 } from 'uuid';
import { DELETE_SEGMENT } from './mutations'; // Update the path if needed

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
  price: number;
  quantity: number;
  category: string;
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

const sampleProductData: ProductData = {
  id: 'PROD-12345',
  name: 'Wireless Earbuds',
  description: 'High-quality wireless earbuds with noise cancellation',
  price: 99.99,
  quantity: 500,
  category: 'Electronics',
};

export default function EnhancedProductMoodboard() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [remainingFields, setRemainingFields] = useState<FormField[]>(initialAvailableFields);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [imageGallery, setImageGallery] = useState<string[]>([]);
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

  const handleDeleteSegment = async (segmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this segment?')) {
      return;
    }
    try {
      await deleteSegment({ variables: { segmentId } });
    } catch (error) {
      console.error('Error executing delete mutation:', error);
      alert('An error occurred while deleting the segment.');
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
  const [updateSegment] = useMutation(UPDATE_SEGMENT);

  useEffect(() => {
    if (productDataQuery?.Product?.length > 0) {
      setProductData(productDataQuery.Product[0]);
      const product = productDataQuery.Product[0]; 

      const initialFields = initialAvailableFields.map(field => ({
        ...field,
        value: product[field.id] || '', 
      }));

      setFormFields(initialFields);

      const excludedFields = new Set(initialFields.map(field => field.id));
      const updatedRemainingFields = initialAvailableFields.filter(field => !excludedFields.has(field.id));
      setRemainingFields(updatedRemainingFields);
    }
  }, [productDataQuery]);

  useEffect(() => {
    if (segmentsData?.Segment?.length > 0) {
      setSegments(segmentsData.Segment);

      const segmentFields: FormField[] = segmentsData.Segment.flatMap((segment: Segment) =>
        Object.values(segment.post).map((field: any) => ({
          id: field.id || uuidv4(), 
          type: field.type || 'text',
          label: field.label || '',
          value: field.value || '',
          options: field.options || [],
        }))
      );

      setFormFields(segmentFields);
    }
  }, [segmentsData]);

  const handleInputChange = useCallback((fieldId: string, value: string | number) => {
    setProductData(prev => ({ ...prev, [fieldId]: value }));

    setFormFields(prev =>
      prev.map(field => (field.id === fieldId ? { ...field, value } : field))
    );
    setHasUnsavedChanges(true);
  }, []);

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

    try {
      // Extract and parse price and quantity
      const parsedPrice = parseFloat(productData.price as unknown as string);
      const parsedQuantity = parseInt(productData.quantity as unknown as string);

      if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
        alert('Invalid price or quantity');
        return;
      }

      await saveProduct({
        variables: {
          productId: PRODUCT_ID,
          name: productData.name,
          description: productData.description,
          price: parsedPrice,
          quantity: parsedQuantity,
          category: productData.category,
        },
      });

      const versionNumber = Math.floor(Date.now() / 1000);
      const uuid = uuidv4(); 

      await updateProductVersion({
        variables: {
          productId: PRODUCT_ID,
          versionNumber,
          changes: 'Updated product version',
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

      await publishSegments({
        variables: { id: SEGMENT_ID, productVersionId }, 
      });

      await updateSegment({ 
        variables: {
          id: SEGMENT_ID,
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
    if (!customFieldLabel.trim()) {
      alert('Field label cannot be empty.');
      return;
    }

    const newFieldId = customFieldLabel.toLowerCase().replace(/\s+/g, '_');

    if (RESERVED_FIELDS.has(newFieldId)) {
      alert('Cannot use reserved field ID.');
      return;
    }

    if (formFields.find(field => field.id === newFieldId)) {
      alert('Field with this label already exists.');
      return;
    }

    const newField: FormField = {
      id: newFieldId,
      type: customFieldType,
      label: customFieldLabel,
      options: customFieldType === 'select' ? customFieldOptions.split(',').map(opt => opt.trim()) : undefined,
    };

    handleAddField(newField);

    setCustomFieldLabel('');
    setCustomFieldType('text');
    setCustomFieldOptions('');
  };
  

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

  if (loadingProduct || loadingSegments || deleteLoading) {
    return <div>Loading...</div>; 
  }

  if (deleteError) {
    return <p>Error: {deleteError.message}</p>; 
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'form':
        return (
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="product-form">
              <AccordionTrigger className="text-sm font-semibold">
                Product Form
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
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

                    <div className="custom-field-form mt-4"> 
                      <Input
                        value={customFieldLabel}
                        onChange={(e) => setCustomFieldLabel(e.target.value)}
                        placeholder="Field Label"
                      />
                      <Select value={customFieldType} onValueChange={(value) => setCustomFieldType(value)}>
                        <SelectTrigger>
                          <SelectValue>{customFieldType}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                        </SelectContent>
                      </Select>
                      {customFieldType === 'select' && (
                        <Textarea
                          value={customFieldOptions}
                          onChange={(e) => setCustomFieldOptions(e.target.value)}
                          placeholder="Comma-separated options"
                        />
                      )}
                      <Button onClick={handleAddCustomField} className="mt-2">
                        <PlusIcon className="mr-1" /> Add Custom Field
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="image-gallery">
              <AccordionTrigger className="text-sm font-semibold">
                Image Gallery
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-2 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {imageGallery.map((img, index) => (
                        <div key={index} className="w-16 h-16 relative">
                          <img
                            src={img}
                            alt={`Gallery ${index}`}
                            className="w-full h-full object-cover rounded"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-0 right-0 h-4 w-4 p-0"
                            onClick={() => {
                              const newGallery = [...imageGallery];
                              newGallery.splice(index, 1);
                              setImageGallery(newGallery);
                              setHasUnsavedChanges(true);
                            }}
                          >
                            <MinusIcon className="h-2 w-2" />
                          </Button>
                        </div>
                      ))}
                      <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, 'gallery')
                          }
                          accept="image/*"
                        />
                        <PlusIcon className="h-6 w-6 text-muted-foreground" />
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="primary-photo">
              <AccordionTrigger className="text-sm font-semibold">
                Primary Photo
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      {primaryPhoto ? (
                        <div className="w-16 h-16 relative">
                          <img
                            src={primaryPhoto}
                            alt="Primary"
                            className="w-full h-full object-cover rounded"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-0 right-0 h-4 w-4 p-0"
                            onClick={() => {
                              setPrimaryPhoto(null);
                              setHasUnsavedChanges(true);
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
                            onChange={(e) =>
                              handleImageUpload(e, 'primary')
                            }
                            accept="image/*"
                          />
                          <Image className="h-6 w-6 text-muted-foreground" />
                        </label>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Set as primary product image
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

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
                            onClick={() => {
                              setOgImage(null);
                              setHasUnsavedChanges(true);
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
                            onChange={(e) =>
                              handleImageUpload(e, 'og')
                            }
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
                        onChange={(e) =>
                          handleMetadataChange('title', e.target.value)
                        }
                      />
                      <Textarea
                        placeholder="Meta Description"
                        className="h-12 text-xs"
                        value={metadata.description}
                        onChange={(e) =>
                          handleMetadataChange(
                            'description',
                            e.target.value
                          )
                        }
                      />
                      <Input
                        placeholder="Keywords (comma-separated)"
                        className="h-6 text-xs"
                        value={metadata.keywords}
                        onChange={(e) =>
                          handleMetadataChange('keywords', e.target.value)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
  
      case 'refine':
        return <>Coming Soon</>; 
      case 'analytics':
        return <>Coming Soon</>; 
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
            Products / {/* ... BREADCRUMBS ... */}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && <span className="text-yellow-500">Unsaved changes</span>}
          <Button size="sm" className="h-6" onClick={handleSave}>
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button size="sm" className="h-6" onClick={handlePublish}>
            <Upload className="h-3 w-3 mr-1" />
            Publish
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="pr-2" defaultSize={70}> 
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-10">
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="form" className="text-xs">Form Builder</TabsTrigger>
              <TabsTrigger value="refine" className="text-xs">Refine with AI</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
            </TabsList>
          </Tabs>
          {renderTabContent()}
        </ResizablePanel>
        <ResizableHandle /> 

        <ResizablePanel defaultSize={30}> 
          <Card>
            <CardContent>
              <h2 className="text-lg font-bold mb-2">Product Preview</h2>
              {productData && (
                <div>
                  <img
                    src="https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg"
                    alt="Placeholder Image"
                    className="w-full h-48 object-cover mb-4 rounded-lg"
                  />
                  <h2 className="text-lg font-bold mb-2">{productData.name}</h2>
                  <p className="text-sm text-gray-500">{productData.description}</p>
                  <p className="text-md font-bold">${productData.price.toFixed(2)}</p>
                  <p className="text-sm">Quantity: {productData.quantity}</p>
                  <p className="text-sm">Category: {productData.category}</p>
                </div>
              )}
              {!productData && <p>No product data available.</p>}
              <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={() => handleDeleteSegment(SEGMENT_ID)}>
                Delete Segment
              </button>
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}