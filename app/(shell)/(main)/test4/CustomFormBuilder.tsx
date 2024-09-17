"use client"
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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { DELETE_SEGMENT } from './mutations';  // Adjust import path as needed


// Define the type for reserved fields as a union of string literals
type ReservedFields = 
  | 'id'
  | 'name'
  | 'description'
  | 'price'
  | 'quantity'
  | 'category'
  | 'organizationId'
  | 'createdById'
  | 'primaryPhoto'
  | 'imageGallery'
  | 'ogImage'
  | 'metadata'
  | 'createdAt'
  | 'updatedAt'
  | 'designConcepts'
  | 'aiSuggestions'
  | 'Segment';

// Define reserved fields as a Set for faster lookup
const RESERVED_FIELDS: Set<ReservedFields> = new Set([
  'id',
  'name',
  'description',
  'price',
  'quantity',
  'category',
  'organizationId',
  'createdById',
  'primaryPhoto',
  'imageGallery',
  'ogImage',
  'metadata',
  'createdAt',
  'updatedAt',
  'designConcepts',
  'aiSuggestions',
  'Segment'
]);

// Define types for the component
type Post = {
  id: string;
  content: string;
  createdAt: string;
};

type EditedPost = {
  [key: string]: string;
};

// Sample static data
const STATIC_PRODUCT_DATA: Post = {
  id: "my-tableName-id",
  content: JSON.stringify({
    name: 'Sample Product',
    id: "sample-tableName-id",
    model: "test",
    Make: "Nissan",
    Meta: "Vehicle for sale",
    Year: "2012",
    Mileage: "test",
    Transmission: "Auto",
    Passenger: "2 Door",
    Fuel: "test",
    Type: "Truck",
    html: "",
    image: "",
    video: "",
    caption: "",
    customField2: 'Custom Value 2'
  }),
  createdAt: '2023-01-01T00:00:00Z'
};

const ProductEditor = () => {
  const [post, setPost] = useState<Post>(STATIC_PRODUCT_DATA);
  const [editedPost, setEditedPost] = useState<EditedPost>({});
  const [postKeys, setPostKeys] = useState<string[]>([]);
  const [customFieldLabel, setCustomFieldLabel] = useState<string>('');
  const [customFieldType, setCustomFieldType] = useState<'text' | 'textarea' | 'number' | 'select'>('text');
  const [customFieldOptions, setCustomFieldOptions] = useState<string>('');
  const [customFields, setCustomFields] = useState<{[key: string]: { type: string; options?: string[] }}>({}); 

  useEffect(() => {
    const parseContent = () => {
      try {
        const content = JSON.parse(post.content);
        setEditedPost(content);
        setPostKeys(Object.keys(content));
      } catch (error) {
        console.error('Error parsing content:', error);
      }
    };

    parseContent();
  }, [post]);

  const handleFieldChange = (key: string, value: string) => {
    setEditedPost(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddCustomField = () => {
    if (!validateCustomField()) return;

    const newField = {
      type: customFieldType,
      options: customFieldType === 'select' ? customFieldOptions.split(',').map(option => option.trim()) : []
    };

    setCustomFields(prevFields => ({
      ...prevFields,
      [customFieldLabel]: newField
    }));

    setPostKeys(prevKeys => [...prevKeys, customFieldLabel]);
    resetForm();
  };

  const resetForm = () => {
    setCustomFieldLabel('');
    setCustomFieldType('text');
    setCustomFieldOptions('');
  };

  const validateCustomField = () => {
    if (!customFieldLabel.trim()) {
      alert('Field label cannot be empty.');
      return false;
    }
    if (RESERVED_FIELDS.has(customFieldLabel as ReservedFields)) {
      alert('Field label is reserved and cannot be used.');
      return false;
    }
    if (customFieldType === 'select' && !customFieldOptions.trim()) {
      alert('Select options cannot be empty.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    // Update content and simulate saving
    const updatedContent = JSON.stringify(editedPost);
    console.log('Updated Content:', updatedContent);
    // You can add code here to save the updated content to the backend
  };

  return (
    <div>
      <h1>Edit Product</h1>
      <div className="custom-field-form">
        <Input
          value={customFieldLabel}
          onChange={(e) => setCustomFieldLabel(e.target.value)}
          placeholder="Field Label"
        />
        <Select
          value={customFieldType}
          onValueChange={(value: 'text' | 'textarea' | 'number' | 'select') => setCustomFieldType(value)}
        >
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
          Add Custom Field
        </Button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {postKeys.map(key => (
          <div key={key}>
            <label>{key}:</label>
            <input
              type={customFields[key]?.type || 'text'}
              value={editedPost[key] || ''}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              disabled={RESERVED_FIELDS.has(key as ReservedFields)} // Disable input if it's a reserved field
            />
          </div>
        ))}
        <button type="submit">Save</button>
      </form>

      <div className="custom-fields-container">
        {Object.entries(customFields).map(([key, field]) => (
          <div key={key} className="custom-field">
            <label>{key}</label>
            {field.type === 'text' && <input type="text" />}
            {field.type === 'textarea' && <textarea />}
            {field.type === 'number' && <input type="number" />}
            {field.type === 'select' && (
              <select>
                {field.options!.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductEditor;