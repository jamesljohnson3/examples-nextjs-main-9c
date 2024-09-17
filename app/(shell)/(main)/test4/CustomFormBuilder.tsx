"use client"
import React, { useState, useEffect, memo } from 'react';
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
import { DELETE_SEGMENT } from './mutations';  // Adjust import path as needed

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
  post: string;
}

const initialAvailableFields: FormField[] = [
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'description', type: 'textarea', label: 'Description' },
  { id: 'price', type: 'number', label: 'Price' },
  { id: 'quantity', type: 'number', label: 'Quantity' },
  { id: 'category', type: 'select', label: 'Category', options: ['Electronics', 'Clothing', 'Food'] },
];

const ProductPage: React.FC = () => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [reservedFields, setReservedFields] = useState<FormField[]>([]);
  const [availableFields, setAvailableFields] = useState<FormField[]>(initialAvailableFields);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldType, setCustomFieldType] = useState('text');
  const [customFieldOptions, setCustomFieldOptions] = useState('');

  const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
  const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';
  const SEGMENT_ID = 'unique-segment-id';

  const [deleteSegment, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_SEGMENT, {
    onCompleted: () => {
      alert('Segment deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting segment:', error);
      alert('Error deleting segment.');
    }
  });

  const handleDeleteSegment = async (segmentId: string) => {
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

  useEffect(() => {
    if (productDataQuery?.Product) {
      const product = productDataQuery.Product[0];
      const initialFields: FormField[] = initialAvailableFields.map(field => ({
        ...field,
        value: product[field.id] || ''
      }));

      const reserved = initialFields.filter(field => RESERVED_FIELDS.has(field.id));
      const available = initialFields.filter(field => !RESERVED_FIELDS.has(field.id));

      setFormFields(available);
      setReservedFields(reserved);
      setAvailableFields(initialAvailableFields.filter(field => !RESERVED_FIELDS.has(field.id)));
      setProductData(product);
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
    if (RESERVED_FIELDS.has(newField.id)) {
      alert('Cannot add reserved field.');
      return;
    }

    setFormFields(prev => [...prev, newField]);
    setAvailableFields(prev => prev.filter(field => field.id !== newField.id));
    setHasUnsavedChanges(true);
  };

  const handleRemoveField = (index: number) => {
    const field = formFields[index];
    setFormFields(prev => prev.filter((_, i) => i !== index));

    if (RESERVED_FIELDS.has(field.id)) {
      setReservedFields(prev => [...prev, field]);
    } else {
      setAvailableFields(prev => [...prev, field].sort((a, b) => a.label.localeCompare(b.label)));
    }

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
        alert('No product version ID found.');
        return;
      }

      await publishSegments({
        variables: {
          productVersionId,
          segments: segments.map(segment => ({
            id: segment.id,
            name: segment.name,
            slug: segment.slug,
            post: segment.post
          })),
        },
      });

      alert('Segments published successfully!');
    } catch (error) {
      console.error('Error publishing segments:', error);
      alert('Failed to publish segments.');
    }
  };

  const handleAddCustomField = () => {
    if (!customFieldLabel) {
      alert('Field label is required.');
      return;
    }

    if (RESERVED_FIELDS.has(customFieldLabel)) {
      alert('Field label is reserved.');
      return;
    }

    const newField: FormField = {
      id: uuidv4(),
      type: customFieldType,
      label: customFieldLabel,
      options: customFieldType === 'select' ? customFieldOptions.split(',').map(opt => opt.trim()) : undefined
    };

    handleAddField(newField);
    setCustomFieldLabel('');
    setCustomFieldType('text');
    setCustomFieldOptions('');
  };

  return (
    <div>
      <h1>Product Page</h1>
      <div>
        <Button onClick={handleSave} disabled={!hasUnsavedChanges}>Save</Button>
        <Button onClick={handlePublish} disabled={!hasUnsavedChanges}>Publish</Button>
      </div>
      <Tabs defaultValue="fields">
        <TabsList>
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>
        <div>
          <div>
            <h2>Form Fields</h2>
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
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <CardContent>
                              <div>
                                <label>{field.label}</label>
                                {field.type === 'text' && (
                                  <Input
                                    type="text"
                                    value={field.value || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                  />
                                )}
                                {field.type === 'textarea' && (
                                  <Textarea
                                    value={field.value || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                  />
                                )}
                                {field.type === 'number' && (
                                  <Input
                                    type="number"
                                    value={field.value || ''}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                  />
                                )}
                                {field.type === 'select' && field.options && (
                                  <Select
                                    value={field.value || ''}
                                    onValueChange={(value) => handleInputChange(field.id, value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {field.options.map(option => (
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                              <Button onClick={() => handleRemoveField(index)}>
                                <MinusIcon />
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div>
            <h2>Available Fields</h2>
            {availableFields.map(field => (
              <Button
                key={field.id}
                onClick={() => handleAddField(field)}
              >
                Add {field.label}
              </Button>
            ))}
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="custom">
              <AccordionTrigger>Add Custom Field</AccordionTrigger>
              <AccordionContent>
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
                    placeholder="Comma separated options"
                    value={customFieldOptions}
                    onChange={(e) => setCustomFieldOptions(e.target.value)}
                  />
                )}
                <Button onClick={handleAddCustomField}>Add Field</Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div>
            <h2>Segments</h2>
            {segments.map(segment => (
              <Card key={segment.id}>
                <CardContent>
                  <h3>{segment.name}</h3>
                  <p>{segment.slug}</p>
                  <Button
                    onClick={() => handleDeleteSegment(segment.id)}
                    disabled={deleteLoading}
                  >
                    Delete Segment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default memo(ProductPage);
