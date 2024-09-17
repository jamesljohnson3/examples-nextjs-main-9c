'use client'
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MinusIcon, GripVertical, PlusIcon, ImageIcon } from 'lucide-react';
import { GET_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS } from '@/app/(shell)/(main)/queries';

// Define the interface for product data
interface ProductData {
  id: string;
  name: string;
  description: string;
  price?: number;
  quantity?: number;
  category?: string;
  primaryPhoto?: string;
  imageGallery?: string[];
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

interface Segment {
  id: string;
  name: string;
  content: string;
}

interface FormField {
  id: string;
  type: string;
  label: string;
  options?: string[];
  value?: string | number;
}

const initialAvailableFields: FormField[] = [
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'description', type: 'textarea', label: 'Description' },
  { id: 'price', type: 'number', label: 'Price' },
  { id: 'quantity', type: 'number', label: 'Quantity' },
  { id: 'category', type: 'select', label: 'Category', options: ['Electronics', 'Clothing', 'Food'] },
];

const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn"; // Example product ID
const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';

export default function ProductPage() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [remainingFields, setRemainingFields] = useState<FormField[]>(initialAvailableFields);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [previewData, setPreviewData] = useState<ProductData | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldType, setCustomFieldType] = useState('text');
  const [customFieldOptions, setCustomFieldOptions] = useState('');

  const [updateProductVersion] = useMutation(UPDATE_PRODUCT_VERSION);
  const [publishSegments] = useMutation(PUBLISH_SEGMENTS);

  // Fetch product data
  const { data: productDataQuery, loading: loadingProduct, error: errorProduct } = useQuery<{ Product: ProductData[] }>(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID }
  });

  // Fetch segments related to the product and domain
  const { data: segmentsData, loading: loadingSegments, error: errorSegments } = useQuery<{ Segments: Segment[] }>(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID }
  });

  useEffect(() => {
    if (productDataQuery?.Product) {
      const product = productDataQuery.Product[0];
      setProductData(product);
      setPreviewData(product);
      setFormFields(
        initialAvailableFields.map(field => ({
          ...field,
          value: product[field.id] || ''
        }))
      );
    }
  }, [productDataQuery]);

  useEffect(() => {
    if (segmentsData?.Segments) {
      setSegments(segmentsData.Segments);
    }
  }, [segmentsData]);

  const handleInputChange = (id: string, value: string | number) => {
    if (previewData) {
      setPreviewData(prevData => ({
        ...prevData,
        [id]: value
      }));
    }
    setHasUnsavedChanges(true);
  };

  const handleAddField = (newField: FormField) => {
    setFormFields(prev => [...prev, newField]);
    setRemainingFields(prev => prev.filter(field => field.id !== newField.id));
    setHasUnsavedChanges(true);
  };

  const handleRemoveField = (index: number) => {
    setFormFields(prev => {
      const updatedFields = [...prev];
      const removedField = updatedFields.splice(index, 1)[0];
      setRemainingFields(prev => [...prev, removedField]);
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
    if (previewData) {
      try {
        await updateProductVersion({ variables: { productData: previewData } });
        setHasUnsavedChanges(false);
        alert('Product version updated!');
      } catch (error) {
        console.error('Error updating product version:', error);
      }
    }
  };

  const handlePublish = async () => {
    try {
      await publishSegments({ variables: { segments } });
      alert('Segments published!');
    } catch (error) {
      console.error('Error publishing segments:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (previewData) {
            switch (type) {
              case 'gallery':
                setPreviewData(prev => ({
                  ...prev!,
                  imageGallery: [...(prev?.imageGallery || []), reader.result]
                }));
                break;
              case 'primary':
                setPreviewData(prev => ({
                  ...prev!,
                  primaryPhoto: reader.result
                }));
                break;
              case 'og':
                setPreviewData(prev => ({
                  ...prev!,
                  metadata: { ...prev.metadata, ogImage: reader.result }
                }));
                break;
            }
          }
          setHasUnsavedChanges(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMetadataChange = (key: string, value: string) => {
    if (previewData) {
      setPreviewData(prev => ({
        ...prev!,
        metadata: { ...prev.metadata, [key]: value }
      }));
      setHasUnsavedChanges(true);
    }
  };

  const handleAddCustomField = () => {
    const newField: FormField = {
      id: customFieldLabel.toLowerCase().replace(/\s+/g, '_'),
      type: customFieldType,
      label: customFieldLabel,
      options: customFieldType === 'select' ? customFieldOptions.split(',').map(opt => opt.trim()) : undefined,
    };
    handleAddField(newField);
    setCustomFieldLabel('');
    setCustomFieldType('text');
    setCustomFieldOptions('');
  };

  if (loadingProduct || loadingSegments) return <div>Loading...</div>;
  if (errorProduct || errorSegments) return <div>Error loading data</div>;

  return (
    <div className="product-page">
      <Tabs>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="form">Form Builder</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <div className="tab-content">
          {/* Form Builder Tab */}
          <Accordion type="single" collapsible>
            <AccordionItem value="product-form">
              <AccordionTrigger>Product Form</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="droppable">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {formFields.map((field, index) => (
                              <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex items-center space-x-2 p-2 border border-gray-300 rounded-md mb-2"
                                  >
                                    {field.type === 'text' && (
                                      <Input
                                        placeholder={field.label}
                                        value={previewData?.[field.id] || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                      />
                                    )}
                                    {field.type === 'textarea' && (
                                      <Textarea
                                        placeholder={field.label}
                                        value={previewData?.[field.id] || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                      />
                                    )}
                                    {field.type === 'number' && (
                                      <Input
                                        type="number"
                                        placeholder={field.label}
                                        value={previewData?.[field.id] || ''}
                                        onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value))}
                                      />
                                    )}
                                    {field.type === 'select' && (
                                      <Select
                                        value={String(previewData?.[field.id])}
                                        onValueChange={(value) => handleInputChange(field.id, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder={field.label} />
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
                                    <Button
                                      className="h-6 w-6 p-0"
                                      variant="ghost"
                                      onClick={() => handleRemoveField(index)}
                                    >
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

                    <div className="custom-field-form">
                      <Input
                        placeholder="Custom Field Label"
                        value={customFieldLabel}
                        onChange={(e) => setCustomFieldLabel(e.target.value)}
                      />
                      <Select
                        value={customFieldType}
                        onValueChange={(value) => setCustomFieldType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Field Type" />
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
                          placeholder="Options (comma separated)"
                          value={customFieldOptions}
                          onChange={(e) => setCustomFieldOptions(e.target.value)}
                        />
                      )}
                      <Button onClick={handleAddCustomField}>
                        <PlusIcon className="mr-1" /> Add Custom Field
                      </Button>
                    </div>

                    {hasUnsavedChanges && (
                      <Button onClick={handleSave}>Save</Button>
                    )}
                    <Button onClick={handlePublish}>Publish</Button>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Segments Tab */}
          <div>
            <h2>Segments</h2>
            {segments.length ? (
              <ul>
                {segments.map((segment) => (
                  <li key={segment.id}>{segment.name}</li>
                ))}
              </ul>
            ) : (
              <div>No segments available</div>
            )}
          </div>

          {/* Preview Tab */}
          <Card className="bg-white backdrop-blur-lg border-0">
            <CardContent className="p-2">
              <div className="bg-white p-2 rounded-md space-y-1">
                {previewData?.primaryPhoto ? (
                  <img src={previewData.primaryPhoto} alt="Primary" className="w-full h-24 object-cover rounded-md mb-2" />
                ) : (
                  <div className="w-full h-24 bg-white/20 rounded-md flex items-center justify-center mb-2">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                {previewData && (
                  <>
                    <div className="text-xs">
                      <span className="font-semibold">Name:</span> {previewData.name}
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold">Description:</span> {previewData.description}
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold">Price:</span> ${previewData.price ? previewData.price.toFixed(2) : 'N/A'}
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold">Quantity:</span> {previewData.quantity !== undefined ? previewData.quantity : 'N/A'}
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold">Category:</span> {previewData.category || 'N/A'}
                    </div>
                    {previewData.metadata && (
                      <>
                        <div className="text-xs mt-2">
                          <span className="font-semibold">Meta Title:</span> {previewData.metadata.title || 'N/A'}
                        </div>
                        <div className="text-xs">
                          <span className="font-semibold">Meta Description:</span> {previewData.metadata.description || 'N/A'}
                        </div>
                        <div className="text-xs">
                          <span className="font-semibold">Keywords:</span> {previewData.metadata.keywords || 'N/A'}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
