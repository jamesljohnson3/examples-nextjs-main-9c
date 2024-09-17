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

// Define interfaces for form fields, product data, and segments
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
  content: string;
}

// Mocked initial available form fields
const availableFields: FormField[] = [
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'description', type: 'textarea', label: 'Description' },
  { id: 'price', type: 'number', label: 'Price' },
  { id: 'quantity', type: 'number', label: 'Quantity' },
  { id: 'category', type: 'select', label: 'Category', options: ['Electronics', 'Clothing', 'Food'] },
];

export default function ProductPage() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
  const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';

  // Fetch product data
  const { data: productDataQuery, loading: loadingProduct } = useQuery(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID }
  });

  // Fetch segments related to the product and domain
  const { data: segmentsData, loading: loadingSegments } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID }
  });

  const [updateProductVersion] = useMutation(UPDATE_PRODUCT_VERSION);
  const [publishSegments] = useMutation(PUBLISH_SEGMENTS);

  useEffect(() => {
    if (productDataQuery?.product) {
      setProductData(productDataQuery.product);
      setFormFields(availableFields.map(field => ({
        ...field,
        value: productDataQuery.product[field.id] || ''
      })));
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
    setFormFields(prev => [
      ...prev,
      { ...newField, value: productData ? productData[newField.id] || '' : '' }
    ]);
    setHasUnsavedChanges(true);
  };

  const handleRemoveField = (index: number) => {
    setFormFields(prev => {
      const updatedFields = [...prev];
      updatedFields.splice(index, 1);
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
      await updateProductVersion({ variables: { productData } });
      setHasUnsavedChanges(false);
      alert('Product version updated!');
    } catch (error) {
      console.error('Error updating product version:', error);
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
          {/* Form Builder Tab */}
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
                                    <Button  className="h-6 w-6 p-0" variant="ghost" onClick={() => handleRemoveField(index)}>
                                      <MinusIcon className="h-3 w-3"  />
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
                    <div className="flex space-x-1">                      {availableFields.map((element) => (
                        <Button
                          key={element.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddField(element)}
                          className="text-xs py-1 px-2"
                        >
                          <PlusIcon className="h-3 w-3 mr-1" /> {element.label}
                        </Button>
                      ))}
                    </div>
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
            {/* Render segments here if needed */}
            <h2>Segments</h2>
            {segments.length === 0 ? (
              <p>No segments available.</p>
            ) : (
              segments.map((segment) => (
                <div key={segment.id} className="segment-item">
                  <h3>{segment.name}</h3>
                  <p>{segment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
