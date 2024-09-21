'use client'
import React, { useState, useEffect, memo, useCallback } from 'react';
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
  post: { [key: string]: FormField };
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

      const excludedFields = new Set(initialFields.map(field => field.id));
      const updatedRemainingFields = initialAvailableFields.filter(field => !excludedFields.has(field.id));

      setFormFields(initialFields);
      setRemainingFields(updatedRemainingFields);
      setProductData(product);
    }

    if (segmentsData) {
      setSegments(segmentsData.Segment);

      // Flatten and extract form fields from segments
      const segmentFields = segmentsData.Segment.flatMap((segment: Segment) =>
        Object.values(segment.post).map(field => ({
          id: field.id || uuidv4(),
          type: field.type || 'text',
          label: field.label || '',
          value: field.value || '',
          options: field.options || []
        }))
      );

      // Ensure no duplicate fields based on both id and label
      const mergedFields = [...formFields, ...segmentFields].reduce((acc: FormField[], current: FormField) => {
        if (!acc.find(field => field.id === current.id || field.label === current.label)) {
          acc.push(current);
        }
        return acc;
      }, []);

      setFormFields(mergedFields);
    }
  }, [productDataQuery, segmentsData]);
  

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
  }, [productData]);

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
        };
        return acc;
      }, {} as Record<string, any>);

      const publishSegment = {
        id: SEGMENT_ID,
        name: 'Published Segment',
        productId: PRODUCT_ID,
        domainId: DOMAIN_ID,
        productVersionId,
        post: postData,
      };

      await publishSegments({ variables: { input: publishSegment } });
      await UpdateSegment({ variables: { id: SEGMENT_ID, post: postData } });

      alert('Segments published successfully!');
    } catch (error) {
      console.error('Error publishing segments:', error);
      alert('Failed to publish segments.');
    }
  };

  const handleAddCustomField = () => {
    if (RESERVED_FIELDS.has(customFieldLabel)) {
      alert(`The label "${customFieldLabel}" is a reserved field name and cannot be used.`);
      return;
    }

    const newCustomField: FormField = {
      id: uuidv4(),
      label: customFieldLabel,
      type: customFieldType,
      options: customFieldType === 'select' ? customFieldOptions.split(',').map(opt => opt.trim()) : [],
      value: ''
    };

    setFormFields(prev => [...prev, newCustomField]);
    setCustomFieldLabel('');
    setCustomFieldType('text');
    setCustomFieldOptions('');
  };


  if (loadingProduct || loadingSegments) {
    return <div>Loading...</div>;
  }

  if (!productData || !formFields.length) {
    return <div>No product data available.</div>;
  }

  return (
    <div className="flex flex-row h-screen">
      <ResizablePanelGroup direction={'horizontal'}>
        <ResizablePanel minSize={20}>
          <Tabs defaultValue="form">
            <TabsList className="m-2 w-full grid grid-cols-2">
              <TabsTrigger value="form">Form</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <div className="flex flex-col px-4 pt-6">
              <Button onClick={handleSave} disabled={!hasUnsavedChanges}>Save Changes</Button>
              <Button onClick={handlePublish}>Publish</Button>
            </div>
          </Tabs>

          <div className="flex flex-col px-4 pt-6">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="formFields">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {formFields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided) => (
                          <Card
                            className="m-2"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <CardContent>
                              <div className="flex justify-between items-center">
                                <span>{field.label}</span>
                                <button onClick={() => handleRemoveField(index)}><MinusIcon /></button>
                              </div>

                              {field.type === 'textarea' ? (
                                <Textarea
                                  value={field.value as string}
                                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                                />
                              ) : (
                                <Input
                                  value={field.value as string}
                                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                                />
                              )}

                              {field.type === 'select' && field.options && (
                                <Select
                                  value={field.value as string}
                                  onValueChange={(value) => handleInputChange(field.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a value" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options.map((option, index) => (
                                      <SelectItem key={index} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
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

            <Accordion type="single" collapsible>
              <AccordionItem value="addField">
                <AccordionTrigger className="m-4 p-2 flex justify-between items-center bg-gray-100">
                  <span>Add Custom Field</span>
                  <PlusIcon />
                </AccordionTrigger>
                <AccordionContent>
                  <Input
                    value={customFieldLabel}
                    onChange={(e) => setCustomFieldLabel(e.target.value)}
                    placeholder="Field Label"
                  />
                  <Select
                    value={customFieldType}
                    onValueChange={setCustomFieldType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Field Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="textarea">Textarea</SelectItem>
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

                  <Button className="m-4" onClick={handleAddCustomField}>Add Field</Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel minSize={20}>
          <h1>Live Preview</h1>
          <pre>{JSON.stringify(productData, null, 2)}</pre>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default memo(ProductPage);
