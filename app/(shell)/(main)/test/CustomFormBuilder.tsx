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


import { MDXProvider } from '@mdx-js/react';

// Define the possible types of form fields
type FormFieldType = 'text' | 'textarea' | 'number' | 'select' | 'html' | 'mdx';

interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  options?: string[];
  value?: string | number;
}

// Define initial state values
const RESERVED_FIELDS = new Set(['reserved_field_1', 'reserved_field_2']); // Reserved field IDs

const App = () => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldType, setCustomFieldType] = useState<FormFieldType>('text');
  const [customFieldOptions, setCustomFieldOptions] = useState('');
  const [productData, setProductData] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleAddField = (field: FormField) => {
    setFormFields([...formFields, field]);
  };

  const handleRemoveField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const handleInputChange = (fieldId: string, value: string | number) => {
    setFormFields(formFields.map(field =>
      field.id === fieldId ? { ...field, value } : field
    ));
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
          productId: id,
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
          productId: id,
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

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
        return <Input type="text" value={field.value || ''} onChange={(e) => handleInputChange(field.id, e.target.value)} />;
      case 'textarea':
        return <Textarea value={field.value || ''} onChange={(e) => handleInputChange(field.id, e.target.value)} />;
      case 'number':
        return <Input type="number" value={field.value || ''} onChange={(e) => handleInputChange(field.id, parseFloat(e.target.value))} />;
      case 'select':
        return (
          <Select onChange={(e) => handleInputChange(field.id, e.target.value)} defaultValue={field.value as string}>
            {field.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
        );
      case 'html':
        return <Textarea value={field.value as string} onChange={(e) => handleInputChange(field.id, e.target.value)} />;
      case 'mdx':
        return <Textarea value={field.value as string} onChange={(e) => handleInputChange(field.id, e.target.value)} />;
      default:
        return null;
    }
  };

  const renderContent = (content: { html?: string; mdx?: string }) => {
    if (content.html) {
      return <div dangerouslySetInnerHTML={{ __html: content.html }} />;
    }
    if (content.mdx) {
      return <MDXProvider components={{}}><div>{content.mdx}</div></MDXProvider>;
    }
    return null;
  };

  const FormFields = () => (
    <>
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
                {renderField(field)}
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleRemoveField(index)} className="h-6 w-6 p-0">
                <MinusIcon className="h-3 w-3" />
              </Button>
            </div>
          )}
        </Draggable>
      ))}
    </>
  );

  const Preview = ({ segments }: { segments: any[] }) => (
    <div>
      {segments.map((segment) => (
        <div key={segment.id}>
          {segment.sections.map((section) => (
            <div key={section.title}>
              <h3>{section.title}</h3>
              {renderContent(section.content)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  // Mock functions for demonstration
  const saveProduct = async (data: any) => {
    console.log('Saving product:', data);
  };

  const updateProductVersion = async (data: any) => {
    console.log('Updating product version:', data);
  };

  // Example usage
  return (
    <div>
      <h1>Product Form</h1>
      <FormFields />
      <Button onClick={handleAddCustomField}>Add Custom Field</Button>
      <Button onClick={handleSave} disabled={!hasUnsavedChanges}>Save</Button>
      {/* Example Preview */}
      <Preview segments={[{ id: '1', sections: [{ title: 'Example Title', content: { html: '<p>Example HTML content.</p>' } }] }]} />
    </div>
  );
};

export default App;
