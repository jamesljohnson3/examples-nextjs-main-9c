"use client"
import React, { useState, useEffect, useReducer, memo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MinusIcon, GripVertical, PlusIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from '@/components/ui/textarea';
import { SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';
import { Input } from 'postcss';
import { Select } from 'react-day-picker';

// Define types
interface CustomField {
  type: 'text' | 'textarea' | 'number' | 'select';
  options?: string[];
}

interface EditedPost {
  [key: string]: string;
}

interface Field {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  value: string;
  options?: string[];
}

// Initial state for custom fields
const initialCustomFields: { [key: string]: CustomField } = {};

// Define reserved fields
const RESERVED_FIELDS = new Set([
  'id', 'name', 'description', 'price', 'quantity', 'category', 'organizationId', 'createdById',
  'primaryPhoto', 'imageGallery', 'ogImage', 'metadata', 'createdAt', 'updatedAt', 'designConcepts',
  'aiSuggestions', 'Segment'
]);

// Reducer for managing form fields
const formFieldsReducer = (state: Field[], action: { type: string, payload?: any }) => {
  switch (action.type) {
    case 'ADD_FIELD':
      return [...state, action.payload];
    case 'REMOVE_FIELD':
      return state.filter((_, index) => index !== action.payload);
    case 'UPDATE_FIELD':
      return state.map((field) =>
        field.id === action.payload.id ? { ...field, value: action.payload.value } : field
      );
    default:
      return state;
  }
};

const ProductEditor = () => {
  const [post, setPost] = useState({ id: 'my-tableName-id', content: '', createdAt: '' });
  const [editedPost, setEditedPost] = useState<EditedPost>({});
  const [postKeys, setPostKeys] = useState<string[]>([]);
  const [customFields, dispatch] = useReducer(formFieldsReducer, []);
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldType, setCustomFieldType] = useState<'text' | 'textarea' | 'number' | 'select'>('text');
  const [customFieldOptions, setCustomFieldOptions] = useState<string>('');

  useEffect(() => {
    try {
      const content = JSON.parse(post.content);
      setEditedPost(content);
      setPostKeys(Object.keys(content));
    } catch (error) {
      console.error('Error parsing content:', error);
    }
  }, [post]);

  const handleFieldChange = (key: string, value: string) => {
    setEditedPost((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddCustomField = () => {
    if (!validateCustomField()) return;

    const newField: CustomField = {
      type: customFieldType,
      options: customFieldType === 'select' ? customFieldOptions.split(',').map(option => option.trim()) : []
    };

    if (customFields.some((field) => field.label === customFieldLabel)) {
      alert('Custom field with this label already exists.');
      return;
    }

    dispatch({ type: 'ADD_FIELD', payload: { id: uuidv4(), label: customFieldLabel, ...newField, value: '' } });
    setPostKeys((prev) => [...prev, customFieldLabel]);
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
    if (RESERVED_FIELDS.has(customFieldLabel as any)) {
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
    const updatedContent = JSON.stringify(editedPost);
    console.log('Updated Content:', updatedContent);
    // Add save logic here
  };

  return (
    <div>
      <h1>Edit Product</h1>
      <div className="custom-field-form">
        <Input value={customFieldLabel} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCustomFieldLabel(e.target.value)} placeholder="Field Label" />
        <Select value={customFieldType} onValueChange={(value: string) => setCustomFieldType(value as 'text' | 'textarea' | 'number' | 'select')}>
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
          <Textarea value={customFieldOptions} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setCustomFieldOptions(e.target.value)} placeholder="Comma-separated options" />
        )}
        <Button onClick={handleAddCustomField}>
          <PlusIcon className="mr-1" /> Add Custom Field
        </Button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {postKeys.map((key) => (
          <div key={key}>
            <label>{key}:</label>
            <Input
              type={customFields.find((field) => field.label === key)?.type || 'text'}
              value={editedPost[key] || ''}
              onChange={(e: { target: { value: string; }; }) => handleFieldChange(key, e.target.value)}
              disabled={RESERVED_FIELDS.has(key as any)}
            />
          </div>
        ))}
        <Button type="submit">Save</Button>
      </form>

      <Accordion className='px-2' type="single" collapsible>
        <AccordionItem value="product-form">
          <AccordionTrigger>Product Form</AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex space-x-1">
                    {/* Add logic for remainingFields if needed */}
                  </div>
                </div>

                <DragDropContext onDragEnd={() => { /* Add logic here */ }}>
                  <Droppable droppableId="form-fields">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                        {customFields.map((field, index) => (
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
                                  {field.type === 'text' && <Input value={field.value} onChange={(e: { target: { value: any; }; }) => dispatch({ type: 'UPDATE_FIELD', payload: { id: field.id, value: e.target.value } })} />}
                                  {field.type === 'textarea' && <Textarea value={field.value} onChange={(e: { target: { value: any; }; }) => dispatch({ type: 'UPDATE_FIELD', payload: { id: field.id, value: e.target.value } })} />}
                                  {field.type === 'number' && <Input type="number" value={field.value} onChange={(e: { target: { value: any; }; }) => dispatch({ type: 'UPDATE_FIELD', payload: { id: field.id, value: e.target.value } })} />}
                                  {field.type === 'select' && (
                                    <Select value={field.value} onValueChange={(value: any) => dispatch({ type: 'UPDATE_FIELD', payload: { id: field.id, value } })}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {field.options?.map((option: any, idx: any) => (
                                          <SelectItem key={idx} value={option}>{option}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => dispatch({ type: 'REMOVE_FIELD', payload: index })} className="h-6 w-6 p-0">
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
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default memo(ProductEditor);
