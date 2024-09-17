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
import { GET_PRODUCT, SAVE_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS } from '@/app/(shell)/(main)/queries';
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
  id: string;
  name: string;
  slug: string;
  post: string;
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
  const SEGMENT_ID = 'unique-segment-id';

  const { data: productDataQuery, loading: loadingProduct } = useQuery(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID }
  });

  const { data: segmentsData, loading: loadingSegments } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID }
  });

  const [updateProductVersion] = useMutation(UPDATE_PRODUCT_VERSION);
  const [publishSegments] = useMutation(PUBLISH_SEGMENTS);
  const [saveProduct] = useMutation(SAVE_PRODUCT);

  useEffect(() => {
    if (productDataQuery?.Product) {
      const product = productDataQuery.Product[0];
      setProductData(product);
      const initialFields = initialAvailableFields.map(field => ({
        ...field,
        value: product[field.id] || ''
      }));
      setFormFields(initialFields);
      const excludedFields = new Set(initialFields.map(field => field.id));
      const updatedRemainingFields = initialAvailableFields.filter(field => !excludedFields.has(field.id));
      setRemainingFields(updatedRemainingFields);
    }
  }, [productDataQuery]);

  useEffect(() => {
    if (segmentsData?.Segment) {
      setSegments(segmentsData.Segment);
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
      await saveProduct({
        variables: {
          productId: PRODUCT_ID,
          name,
          description,
          price: parsedPrice,
          quantity: parsedQuantity,
          category,
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
  
      const segmentId = segments[0]?.id;
  
      if (!SEGMENT_ID) {
        alert('No segment ID available.');
        return;
      }
  
      await publishSegments({
        variables: { id: SEGMENT_ID, productVersionId }
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
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Field Label"
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
                          <Input
                            placeholder="Options (comma separated)"
                            value={customFieldOptions}
                            onChange={(e) => setCustomFieldOptions(e.target.value)}
                          />
                        )}
                        <Button onClick={handleAddCustomField}>Add Custom Field</Button>
                      </div>
                    </div>

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
                                    className="field-item"
                                  >
                                    <div className="flex items-center">
                                      <GripVertical className="h-5 w-5 mr-2" />
                                      {field.label}
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRemoveField(index)}
                                        className="ml-auto"
                                      >
                                        <MinusIcon className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    {field.type === 'text' && (
                                      <Input
                                        value={field.value as string}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                      />
                                    )}
                                    {field.type === 'textarea' && (
                                      <Textarea
                                        value={field.value as string}
                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                      />
                                    )}
                                    {field.type === 'number' && (
                                      <Input
                                        type="number"
                                        value={field.value as number}
                                        onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value))}
                                      />
                                    )}
                                    {field.type === 'select' && (
                                      <Select
                                        value={field.value as string}
                                        onValueChange={(value) => handleInputChange(field.id, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {field.options?.map(option => (
                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>

                    <div className="flex justify-end mt-4 space-x-2">
                      <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
                        Save
                      </Button>
                      <Button onClick={handlePublish}>
                        Publish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <AccordionItem value="segments">
            <AccordionTrigger>Segments</AccordionTrigger>
            <AccordionContent>
              <div>
                <h3>Available Segments</h3>
                <ul>
                  {segments.map(segment => (
                    <li key={segment.id}>{segment.name}</li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>
      </Tabs>
    </div>
  );
}
