"use client"
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

  // Fetch product data
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

  // Fetch segment data and merge with form fields
  useEffect(() => {
    if (segmentsData?.segments) {
      const segment = segmentsData.segments.find((seg: Segment) => seg.id === SEGMENT_ID);
      if (segment && segment.post) {
        const segmentFields = Object.entries(segment.post).map(([key, postField]: [string, any]) => ({
          id: key,
          type: postField.type,
          label: postField.label,
          value: postField.value,
          options: postField.options || [],
        }));
        setFormFields(prevFields => [...prevFields, ...segmentFields]);
      }
      setSegments(segmentsData.segments);
    }
  }, [segmentsData]);

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
          options: field.options || [],
        };
        return acc;
      }, {} as Record<string, any>);

      const segmentId = SEGMENT_ID;

      if (!segmentId) {
        alert('No segment ID available.');
        return;
      }

      await publishSegments({
        variables: { id: segmentId, productVersionId },
      });

      await UpdateSegment({
        variables: {
          id: segmentId,
          post: postData,
        },
      });

      alert('Segment published and updated!');
    } catch (error) {
      console.error('Error publishing segment:', error);
      alert('Error publishing segment.');
    }
  };

  const renderField = (field: FormField, index: number) => {
    const inputProps = {
      value: field.value ?? '',
      onChange: (e: any) => handleInputChange(field.id, e.target.value),
      className: 'w-full p-2 border rounded-md',
    };

    switch (field.type) {
      case 'text':
        return <Input {...inputProps} />;
      case 'textarea':
        return <Textarea {...inputProps} />;
      case 'number':
        return <Input {...inputProps} type="number" />;
      case 'select':
        return (
          <Select
            onValueChange={value => handleInputChange(field.id, value)}
            defaultValue={field.value?.toString() ?? ''}
          >
            <SelectTrigger className="w-full">
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Page</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="form-fields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {formFields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <div
                      className="p-4 border rounded-md"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-semibold">{field.label}</label>
                        <span {...provided.dragHandleProps} className="cursor-grab">
                          <GripVertical />
                        </span>
                      </div>
                      {renderField(field, index)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleRemoveField(index)}
                      >
                        <MinusIcon className="mr-2" /> Remove
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

      <div className="mt-4">
        <Button onClick={handleSave} disabled={!hasUnsavedChanges} className="mr-2">
          Save
        </Button>
        <Button onClick={handlePublish}>Publish</Button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Available Fields</h2>
        <div className="space-y-2">
          {remainingFields.map(field => (
            <Button
              key={field.id}
              variant="ghost"
              className="w-full text-left"
              onClick={() => handleAddField(field)}
            >
              <PlusIcon className="mr-2" /> Add {field.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Custom Field</h2>
        <div className="space-y-2">
          <Input
            placeholder="Label"
            value={customFieldLabel}
            onChange={(e) => setCustomFieldLabel(e.target.value)}
          />
          <Select
            onValueChange={value => setCustomFieldType(value)}
            defaultValue={customFieldType}
          >
            <SelectTrigger className="w-full">
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
              placeholder="Enter options, separated by commas"
              value={customFieldOptions}
              onChange={(e) => setCustomFieldOptions(e.target.value)}
            />
          )}
          <Button
            onClick={() => {
              const newField: FormField = {
                id: uuidv4(),
                type: customFieldType,
                label: customFieldLabel,
                options: customFieldType === 'select' ? customFieldOptions.split(',') : undefined,
              };
              handleAddField(newField);
              setCustomFieldLabel('');
              setCustomFieldType('text');
              setCustomFieldOptions('');
            }}
          >
            <PlusIcon className="mr-2" /> Add Custom Field
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Segments</h2>
        <Accordion type="single" collapsible>
          {segments.map((segment) => (
            <AccordionItem key={segment.id} value={segment.id}>
              <AccordionTrigger>
                {segment.name}
              </AccordionTrigger>
              <AccordionContent>
                <pre>{JSON.stringify(segment.post, null, 2)}</pre>
                <Button variant="ghost" onClick={() => handleDeleteSegment(segment.id)}>
                  Delete Segment
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default memo(ProductPage);
