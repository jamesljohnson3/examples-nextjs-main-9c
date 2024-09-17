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
import { MinusIcon, GripVertical, PlusIcon } from 'lucide-react';
import { GET_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS } from '@/app/(shell)/(main)/queries';
import { v4 as uuidv4 } from 'uuid';

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
  id: string;         // Unique identifier for the segment
  name: string;       // Name of the segment
  slug: string;       // Slug for the segment (often used in URLs or as a unique identifier)
  post: string;       // JSON string representing additional data related to the segment
}


const initialAvailableFields: FormField[] = [
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'description', type: 'textarea', label: 'Description' },
  { id: 'price', type: 'number', label: 'Price' },
  { id: 'quantity', type: 'number', label: 'Quantity' },
  { id: 'category', type: 'select', label: 'Category', options: ['Electronics', 'Clothing', 'Food'] },
];

export default function ProductPage() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [remainingFields, setRemainingFields] = useState<FormField[]>(initialAvailableFields);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldType, setCustomFieldType] = useState('text');
  const [customFieldOptions, setCustomFieldOptions] = useState('');

  const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
  const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';

  const { data: productDataQuery, loading: loadingProduct } = useQuery(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID }
  });

  const { data: segmentsData, loading: loadingSegments } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID }
  });

  const [updateProductVersion] = useMutation(UPDATE_PRODUCT_VERSION);
  const [publishSegments] = useMutation(PUBLISH_SEGMENTS);

  useEffect(() => {
    if (productDataQuery?.Product) {
      const product = productDataQuery.Product[0];
      setProductData(product);
      setFormFields(
        initialAvailableFields.map(field => ({
          ...field,
          value: product[field.id] || ''
        }))
      );
    }
  }, [productDataQuery]);

  useEffect(() => {
    if (segmentsData?.segments) {
      setSegments(segmentsData.segments);
    }
  }, [segmentsData]);

  const handleInputChange = (fieldId: string, value: string | number) => {
    if (productData) {
      setProductData(prev => ({
        ...prev!,
        [fieldId]: value
      }));
    }
    setFormFields(prev =>
      prev.map(field => (field.id === fieldId ? { ...field, value } : field))
    );
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
    try {
      // Generate Unix timestamp for versionNumber
      const versionNumber = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds

      // Generate a UUID for the id
      const id = uuidv4();

      // Update product version
      await updateProductVersion({
        variables: {
          productId: PRODUCT_ID,
          versionNumber: versionNumber,
          changes: "Updated product version",
          data: productData, // Ensure productData matches the ProductInput type
          id: id // Use the generated UUID
        }
      });

      // Save the productVersionId to local storage
      localStorage.setItem('productVersionId', id);

      alert('Product version updated and saved!');
    } catch (error) {
      console.error('Error updating product version:', error);
    }
  };

  const handlePublish = async () => {
    try {
      // Retrieve the productVersionId from local storage
      const productVersionId = localStorage.getItem('productVersionId');
  
      if (!productVersionId) {
        alert('Product version ID not found in local storage.');
        return;
      }
  
     
      
      // Get the ID of the first segment
      const segmentId = segments[0]?.id;
  
      if (!segmentId) {
        alert('No segment ID available.');
        return;
      }
  
      await publishSegments({
        variables: { id: segmentId, productVersionId }
      });
  
      alert('Segment published!');
    } catch (error) {
      console.error('Error publishing segment:', error);
      alert('Failed to publish segment.');
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

  if (loadingProduct || loadingSegments) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-page">
      <Tabs>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="form">Form Builder</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          
        </TabsList>

        <div className="tab-content">
          <Accordion type="single" collapsible>
            <AccordionItem value="product-form">
              <AccordionTrigger>Product Form</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="form-fields">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef}>
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
                                    {field.type === 'text' && (
                                      <Input
                                        placeholder={field.label}
                                        value={field.value || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                      />
                                    )}
                                    {field.type === 'textarea' && (
                                      <Textarea
                                        placeholder={field.label}
                                        value={field.value || ''}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                      />
                                    )}
                                    {field.type === 'number' && (
                                      <Input
                                        type="number"
                                        placeholder={field.label}
                                        value={field.value || ''}
                                        onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value))}
                                      />
                                    )}
                                    {field.type === 'select' && (
                                      <Select
                                        value={field.value || ''}
                                        onValueChange={(value) => handleInputChange(field.id, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder={field.label} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {(field.options || []).map(option => (
                                            <SelectItem key={option} value={option}>
                                              {option}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                     <Button className="h-6 w-6 p-0" variant="ghost" onClick={() => handleRemoveField(index)}>
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

          <div className="mt-4">
            <Card>
              <CardContent>
                <h2 className="text-lg font-bold mb-2">Product Preview</h2>
                <div className="p-4 border rounded-lg">
                  {productData && (
                    <div>
                      <h3 className="text-xl font-semibold">{productData.name}</h3>
                      <p className="text-sm text-gray-500">{productData.description}</p>
                      <p className="text-md font-bold">${productData.price.toFixed(2)}</p>
                      <p className="text-sm">Quantity: {productData.quantity}</p>
                      <p className="text-sm">Category: {productData.category}</p>
                    </div>
                  )}
                  {!productData && <p>No product data available.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
