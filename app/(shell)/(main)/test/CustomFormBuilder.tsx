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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
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

  const [deleteSegment, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_SEGMENT, {
    onCompleted: () => {
      alert('Segment deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting segment:', error);
      alert('Error deleting segment.');
    }
  });

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

      // Initialize formFields with fetched data
      const initialFields = initialAvailableFields.map(field => ({
        ...field,
        value: product[field.id] || ''
      }));

      setFormFields(initialFields);

      // Exclude these fields from remainingFields
      const excludedFields = new Set(initialFields.map(field => field.id));
      const updatedRemainingFields = initialAvailableFields.filter(field => !excludedFields.has(field.id));

      setRemainingFields(updatedRemainingFields);
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
    setRemainingFields(prev => prev.filter(field => field.id !== newField.id));
    setHasUnsavedChanges(true);
  };

  const handleRemoveField = (index: number) => {
    setFormFields(prev => {
      const updatedFields = [...prev];
      const removedField = updatedFields.splice(index, 1)[0];

      // Add the removed field back to remainingFields if it was not reserved
      if (!RESERVED_FIELDS.has(removedField.id)) {
        setRemainingFields(prev => [...prev, removedField].sort((a, b) => a.label.localeCompare(b.label)));
      }

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

    // Parse price and quantity correctly
    const parsedPrice = parseFloat(price as unknown as string); // Cast to string then parse
    const parsedQuantity = parseInt(quantity as unknown as string); // Cast to string then parse

    if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
      alert('Invalid price or quantity');
      return;
    }

    try {
      // Execute the mutation with the parsed product data
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

      // Generate Unix timestamp for versionNumber
      const versionNumber = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds

      // Generate a UUID for the id
      const uuid = uuidv4();

      // Update product version
      await updateProductVersion({
        variables: {
          productId: PRODUCT_ID,
          versionNumber,
          changes: "Updated product version",
          data: productData, // Ensure productData matches the ProductInput type
          id: uuid,
        },
      });

      // Save the productVersionId to local storage
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
            post: segment.post,
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
    if (!customFieldLabel.trim()) {
      alert('Field label cannot be empty.');
      return;
    }

    const newField: FormField = {
      id: customFieldLabel.toLowerCase().replace(/\s+/g, '_'),
      label: customFieldLabel,
      type: customFieldType,
      options: customFieldType === 'select' ? customFieldOptions.split(',').map(opt => opt.trim()) : undefined,
    };

    setFormFields(prev => [...prev, newField]);
    setCustomFieldLabel('');
    setCustomFieldType('text');
    setCustomFieldOptions('');
    setHasUnsavedChanges(true);
  };

  const handleDeleteSegment = async (segmentId: string) => {
    try {
      await deleteSegment({
        variables: {
          segmentId,
        },
      });

      // Remove the deleted segment from the local state
      setSegments(prevSegments => prevSegments.filter(segment => segment.id !== segmentId));
    } catch (error) {
      console.error('Error deleting segment:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <Button variant="outline" onClick={handleSave} disabled={!hasUnsavedChanges}>
          Save Changes
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="formFields">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {formFields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <div
                      className="mb-4"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">{field.label}</h2>
                            <button onClick={() => handleRemoveField(index)}>
                              <MinusIcon className="text-red-500" />
                            </button>
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
                              onChange={(e) => handleInputChange(field.id, Number(e.target.value))}
                            />
                          )}
                          {field.type === 'select' && (
                            <Select
                              value={field.value as string}
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
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Add Custom Field</h2>
        <Input
          placeholder="Field Label"
          value={customFieldLabel}
          onChange={(e) => setCustomFieldLabel(e.target.value)}
        />
        <Select value={customFieldType} onValueChange={setCustomFieldType}>
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
            placeholder="Comma-separated options"
            value={customFieldOptions}
            onChange={(e) => setCustomFieldOptions(e.target.value)}
          />
        )}
        <Button variant="outline" onClick={handleAddCustomField}>
          Add Field
        </Button>
      </div>

     
     
     
      <Button variant="outline" onClick={handlePublish}>
        Publish Segments
      </Button>
    </div>
  );
};

export default memo(ProductPage);
