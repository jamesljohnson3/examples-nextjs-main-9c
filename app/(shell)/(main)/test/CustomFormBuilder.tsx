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
  post: Record<string, any>;
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
  }, [productDataQuery]);

  useEffect(() => {
    if (segmentsData?.segments) {
      setSegments(segmentsData.segments);
      
      // Fetch segment post data and add to form fields
      const segment = segmentsData.segments.find((s: { id: string; }) => s.id === SEGMENT_ID);
      if (segment?.post) {
        const customFields = Object.keys(segment.post).map(key => ({
          id: key,
          type: segment.post[key].type,
          label: segment.post[key].label,
          options: segment.post[key].options,
          value: segment.post[key].value
        }));

        setFormFields(prevFields => [
          ...prevFields,
          ...customFields.filter(field => !RESERVED_FIELDS.has(field.id))
        ]);

        setRemainingFields(prev => prev.filter(field => !customFields.some(cf => cf.id === field.id)));
      }
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
      if (RESERVED_FIELDS.has(removedField.id)) {
        setRemainingFields(prev => [...prev, removedField].sort((a, b) => a.label.localeCompare(b.label)));
      } else {
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
      await publishSegments({
        variables: {
          segmentIds: segments.map(segment => segment.id),
          status: 'PUBLISHED'
        }
      });
      alert('Segments published successfully!');
    } catch (error) {
      console.error('Error publishing segments:', error);
      alert('Failed to publish segments.');
    }
  };

  const handleAddCustomField = () => {
    if (customFieldLabel && customFieldType) {
      const newField: FormField = {
        id: customFieldLabel.toLowerCase().replace(/\s+/g, '_'),
        type: customFieldType,
        label: customFieldLabel,
        options: customFieldType === 'select' ? customFieldOptions.split(',') : [],
      };

      handleAddField(newField);
      setCustomFieldLabel('');
      setCustomFieldType('text');
      setCustomFieldOptions('');
    }
  };

  const handleUpdateSegment = async () => {
    try {
      const segment = segments.find(s => s.id === SEGMENT_ID);
      if (segment) {
        await UpdateSegment({
          variables: {
            segmentId: segment.id,
            postData: formFields.reduce((acc, field) => ({
              ...acc,
              [field.id]: {
                type: field.type,
                label: field.label,
                options: field.options,
                value: field.value
              }
            }), {})
          },
        });
        alert('Segment updated successfully!');
      }
    } catch (error) {
      console.error('Error updating segment:', error);
      alert('Failed to update segment.');
    }
  };

  if (loadingProduct || loadingSegments) return <p>Loading...</p>;

  return (
    <div>
      <Tabs defaultValue="form" className="w-full">
        <TabsList>
          <TabsTrigger value="form">Product Form</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>
        <div className="p-4">
          {/* Product Form Tab */}
          <div className="space-y-4">
            <h2>Product Form</h2>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {formFields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 border border-gray-300 rounded-lg flex items-center space-x-2"
                          >
                            <GripVertical className="text-gray-500" />
                            <div className="flex-1">
                              {field.type === 'text' || field.type === 'textarea' ? (
                                <Input
                                  value={field.value || ''}
                                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                                  placeholder={field.label}
                                />
                              ) : field.type === 'select' ? (
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
                              ) : null}
                            </div>
                            <Button onClick={() => handleRemoveField(index)} variant="outline" size="icon">
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

            <Button onClick={handleSave} disabled={!hasUnsavedChanges}>Save Product</Button>
            <Button onClick={handlePublish} disabled={!hasUnsavedChanges}>Publish Segments</Button>

            <h3>Add Custom Field</h3>
            <Input
              value={customFieldLabel}
              onChange={(e) => setCustomFieldLabel(e.target.value)}
              placeholder="Custom Field Label"
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
                <SelectItem value="select">Select</SelectItem>
              </SelectContent>
            </Select>
            {customFieldType === 'select' && (
              <Input
                value={customFieldOptions}
                onChange={(e) => setCustomFieldOptions(e.target.value)}
                placeholder="Comma-separated options"
              />
            )}
            <Button onClick={handleAddCustomField}>Add Field</Button>

            {/* Remaining Fields */}
            <div className="space-y-2 mt-4">
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

          {/* Segments Tab */}
          <div className="space-y-4">
            <h2>Segments</h2>
            <Accordion type="single" collapsible>
              {segments.map((segment) => (
                <AccordionItem key={segment.id} value={segment.id}>
                  <AccordionTrigger>{segment.name}</AccordionTrigger>
                  <AccordionContent>
                    <Button onClick={() => handleDeleteSegment(segment.id)}>Delete Segment</Button>
                    <Button onClick={handleUpdateSegment}>Update Segment</Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default memo(ProductPage);
