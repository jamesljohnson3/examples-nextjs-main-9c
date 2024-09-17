'use client'
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
 import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
 import { 
  MinusIcon, GripVertical, 
  Save
  } from 'lucide-react';
import { GET_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN } from '@/app/(shell)/(main)/queries';

interface FormField {
  id: string;
  type: string;
  label: string;
  options?: string[]; // For 'select' field type
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

interface Segment {
  id: string;
  name: string;
  content: string;
}

// Mocked initial form fields
const initialFormElements: FormField[] = [
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'description', type: 'textarea', label: 'Description' },
  { id: 'price', type: 'number', label: 'Price' },
  { id: 'quantity', type: 'number', label: 'Quantity' },
  { id: 'category', type: 'select', label: 'Category', options: ['Electronics', 'Clothing', 'Food'] },
];

export default function ProductPage() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [availableFields, setAvailableFields] = useState<FormField[]>([]);
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

  useEffect(() => {
    if (productDataQuery) {
      setProductData(productDataQuery.product);
      setFormFields(initialFormElements); // You can customize initial form fields based on the product
    }
  }, [productDataQuery]);

  useEffect(() => {
    if (segmentsData) {
      setSegments(segmentsData.segments);
    }
  }, [segmentsData]);

  // Handle input changes in form fields
  const handleInputChange = (fieldId: string, value: string | number) => {
    if (productData) {
      setProductData({
        ...productData,
        [fieldId]: value
      });
      setHasUnsavedChanges(true);
    }
  };

  // Handle adding a custom form field
  const handleAddField = (newField: FormField) => {
    setFormFields([...formFields, newField]);
    setHasUnsavedChanges(true);
  };

  // Handle removing a form field
  const handleRemoveField = (index: number) => {
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
    setHasUnsavedChanges(true);
  };

  // Handle drag-and-drop form reordering
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedFields = Array.from(formFields);
    const [reorderedItem] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, reorderedItem);
    setFormFields(reorderedFields);
  };

  // Render the form fields dynamically based on their type
  const renderFieldInput = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            key={field.id}
            placeholder={field.label}
            value={(productData as any)?.[field.id] || ''}
            onChange={(e: { target: { value: string | number; }; }) => handleInputChange(field.id, e.target.value)}
          />
        );
      case 'textarea':
        return (
          <Textarea
            key={field.id}
            placeholder={field.label}
            value={(productData as any)?.[field.id] || ''}
            onChange={(e: { target: { value: string | number; }; }) => handleInputChange(field.id, e.target.value)}
          />
        );
      case 'number':
        return (
          <Input
            key={field.id}
            type="number"
            placeholder={field.label}
            value={(productData as any)?.[field.id] || ''}
            onChange={(e: { target: { value: string; }; }) => handleInputChange(field.id, parseFloat(e.target.value))}
          />
        );
      case 'select':
        return (
          <Select
            key={field.id}
            value={(productData as any)?.[field.id] || ''}
            onValueChange={(value: string | number) => handleInputChange(field.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.label} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  // Function to publish updates (mock mutation)
  const handlePublish = () => {
    // Implement your mutation logic here
    console.log('Publishing updates:', productData, segments);
    setHasUnsavedChanges(false);
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
                                    className="field-item"
                                  >
                                    <GripVertical />
                                    {renderFieldInput(field)}
                                    <Button variant="ghost" onClick={() => handleRemoveField(index)}>
                                      <MinusIcon />
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
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Segments Tab */}
          <Accordion type="single" collapsible>
            <AccordionItem value="segments">
              <AccordionTrigger>Manage Segments</AccordionTrigger>
              <AccordionContent>
                
                
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Publish Changes */}
        <div className="actions">
          {hasUnsavedChanges && (
            <Button onClick={handlePublish}>
              <Save /> Publish Changes
            </Button>
          )}
        </div>
      </Tabs>
    </div>
  );
}
