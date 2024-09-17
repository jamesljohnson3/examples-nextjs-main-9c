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
      const newFields = initialAvailableFields.map(field => ({
        ...field,
        value: product[field.id] || ''
      }));
      setProductData(product);
      setFormFields(newFields);

      // Determine remaining fields by filtering out those already in formFields
      const addedFieldIds = newFields.map(field => field.id);
      const filteredRemainingFields = initialAvailableFields.filter(field => !addedFieldIds.includes(field.id));
      setRemainingFields(filteredRemainingFields);
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

      // Save the productVersion ID to the product and publish the segment
      await publishSegments({
        variables: {
          segmentId: SEGMENT_ID,
          versionId: uuid,
        },
      });

      alert('Product saved successfully!');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    }
  };

  return (
    <div className="product-page">
      {loadingProduct ? (
        <p>Loading product...</p>
      ) : (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {formFields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="form-field"
                        >
                          <Card>
                            <CardContent>
                              {field.type === 'text' && (
                                <Input
                                  type="text"
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
                                    <SelectValue placeholder={field.label} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options?.map(option => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                              <Button onClick={() => handleRemoveField(index)}>
                                <MinusIcon /> Remove
                              </Button>
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
          <div className="add-field">
            <Select
              value={customFieldType}
              onValueChange={(value) => setCustomFieldType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="textarea">Textarea</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="select">Select</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={customFieldLabel}
              onChange={(e) => setCustomFieldLabel(e.target.value)}
              placeholder="Field label"
            />
            {customFieldType === 'select' && (
              <Input
                type="text"
                value={customFieldOptions}
                onChange={(e) => setCustomFieldOptions(e.target.value)}
                placeholder="Options (comma separated)"
              />
            )}
            <Button
              onClick={() => handleAddField({
                id: uuidv4(),
                type: customFieldType,
                label: customFieldLabel,
                options: customFieldType === 'select' ? customFieldOptions.split(',').map(opt => opt.trim()) : undefined
              })}
            >
              <PlusIcon /> Add Field
            </Button>
          </div>
          <Button onClick={handleSave} disabled={!hasUnsavedChanges}>Save Changes</Button>
        </>
      )}
    </div>
  );
}
