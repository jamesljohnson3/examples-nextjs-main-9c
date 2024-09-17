/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN } from '@/app/(shell)/(main)/queries';
import { DELETE_SEGMENT } from './mutations'; // Adjust import path as needed
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusIcon, MinusIcon } from 'lucide-react';

// Define your FormField type
interface FormField {
  id: string;
  type: string;
  label: string;
  options?: string[]; // Only for 'select' type
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  [key: string]: string | number | undefined; // Allow for custom fields
}

const ProductPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const PRODUCT_ID = params.id;
  const DOMAIN_ID = 'some-domain-id'; // Replace with actual domain ID if needed

  // Fetch product details
  const { data: productData, loading: productLoading, error: productError } = useQuery(GET_PRODUCT, { variables: { productId: PRODUCT_ID } });
  const { data: segmentsData, loading: segmentsLoading, error: segmentsError } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID },
  });

  if (productLoading || segmentsLoading) return <p>Loading...</p>;
  if (productError) return <p>Error loading product: {productError.message}</p>;
  if (segmentsError) return <p>Error loading segments: {segmentsError.message}</p>;

  const product = productData?.Product?.[0] || {};
  const segments = segmentsData?.Segment || [];

  // Custom Form Builder Component
  const CustomFormBuilder: React.FC<{
    formFields: FormField[];
    setFormFields: React.Dispatch<React.SetStateAction<FormField[]>>;
    availableFields: FormField[];
    setAvailableFields: React.Dispatch<React.SetStateAction<FormField[]>>;
    previewData: ProductData;
    hasUnsavedChanges: boolean;
    setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
    handleInputChange: (id: string, value: string | number) => void;
    productId: string;
    domainId: string;
  }> = ({
    formFields,
    setFormFields,
    availableFields,
    setAvailableFields,
    previewData,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    handleInputChange,
    productId,
    domainId
  }) => {
    const [newField, setNewField] = useState<FormField>({ id: '', type: 'text', label: '' });

    // Fetch segments for the product and domain
    const [publishProduct] = useMutation(DELETE_SEGMENT);

    useEffect(() => {
      if (segmentsData && segmentsData.Segment) {
        const fetchedSegments = segmentsData.Segment.map((segment: any) => ({
          id: segment.id,
          type: 'text',
          label: segment.name,
        }));
        setAvailableFields(fetchedSegments);
      }
    }, [segmentsData, setAvailableFields]);

    const handleAddField = () => {
      if (newField.id && newField.label) {
        const newFieldId = `customField-${Date.now()}`;
        setFormFields([
          ...formFields,
          { ...newField, id: newFieldId },
        ]);
        setAvailableFields(availableFields.filter(f => f.id !== newField.id));
        setNewField({ id: '', label: '', type: 'text', options: [] });
        setHasUnsavedChanges(true);
      }
    };

    const addFormField = (field: FormField) => {
      setFormFields([...formFields, { ...field, id: `${field.id}-${Date.now()}` }]);
      setAvailableFields(availableFields.filter(f => f.id !== field.id));
      setHasUnsavedChanges(true);
    };

    const removeFormField = (index: number) => {
      const removedField = formFields[index];
      const newFields = [...formFields];
      newFields.splice(index, 1);
      setFormFields(newFields);
      setAvailableFields([...availableFields, { id: removedField.id.split('-')[0], label: removedField.label, type: removedField.type }]);
      setHasUnsavedChanges(true);
    };

    const onDragEnd = (result: any) => {
      if (!result.destination) return;
      const items = Array.from(formFields);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setFormFields(items);
    };

    const handlePublish = async () => {
      // Simulate updating product version
      console.log("Publishing product version...");

      // Example of using mutation to delete a segment, adjust as needed
      try {
        await publishProduct({
          variables: {
            id: productId,
          },
        });
        console.log("Product version updated successfully.");
      } catch (error) {
        console.error("Error updating product version:", error);
      }
    };

    const renderFieldInput = (field: FormField) => {
      const fieldId = field.id.split('-')[0];
      switch (field.type) {
        case 'text':
          return (
            <Input
              key={field.id}
              placeholder={field.label}
              className="flex-grow text-xs h-7"
              value={previewData[fieldId] || ''}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
            />
          );
        case 'textarea':
          return (
            <Textarea
              key={field.id}
              placeholder={field.label}
              className="flex-grow text-xs h-14"
              value={previewData[fieldId] || ''}
              onChange={(e) => handleInputChange(fieldId, e.target.value)}
            />
          );
        case 'number':
          return (
            <Input
              key={field.id}
              type="number"
              placeholder={field.label}
              className="flex-grow text-xs h-7"
              value={previewData[fieldId] ? previewData[fieldId].toString() : ''}
              onChange={(e) => {
                const numericValue = e.target.value ? parseFloat(e.target.value) : undefined;
                handleInputChange(fieldId, numericValue!);
              }}
            />
          );
        case 'select':
          return (
            <Select
              key={field.id}
              value={previewData[fieldId] || ''}
              onValueChange={(value) => handleInputChange(fieldId, value as string)}
            >
              <SelectTrigger className="flex-grow text-xs h-7">
                <SelectValue placeholder={field.label} />
              </SelectTrigger>
              <SelectContent>
                {(field.options || []).map((option) => (
                  <SelectItem key={option} value={option} className="text-xs">
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
      <div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex space-x-1">
              {availableFields.map((element) => (
                <Button key={element.id} variant="outline" size="sm" onClick={() => addFormField(element)} className="text-xs py-1 px-2">
                  <PlusIcon className="h-3 w-3 mr-1" /> {element.label}
                </Button>
              ))}
            </div>
          </div>

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
                          className="bg-white p-4 border border-gray-300 rounded-lg"
                        >
                          <div className="flex items-center mb-2">
                            <span className="flex-grow">{field.label}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeFormField(index)}
                              className="text-xs p-1"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </Button>
                          </div>
                          {renderFieldInput(field)}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="flex justify-end space-x-2">
          <Button onClick={handleAddField} variant="outline" size="sm">
            Add Field
          </Button>
          <Button onClick={handlePublish} variant="primary" size="sm" disabled={!hasUnsavedChanges}>
            {hasUnsavedChanges ? 'Publish Changes' : 'No Changes to Publish'}
          </Button>
        </div>
      </div>
    );
  };

  // Example state for form fields and available fields
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [availableFields, setAvailableFields] = useState<FormField[]>(segments.map((segment: any) => ({
    id: segment.id,
    type: 'text',
    label: segment.name,
  })));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewData, setPreviewData] = useState<ProductData>(product);

  const handleInputChange = (id: string, value: string | number) => {
    setPreviewData(prev => ({ ...prev, [id]: value }));
    setHasUnsavedChanges(true);
  };

  return (
    <div>
      <h1>{product.name || 'Product Name'}</h1>
      <p>{product.description || 'No description available.'}</p>
      {product.primaryPhoto && <img src={product.primaryPhoto} alt={product.name || 'Product Image'} />}
      <div>
        <h2>Image Gallery</h2>
        {product.imageGallery && product.imageGallery.length > 0 ? (
          product.imageGallery.map((url: string | undefined, index: React.Key | null | undefined) => (
            <img
              key={index}
              src={url}
              alt={`Gallery ${index}`}
              style={{ maxWidth: '200px', margin: '10px' }}
            />
          ))
        ) : (
          <p>No images available.</p>
        )}
      </div>
      <p>Price: ${product.price || 'N/A'}</p>

      {/* Render CustomFormBuilder component */}
      <CustomFormBuilder
        formFields={formFields}
        setFormFields={setFormFields}
        availableFields={availableFields}
        setAvailableFields={setAvailableFields}
        previewData={previewData}
        hasUnsavedChanges={hasUnsavedChanges}
        setHasUnsavedChanges={setHasUnsavedChanges}
        handleInputChange={handleInputChange}
        productId={PRODUCT_ID}
        domainId={DOMAIN_ID}
      />
    </div>
  );
};

export default ProductPage;
