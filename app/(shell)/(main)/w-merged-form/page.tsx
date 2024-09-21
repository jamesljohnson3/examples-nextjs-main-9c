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
    if (segmentsData) {
      console.log(segmentsData);
      setSegments(segmentsData.Segment);
  
      // Flatten and extract form fields from segments
      const segmentFields = segmentsData.Segment.flatMap((segment: Segment) =>
        Object.values(segment.post).map(field => ({
          id: field.id || uuidv4(), // Ensure each field has a unique ID
          type: field.type || 'text',
          label: field.label || '',
          value: field.value || '',
          options: field.options || []
        }))
      );
  
      // Log the transformed segment fields
      console.log('formfields', segmentFields);
  
      setFormFields(segmentFields);
    }
  }, [segmentsData]);
  
  


const handleInputChange = useCallback(
  (fieldId: string, value: string | number) => {
    if (productData) {
      const parsedValue =
        typeof value === "string" && isNaN(Number(value)) ? value : parseFloat(value as string);
      setProductData((prev) => ({
        ...prev!,
        [fieldId]: parsedValue,
      }));
    }

    setFormFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, value: value } : field
      )
    );
    setHasUnsavedChanges(true);
  },
  [productData]
);


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
  const handleAddCustomField = () => {
    if (!customFieldLabel.trim()) {
      alert("Field label cannot be empty.");
      return;
    }
    
    const newFieldId = customFieldLabel.toLowerCase().replace(/\s+/g, "_");
    if (RESERVED_FIELDS.has(newFieldId.toLowerCase())) { // Case-insensitive check
      alert("Cannot use reserved field ID.");
      return;
    }
  
    if (formFields.find((field) => field.id === newFieldId)) {
      alert("Field with this label already exists.");
      return;
    }
  
    const newField = {
      id: newFieldId,
      type: customFieldType,
      label: customFieldLabel,
      options: customFieldType === "select" ? customFieldOptions.split(",").map((opt) => opt.trim()) : undefined,
    };
  
    handleAddField(newField);
  
    setCustomFieldLabel("");
    setCustomFieldType("text");
    setCustomFieldOptions("");
  };
  
  
  if (loadingProduct || loadingSegments) {
    return <div>Loading...</div>;
  }
  
  if (!productData || !formFields.length) {
    return <div>No product data available.</div>;
  }
  

  if (deleteLoading) return <p>Deleting...</p>;
  if (deleteError) return <p>Error deleting segment.</p>;

  return (
    <div className="product-page">
      <Tabs>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="form">Form Builder</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>

        <div className="tab-content">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={70}>
              <Accordion className='px-2' type="single" collapsible>
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
                        </div>

                        <DragDropContext onDragEnd={onDragEnd}>
                          <Droppable droppableId="form-fields">
                            {(provided) => (
                              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
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
                                        <div className="flex-grow">
                                          <label>{field.label}</label>
                                          {field.type === 'text' && (
                                            <Input
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
                                              onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value))}
                                            />
                                          )}
                                          {field.type === 'select' && (
                                            <Select
                                              onValueChange={(value) => handleInputChange(field.id, value)}
                                              defaultValue={field.value as string}
                                            >
                                              <SelectTrigger>
                                                <SelectValue />
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
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => handleRemoveField(index)} className="h-6 w-6 p-0">
                                          <MinusIcon className="h-3 w-3" />
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

                        <div className="custom-field-form">
                          <Input
                            value={customFieldLabel}
                            onChange={(e) => setCustomFieldLabel(e.target.value)}
                            placeholder="Field Label"
                          />
                          <Select value={customFieldType} onValueChange={(value) => setCustomFieldType(value)}>
                            <SelectTrigger>
                              <SelectValue>{customFieldType}</SelectValue>
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
                              value={customFieldOptions}
                              onChange={(e) => setCustomFieldOptions(e.target.value)}
                              placeholder="Comma-separated options"
                            />
                          )}
                          <Button onClick={handleAddCustomField}>
                            <PlusIcon className="mr-1" /> Add Custom Field
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {hasUnsavedChanges && (
                <Button onClick={handleSave}>Save</Button>
              )}
              <Button onClick={handlePublish}>Publish</Button>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30}>
              <div className="mt-4">
                <Card>
                  <CardContent>
                    <h2 className="text-lg font-bold mb-2">Product Preview</h2>
                    <div className="flex items-center space-x-4">
                      {hasUnsavedChanges && <span className="text-yellow-500 text-sm">Unsaved changes</span>}
                    </div>

                    <div className="p-4 border rounded-lg">
                      {productData && (
                        <div>
                          <h3 className="text-xl font-semibold">{productData.name}</h3>
                          <p className="text-sm text-gray-500">{productData.description}</p>
                          <p className="text-md font-bold">${productData.price.toFixed(2)}</p>
                          <p className="text-sm">Quantity: {productData.quantity}</p>
                          <p className="text-sm">Category: {productData.category}</p>
                        </div>
                      )}
                      {!productData && <p>No product data available.</p>}
                    </div>
                    <button onClick={() => handleDeleteSegment(SEGMENT_ID)}>Delete Segment</button>
                  </CardContent>
                </Card>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Tabs>
    </div>
  );
};

export default memo(ProductPage);
