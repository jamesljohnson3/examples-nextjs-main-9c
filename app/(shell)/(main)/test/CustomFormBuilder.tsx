"use client"
import React, { useState, useEffect, useCallback, memo } from 'react';
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
import { GET_PRODUCT, SAVE_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS, UPDATE_SEGMENT } from '@/app/(shell)/(main)/queries';
import { v4 as uuidv4 } from 'uuid';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { DELETE_SEGMENT } from './mutations';

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
  post: FormField[];
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
    if (productDataQuery?.Product) {
      const product = productDataQuery.Product[0];
      const initialFields = initialAvailableFields.map(field => ({
        ...field,
        value: product[field.id] || ''
      }));
      setFormFields(initialFields);

      const excludedFields = new Set(initialFields.map(field => field.id));
      const updatedRemainingFields = initialAvailableFields.filter(field => !excludedFields.has(field.id));
      setRemainingFields(updatedRemainingFields);
      setProductData(product);
    }
  }, [productDataQuery, initialAvailableFields]);

  useEffect(() => {
    if (segmentsData?.segments) {
      setSegments(segmentsData.segments);
    }
  }, [segmentsData]);

  useEffect(() => {
    // Map segment.post data to form fields
    const segment = segments.find(seg => seg.id === SEGMENT_ID);
    if (segment) {
      const segmentFields = segment.post.map(field => ({
        ...field,
        id: field.id || uuidv4()  // Ensure each field has a unique ID
      }));
      setFormFields(segmentFields);
    }
  }, [segments]);

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
        variables: { productId: PRODUCT_ID, version: versionNumber, uuid },
      });

      const fieldsToUpdate = formFields.map(({ id, value }) => ({
        id,
        value
      }));

      await publishSegments({
        variables: {
          productId: PRODUCT_ID,
          version: versionNumber,
          uuid,
          fields: fieldsToUpdate,
        }
      });
      
      alert('Product saved successfully!');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product.');
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

  if (loadingProduct || loadingSegments) {
    return <div>Loading...</div>;
  }

  if (deleteLoading) return <p>Deleting...</p>;
  if (deleteError) return <p>Error deleting segment.</p>;

  return (
    <div>
      <Tabs defaultValue="product" className="w-full">
        <TabsList>
          <TabsTrigger value="product">Product</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>
        <div className="my-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="product-form">
              <AccordionTrigger>Product Form</AccordionTrigger>
              <AccordionContent>
                {productData && (
                  <form>
                    <div>
                      <label htmlFor="name">Name</label>
                      <Input id="name" value={productData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor="description">Description</label>
                      <Textarea id="description" value={productData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor="price">Price</label>
                      <Input type="number" id="price" value={productData.price} onChange={(e) => handleInputChange('price', e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor="quantity">Quantity</label>
                      <Input type="number" id="quantity" value={productData.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor="category">Category</label>
                      <Select value={productData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Food">Food</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" onClick={handleSave} disabled={!hasUnsavedChanges}>Save</Button>
                  </form>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="form-fields">
              <AccordionTrigger>Form Fields</AccordionTrigger>
              <AccordionContent>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {formFields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border p-2 mb-2 bg-white shadow rounded"
                              >
                                <div className="flex justify-between items-center">
                                  <span>{field.label}</span>
                                  <GripVertical className="cursor-move" />
                                  <Button variant="destructive" onClick={() => handleRemoveField(index)}>
                                    <MinusIcon />
                                  </Button>
                                </div>
                                {field.type === 'select' && field.options && (
                                  <Select defaultValue={field.value as string} onValueChange={(value) => handleInputChange(field.id, value)}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {field.options.map((opt, idx) => (
                                        <SelectItem key={idx} value={opt}>{opt}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                                {field.type === 'textarea' && (
                                  <Textarea
                                    value={field.value as string}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                  />
                                )}
                                {field.type === 'text' && (
                                  <Input
                                    value={field.value as string}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                  />
                                )}
                                {field.type === 'number' && (
                                  <Input
                                    type="number"
                                    value={field.value as string}
                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                  />
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
                <div>
                  <Input
                    placeholder="Custom field label"
                    value={customFieldLabel}
                    onChange={(e) => setCustomFieldLabel(e.target.value)}
                  />
                  <Select
                    defaultValue={customFieldType}
                    onValueChange={(value) => setCustomFieldType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                  <Button onClick={handleAddCustomField}>Add Field</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Tabs>
    </div>
  );
};

export default ProductPage;
