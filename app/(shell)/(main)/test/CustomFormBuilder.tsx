"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { PlusIcon, MinusIcon, GripVertical, Settings2Icon, BrainCircuitIcon, SparklesIcon, ImageIcon, EyeIcon, BarChart3Icon, Sliders, MessageSquare, ChevronLeft, Save, Upload, Image, FileImage, Tag, Search, User, Maximize2, X, ArrowLeft, Zap, RefreshCw, Download, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

interface FormElement {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  label: string;
  options?: string[];
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

interface Metadata {
  title: string;
  description: string;
  keywords: string;
}

const initialFormElements: FormElement[] = [
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'description', type: 'textarea', label: 'Desc' },
  { id: 'price', type: 'number', label: 'Price' },
  { id: 'quantity', type: 'number', label: 'Qty' },
  { id: 'category', type: 'select', label: 'Cat', options: ['Electronics', 'Clothing', 'Food', 'Books'] },
];

const sampleProductData: ProductData = {
  id: 'PROD-12345',
  name: 'Wireless Earbuds',
  description: 'High-quality wireless earbuds with noise cancellation',
  price: 99.99,
  quantity: 500,
  category: 'Electronics',
};

const analyticsData = [
  { label: 'Views', value: 4328, icon: EyeIcon },
  { label: 'Likes', value: 1203, icon: BarChart3Icon },
  { label: 'Shares', value: 567, icon: Sliders },
  { label: 'Comments', value: 89, icon: MessageSquare },
];

const EnhancedProductMoodboard: React.FC = () => {
  const [formFields, setFormFields] = useState<FormElement[]>([]);
  const [availableFields, setAvailableFields] = useState<FormElement[]>(initialFormElements);
  const [previewData, setPreviewData] = useState<ProductData>(sampleProductData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [imageGallery, setImageGallery] = useState<string[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<Metadata>({ title: '', description: '', keywords: '' });
  const [fullscreenConcept, setFullscreenConcept] = useState<{ title: string; image: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>('form');

  useEffect(() => {
    setFormFields(initialFormElements.map(field => ({ ...field, id: `${field.id}-${Date.now()}` })));
    setAvailableFields([]);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(formFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormFields(items);
    setHasUnsavedChanges(true);
  };

  const addFormField = (field: FormElement) => {
    setFormFields([...formFields, { ...field, id: `${field.id}-${Date.now()}` }]);
    setAvailableFields(availableFields.filter(f => f.id !== field.id));
    setHasUnsavedChanges(true);
  };

  const removeFormField = (index: number) => {
    const removedField = formFields[index];
    const newFields = [...formFields];
    newFields.splice(index, 1);
    setFormFields(newFields);
    setAvailableFields([...availableFields, initialFormElements.find(f => f.id === removedField.id.split('-')[0])!]);
    setHasUnsavedChanges(true);
  };

  const handleInputChange = (id: string, value: string) => {
    setPreviewData({ ...previewData, [id]: value });
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    console.log('Saving changes...');
    setHasUnsavedChanges(false);
  };

  const handlePublish = () => {
    console.log('Publishing product...');
    setHasUnsavedChanges(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'primary' | 'og') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        switch (type) {
          case 'gallery':
            setImageGallery([...imageGallery, reader.result as string]);
            break;
          case 'primary':
            setPrimaryPhoto(reader.result as string);
            break;
          case 'og':
            setOgImage(reader.result as string);
            break;
        }
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMetadataChange = (key: keyof Metadata, value: string) => {
    setMetadata({ ...metadata, [key]: value });
    setHasUnsavedChanges(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'form':
        return (
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="product-form">
              <AccordionTrigger className="text-sm font-semibold">Product Form</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex space-x-1">
                        {availableFields.map((element) => (
                          <Button key={element.id} variant="outline" size="sm" className="h-6 text-xs px-1" onClick={() => addFormField(element)}>
                            <PlusIcon className="h-3 w-3 mr-1" /> {element.label}
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
                                    className="flex items-center space-x-1 bg-muted p-1 rounded text-xs"
                                  >
                                    <GripVertical className="h-3 w-3 text-muted-foreground" />
                                    {field.type === 'text' && (
                                      <Input 
                                        placeholder={field.label} 
                                        className="h-6 text-xs" 
                                        value={previewData[field.id.split('-')[0] as keyof ProductData] || ''}
                                        onChange={(e) => handleInputChange(field.id.split('-')[0], e.target.value)} 
                                      />
                                    )}
                                    {field.type === 'textarea' && (
                                      <Textarea 
                                        placeholder={field.label} 
                                        className="h-6 text-xs" 
                                        value={previewData[field.id.split('-')[0] as keyof ProductData] || ''}
                                        onChange={(e) => handleInputChange(field.id.split('-')[0], e.target.value)} 
                                      />
                                    )}
                                    {field.type === 'number' && (
                                      <Input 
                                        type="number" 
                                        placeholder={field.label} 
                                        className="h-6 text-xs" 
                                        value={previewData[field.id.split('-')[0] as keyof ProductData] || ''}
                                        onChange={(e) => handleInputChange(field.id.split('-')[0], e.target.value)} 
                                      />
                                    )}
                                    {field.type === 'select' && (
                                      <Select 
                                        value={previewData[field.id.split('-')[0] as keyof ProductData] || ''} 
                                        onValueChange={(value) => handleInputChange(field.id.split('-')[0], value)} 
                                      >
                                        <SelectTrigger className="h-6 text-xs">
                                          <SelectValue placeholder={field.label} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {field.options?.map((option) => (
                                            <SelectItem key={option} value={option}>{option}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                    <Button variant="outline" size="icon" onClick={() => removeFormField(index)}>
                                      <MinusIcon className="h-4 w-4" />
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
        );
      case 'media':
        return (
          <div>
            <div className="mb-4">
              <label className="block mb-2 text-sm">Primary Photo:</label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'primary')} />
              {primaryPhoto && <img src={primaryPhoto} alt="Primary" className="mt-2 w-full max-w-xs" />}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm">OG Image:</label>
              <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'og')} />
              {ogImage && <img src={ogImage} alt="OG" className="mt-2 w-full max-w-xs" />}
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm">Gallery:</label>
              <Input type="file" accept="image/*" multiple onChange={(e) => Array.from(e.target.files || []).forEach(file => handleImageUpload({ target: { files: [file] } } as any, 'gallery'))} />
              <div className="mt-2 flex flex-wrap gap-2">
                {imageGallery.map((img, index) => (
                  <img key={index} src={img} alt={`Gallery ${index}`} className="w-24 h-24 object-cover" />
                ))}
              </div>
            </div>
          </div>
        );
      case 'metadata':
        return (
          <Card>
            <CardContent className="p-2 space-y-2">
              <Input 
                placeholder="Title" 
                value={metadata.title}
                onChange={(e) => handleMetadataChange('title', e.target.value)} 
              />
              <Input 
                placeholder="Description" 
                value={metadata.description}
                onChange={(e) => handleMetadataChange('description', e.target.value)} 
              />
              <Input 
                placeholder="Keywords" 
                value={metadata.keywords}
                onChange={(e) => handleMetadataChange('keywords', e.target.value)} 
              />
            </CardContent>
          </Card>
        );
      case 'concept':
        return fullscreenConcept ? (
          <Card>
            <CardHeader>
              <CardTitle>{fullscreenConcept.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={fullscreenConcept.image} alt={fullscreenConcept.title} className="w-full" />
            </CardContent>
          </Card>
        ) : (
          <div>No concept selected</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="default" onClick={handleSave} disabled={!hasUnsavedChanges}>Save</Button>
        <Button variant="default" onClick={handlePublish} disabled={!hasUnsavedChanges}>Publish</Button>
      </div>
      <Tabs defaultValue="form" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="concept">Concept</TabsTrigger>
        </TabsList>
        <TabsContent>
          {renderTabContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedProductMoodboard;
