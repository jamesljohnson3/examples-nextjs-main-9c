'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SidebarLayout,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  PlusIcon, MinusIcon, GripVertical, Settings2Icon, BrainCircuitIcon, SparklesIcon, 
  ImageIcon, EyeIcon, BarChart3Icon, Sliders as SlidersIcon, MessageSquare, ChevronLeft, 
  Save, FileImage, Maximize2, X, Zap, Image, RefreshCw, GitBranch, Lock, 
  Globe, CommandIcon, WandSparkles
} from 'lucide-react';
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Define interfaces for better type safety
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

interface AnalyticsDataItem {
  label: string;
  value: number;
  icon: React.ComponentType<any>; // Type for Lucide icons
}

interface DesignConcept {
  id: number;
  image: string;
  title: string;
}

interface Version {
  id: number;
  timestamp: string;
  changes: string;
}

const initialFormElements: FormField[] = [
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'description', type: 'textarea', label: 'Description' },
  { id: 'price', type: 'number', label: 'Price' },
  { id: 'quantity', type: 'number', label: 'Quantity' },
  { id: 'category', type: 'select', label: 'Category', options: ['Electronics', 'Clothing', 'Food', 'Books'] },
];

const sampleProductData: ProductData = {
  id: 'PROD-12345',
  name: 'Wireless Earbuds',
  description: 'High-quality wireless earbuds with noise cancellation',
  price: 99.99,
  quantity: 500,
  category: 'Electronics',
};

const analyticsData: AnalyticsDataItem[] = [
  { label: 'Views', value: 4328, icon: EyeIcon },
  { label: 'Likes', value: 1203, icon: BarChart3Icon },
  { label: 'Shares', value: 567, icon: SlidersIcon },
  { label: 'Comments', value: 89, icon: MessageSquare },
];

const sampleDesignConcepts: DesignConcept[] = [
  { id: 1, image: 'https://res.cloudinary.com/unlimitpotential/image/upload/v1724768966/IMG_3697copy_s9irf3.jpg', title: 'Concept 1' },
  { id: 2, image: 'https://res.cloudinary.com/unlimitpotential/image/upload/v1724768958/IMG_3692copy_fnjyaw.jpg', title: 'Concept 2' },
  { id: 3, image: 'https://res.cloudinary.com/unlimitpotential/image/upload/v1724768964/IMG_3694_wt2bd5.jpg', title: 'Concept 3' },
  { id: 4, image: 'https://res.cloudinary.com/unlimitpotential/image/upload/v1724768967/IMG_3698_ljblsa.jpg', title: 'Concept 4' },
];

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Select' },
];

const CustomFormBuilder: React.FC<{
  formFields: FormField[]; 
  setFormFields: React.Dispatch<React.SetStateAction<FormField[]>>;
  availableFields: FormField[];
  setAvailableFields: React.Dispatch<React.SetStateAction<FormField[]>>;
  previewData: ProductData; 
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  handleInputChange: (id: string, value: string | number) => void;
}> = ({ formFields, setFormFields, availableFields, setAvailableFields, previewData, handleInputChange }) => {
  const [newField, setNewField] = useState<FormField>({id:'', label: '', type: 'text', options: [] });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  useEffect(() => {
    setFormFields(initialFormElements.map(field => ({ ...field, id: `${field.id}-${Date.now()}` })))
    setAvailableFields([])
  }, [])
  const handleAddField = () => {
    const newFieldId = `customField-${Date.now()}`; 

    setFormFields([
      ...formFields,
      {
        ...newField,
        id: newFieldId,
      },
    ]);
       // If the field type is 'select', populate options from sampleProductData:
    if (newField.type === 'select') {
      setNewField({
        ...newField,
        options: Object.values(sampleProductData).filter(value => typeof value === 'string') as string[],
      });
    }
    setAvailableFields(availableFields.filter(f => f.id !== newField.id));

    setNewField({ id:'', label: '', type: 'text', options: [] });
  };
  const addFormField = (field: FormField) => {
    setFormFields([...formFields, { ...field, id: `${field.id}-${Date.now()}` }])
    setAvailableFields(availableFields.filter(f => f.id !== field.id))
    setHasUnsavedChanges(true)
  }


  const removeFormField = (index: number) => {
    const removedField = formFields[index];
    const newFields = [...formFields];
    newFields.splice(index, 1);

    setFormFields(newFields);
    setAvailableFields([...availableFields, initialFormElements.find(f => f.id === removedField.id.split('-')[0])!]); 
  };

  const onDragEnd = (result: any) => { // Update type as needed based on library
    if (!result.destination) return;
    const items = Array.from(formFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormFields(items);
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
                      {renderFieldInput(field, previewData, handleInputChange)}
                      <Button size="sm" variant="ghost" onClick={() => removeFormField(index)} className="h-6 w-6 p-0">
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

        <h3 className="mt-4 text-xs font-semibold">Add Custom Field</h3>
        <div className="space-y-1 max-w-sm">
          <Input
            placeholder="Field Label"
            value={newField.label}
            onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            className="text-xs h-7"
          />
          <Select
            value={newField.type}
            onValueChange={(value) => setNewField({ ...newField, type: value as string })} 
          >
            <SelectTrigger className="text-xs h-7">
              <SelectValue placeholder="Field Type" />
            </SelectTrigger>
            <SelectContent>
              {fieldTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-xs">
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {newField.type === 'select' && (
            <Input
              placeholder="Enter options (comma-separated)"
              value={newField.options.join(', ')}
              onChange={(e) =>
                setNewField({
                  ...newField,
                  options: e.target.value.split(',').map((option) => option.trim()),
                })
              }
              className="text-xs h-7"
            />
          )}
          <Button size="sm" onClick={handleAddField} className="text-xs h-7">
            Add Field
          </Button>
        </div>
      </div>
      
    </div>
  );
};

const renderFieldInput = (
  field: FormField, 
  previewData: ProductData, 
  handleInputChange: (id: string, value: string | number) => void
) => {
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


export default function InventoryManagement() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [availableFields, setAvailableFields] = useState<FormField[]>(initialFormElements);
  const [nlpSensitivity, setNlpSensitivity] = useState(50);
  const [aiCreativity, setAiCreativity] = useState(50);
  const [previewData, setPreviewData] = useState<ProductData>(sampleProductData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [imageGallery, setImageGallery] = useState<string[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({ title: '', description: '', keywords: '' });
  const [aiPrompt, setAiPrompt] = useState('');
  const [designConcepts, setDesignConcepts] = useState<DesignConcept[]>(sampleDesignConcepts);
  const [fullscreenConcept, setFullscreenConcept] = useState<DesignConcept | null>(null);
  const [activeTab, setActiveTab] = useState('form');
  const [aiProgress, setAIProgress] = useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([
    "Consider a more vibrant color palette to appeal to younger professionals",
    "Emphasize the product's unique features in the description",
    "Add customer testimonials to boost credibility",
    "Consider a more vibrant color palette to appeal to younger professionals",
    "Emphasize the product's unique features in the description",
    "Add customer testimonials to boost credibility",
  ]);
  const [versions, setVersions] = useState<Version[]>([
    { id: 1, timestamp: new Date().toISOString(), changes: 'Initial version' },
    { id: 2, timestamp: new Date(Date.now() - 86400000).toISOString(), changes: 'Updated product description' },
  ]);
  const [activeVersion, setActiveVersion] = useState(1);

  const [showCommandList, setShowCommandList] = useState(false);
  const commandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setShowCommandList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setFormFields([]);
    setAvailableFields([]);
  }, []);

  const handleInputChange = (id: string, value: string | number) => {
    setPreviewData((prevData) => ({ ...prevData, [id]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    console.log('Saving changes...');
    console.log("Form Data:", previewData);
    console.log("Custom Fields:", formFields); 

    setHasUnsavedChanges(false);
    const newVersion: Version = {
      id: versions.length + 1,
      timestamp: new Date().toISOString(),
      changes: 'Updated product information',
    };
    setVersions([...versions, newVersion]);
    setActiveVersion(newVersion.id);
  };

  const handlePublish = () => {
    console.log('Publishing product...');
    setHasUnsavedChanges(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') { 
          switch (type) {
            case 'gallery':
              setImageGallery([...imageGallery, reader.result]);
              break;
            case 'primary':
              setPrimaryPhoto(reader.result);
              break;
            case 'og':
              setOgImage(reader.result);
              break;
          }
          setHasUnsavedChanges(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMetadataChange = (key: string, value: string) => {
    setMetadata({ ...metadata, [key]: value });
    setHasUnsavedChanges(true);
  };

  const handleAiPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Generating design concepts for:', aiPrompt);
    setDesignConcepts(prevConcepts => [...prevConcepts].sort(() => Math.random() - 0.5));
    setAiPrompt('');
  };

  const handleRefinement = () => {
    setAIProgress(0);
    const interval = setInterval(() => {
      setAIProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDesignConcepts(prevConcepts => [...prevConcepts].sort(() => Math.random() - 0.5));
          setAiSuggestions(prevSuggestions => {
            const newSuggestion = `New AI-generated suggestion: ${Date.now()}`;
            return [...prevSuggestions.slice(1), newSuggestion];
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'form':
        return (
          <Accordion type="single" collapsible className="w-full space-y-2 px-2">
            <AccordionItem value="product-form">
              <AccordionTrigger className="text-xs font-semibold">Product Form</AccordionTrigger>
              <AccordionContent>
                <Card className="bg-white backdrop-blur-lg border-0">
                  <CardContent className="p-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex space-x-1">
                      </div>
                    </div>
                    {/* Custom Form Builder */}
                    <CustomFormBuilder 
                      formFields={formFields}
                      setFormFields={setFormFields}
                      availableFields={availableFields}
                      setAvailableFields={setAvailableFields}
                      previewData={previewData}
                      handleInputChange={handleInputChange}
                      hasUnsavedChanges={hasUnsavedChanges} // Pass state as prop
        setHasUnsavedChanges={setHasUnsavedChanges} // Pass updater function as prop
                    />
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
            {/* ... other AccordionItems ... */}

            <AccordionItem value="image-gallery">
              <AccordionTrigger className="text-xs font-semibold">Image Gallery</AccordionTrigger>
              <AccordionContent>
                <Card className="bg-white backdrop-blur-lg border-0">
                  <CardContent className="p-2 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {imageGallery.map((img, index) => (
                        <div key={index} className="w-16 h-16 relative group">
                          <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover rounded-md transition-all duration-200 group-hover:opacity-75" />
                          <Button size="sm" variant="destructive" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0" onClick={() => {
                            const newGallery = [...imageGallery]
                            newGallery.splice(index, 1)
                            setImageGallery(newGallery)
                            setHasUnsavedChanges(true)
                          }}>
                            <MinusIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <label className="w-16 h-16 flex items-center justify-center bg-white rounded-md cursor-pointer transition-all duration-200 hover:bg-white/20">
                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'gallery')} accept="image/*" />
                        <PlusIcon className="h-6 w-6 text-muted-foreground" />
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="primary-photo">
              <AccordionTrigger className="text-xs font-semibold">Primary Photo</AccordionTrigger>
              <AccordionContent>
                <Card className="bg-white backdrop-blur-lg border-0">
                  <CardContent className="p-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      {primaryPhoto ? (
                        <div className="w-24 h-24 relative group">
                          <img src={primaryPhoto} alt="Primary" className="w-full h-full object-cover rounded-md transition-all duration-200 group-hover:opacity-75" />
                          <Button size="sm" variant="destructive" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0" onClick={() => {
                            setPrimaryPhoto(null)
                            setHasUnsavedChanges(true)
                          }}>
                            <MinusIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <label className="w-24 h-24 flex items-center justify-center bg-white rounded-md cursor-pointer transition-all duration-200 hover:bg-white/20">
                          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'primary')} accept="image/*" />
                          <Image className="h-6 w-6 text-muted-foreground" />
                        </label>
                      )}
                      <span className="text-xs text-muted-foreground">Set as primary product image</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="og-image">
              <AccordionTrigger className="text-xs font-semibold">OG Image</AccordionTrigger>
              <AccordionContent>
                <Card className="bg-white backdrop-blur-lg border-0">
                  <CardContent className="p-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      {ogImage ? (
                        <div className="w-24 h-24 relative group">
                          <img src={ogImage} alt="OG" className="w-full h-full object-cover rounded-md transition-all duration-200 group-hover:opacity-75" />
                          <Button size="sm" variant="destructive" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0" onClick={() => {
                            setOgImage(null)
                            setHasUnsavedChanges(true)
                          }}>
                            <MinusIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <label className="w-24 h-24 flex items-center justify-center bg-white rounded-md cursor-pointer transition-all duration-200 hover:bg-white/20">
                          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'og')} accept="image/*" />
                          <FileImage className="h-6 w-6 text-muted-foreground" />
                        </label>
                      )}
                      <span className="text-xs text-muted-foreground">Set Open Graph image for social sharing</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="metadata">
              <AccordionTrigger className="text-xs font-semibold">Metadata</AccordionTrigger>
              <AccordionContent>
                <Card className="bg-white backdrop-blur-lg border-0">
                  <CardContent className="p-2 space-y-2">
                    <div className="space-y-1">
                      <Input 
                        placeholder="Meta Title" 
                        value={metadata.title}
                        onChange={(e) => handleMetadataChange('title', e.target.value)}
                        className="text-xs h-7"
                      />
                      <Textarea 
                        placeholder="Meta Description" 
                        value={metadata.description}
                        onChange={(e) => handleMetadataChange('description', e.target.value)}
                        className="text-xs h-14"
                      />
                      <Input 
                        placeholder="Keywords (comma-separated)" 
                        value={metadata.keywords}
                        onChange={(e) => handleMetadataChange('keywords', e.target.value)}
                        className="text-xs h-7"
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ); 
        case 'refine':
          return (
            <Accordion type="single" collapsible className="w-full space-y-2 px-2">
      
      
  
              <AccordionItem value="ai-config">
                <AccordionTrigger className="text-xs font-semibold">AI Config</AccordionTrigger>
                <AccordionContent>
                  <Card className="bg-white backdrop-blur-lg border-0">
                    <CardContent className="p-2 space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-xs">NLP Sensitivity</label>
                          <Settings2Icon className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <Slider
                          value={[nlpSensitivity]}
                          onValueChange={(value) => setNlpSensitivity(value[0])}
                          max={100}
                          step={1}
                          className="h-1"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-xs">AI Creativity</label>
                          <BrainCircuitIcon className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <Slider
                          value={[aiCreativity]}
                          onValueChange={(value) => setAiCreativity(value[0])}
                          max={100}
                          step={1}
                          className="h-1"
                        />
                      </div>
  
                      <form onSubmit={handleAiPromptSubmit} className="flex space-x-1">
                        <Input 
                          placeholder="Enter prompt for AI design concepts..." 
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          className="flex-grow text-xs h-7"
                        />
                        <Button type="submit" size="sm" className="text-xs h-7">Generate</Button>
                      </form>
                      <Button onClick={handleRefinement} className="w-full text-xs h-7">
                        {aiProgress > 0 && aiProgress < 100 ? (
                          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                          <Zap className="mr-1 h-3 w-3" />
                        )}
                        Save AI Refinement
                      </Button>
                      {aiProgress > 0 && (
                        <Progress value={aiProgress} className="w-full h-1" />
                      )}
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              <Card className=" bg-white backdrop-blur-lg border-0">
                    <CardContent className="p-2">
                      <ScrollArea className="h-[100px]">
                        <ul className="space-y-1">
                          {aiSuggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start space-x-1 animate-fade-in">
                              <SparklesIcon className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span className="text-xs">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </CardContent>
                  </Card>
              <Card className="bg-white mt-4 backdrop-blur-lg border-0">
                    <CardContent className="p-2 space-y-2">
                      
                      <div className="grid grid-cols-2 gap-2">
                        {designConcepts.map((concept) => (
                          <div key={concept.id} className="relative group">
                            <img src={concept.image} alt={concept.title} className="w-full h-auto rounded-md transition-all duration-200 group-hover:opacity-75" />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" onClick={() => setFullscreenConcept(concept)} className="text-xs">
                                <Maximize2 className="h-3 w-3 mr-1" />
                                Fullscreen
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
             
            </Accordion>
          )
        case 'analytics':
          return (
            <Card className="bg-white backdrop-blur-lg border-0 mx-2">
              <CardContent className="p-2">
                <h2 className="text-xs font-semibold mb-2">Analytics Scoreboard</h2>
                <div className="grid grid-cols-2 gap-2">
                  {analyticsData.map((item, index) => (
                    <Card key={index} className="bg-white border-0">
                      <CardContent className="p-2 flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <item.icon className="h-3 w-3 text-primary" />
                          <span className="text-xs font-semibold">{item.label}</span>
                        </div>
                        <span className="text-xs font-bold">{item.value.toLocaleString()}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        default:
          return null
      }
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-white  p-2 space-y-2">
  <div className="text-sm text-muted-foreground">
  <SidebarTrigger />
  Products / {previewData.category} / {previewData.id}
          </div>              <div className="grid grid-cols-3 gap-2 mb-2">
                <Card className="bg-white border-0">
                  <CardContent className="p-1">
                    <h3 className="text-xs font-bold">Version</h3>
                    <p className="text-xs">v2.1.3</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-0">
                  <CardContent className="p-1">

            <div className="flex items-center justify-between  px-6 py-4 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <CommandIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <h2 className="text-base font-semibold">{previewData.name}</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Online</div>
                </div>
              </div>
            </div>                
                  </CardContent>
                </Card>
                <Card className="bg-white border-0">
                  <CardContent className="p-1">
                    <h3 className="text-xs font-bold">Progress</h3>
                    <Progress value={75} className="h-1" />
                    <WandSparkles
    className={cn(
      "cursor-pointer my-2 text-foreground bg-background w-3 h-3",
      isAnimating ? "" : "text-muted-foreground"
    )}
    onClick={() => handleRefinement()}
  />
                  </CardContent>
                </Card>
              </div>


      <div className="max-w-6xl mx-auto space-y-2">
        <Card className="bg-white backdrop-blur-lg border-0">
          <CardContent 
             // Set the ref for the command container
             ref={commandRef}
             // Toggle visibility on click
             onClick={() => setShowCommandList(!showCommandList)} 

          className="p-2">
            <Command className="rounded-lg border-0 bg-transparent">
              <CommandInput placeholder="Type a command or search..." className="text-xs" />
             {/* Conditionally render the command list */}
              {showCommandList && (
                <CommandList className="text-xs">
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Actions">
                    <CommandItem>Add Product</CommandItem>
                    <CommandItem>Update Inventory</CommandItem>
                    <CommandItem>Generate Report</CommandItem>
                  </CommandGroup>
                </CommandList>
              )}
            </Command>
          </CardContent>
        </Card>

       

        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={70}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-10 w-full">
          <TabsList className="grid w-full grid-cols-3 h-10">
            <TabsTrigger value="form" className="text-xs">Form Builder</TabsTrigger>
            <TabsTrigger value="refine" className="text-xs">Refine with AI</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
            {renderTabContent()}

      <div className="p-4 flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          
          <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Go Back
                      </Button>
          </Link>
        
        </div>
        {hasUnsavedChanges && <div className="flex items-center space-x-4">
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
         
        </div>}

     
      </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30}>
            <Card className="bg-white backdrop-blur-lg border-0">
              <CardContent className="p-2">
             <div className="flex items-center space-x-4">
             {hasUnsavedChanges && <span className="text-yellow-500 text-sm">Unsaved changes</span>}</div>   

                <div className="bg-white p-2 rounded-md space-y-1">
                  {primaryPhoto ? (
                    <img src={primaryPhoto} alt="Primary" className="w-full h-24 object-cover rounded-md mb-2" />
                  ) : (
                    <div className="w-full h-24 bg-white/20 rounded-md flex items-center justify-center mb-2">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  {Object.entries(previewData).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <span className="font-semibold">{key}:</span> {value}
                    </div>
                  ))}
                  <div className="text-xs mt-2">
                    <span className="font-semibold">Meta Title:</span> {metadata.title}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">Meta Description:</span> {metadata.description}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">Keywords:</span> {metadata.keywords}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="mt-2 bg-white backdrop-blur-lg border-0">
              <CardHeader>
                <CardTitle className="text-xs">Version History</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[100px]">
                  {versions.map((version) => (
                    <div key={version.id} className="flex items-center justify-between py-1 border-b border-white last:border-b-0">
                      <div className="flex items-center space-x-1">
                        <Badge variant={version.id === activeVersion ? "default" : "secondary"} className="text-[10px]">v{version.id}</Badge>
                        <span className="text-[10px]">{new Date(version.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setActiveVersion(version.id)} className="h-5 w-5 p-0">
                                <GitBranch className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-[10px]">Switch to this version</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="text-[10px] text-muted-foreground">{version.changes}</span>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
        <div className="mt-8 grid grid-cols-12 gap-2">
          <Card className="col-span-3 bg-white backdrop-blur-lg border-0">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {['Advanced Options' ].map((item) => (
                  <Button key={item} variant="ghost" className="w-full justify-start text-xs py-1 px-2">

                    {item}
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>

          <Card className="col-span-9 bg-white backdrop-blur-lg border-0">
            <CardContent className="p-2">
             
              <div className="grid grid-cols-4 gap-1">
                {[
                  
                  { icon: Lock, label: 'Security' },
                  { icon: Globe, label: 'Geolocation' },

                  { icon: BarChart3Icon, label: 'Visitor Data' },
                  { icon: MessageSquare, label: 'Communication' },
                  
                ].map((item, index) => (
                  <Card key={index} className="bg-white border-0">
                    <CardContent className="p-1 flex flex-col items-center justify-center">
                      <item.icon className="h-3 w-3 mb-0.5" />
                      <span className="text-[10px]">{item.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
       
       
      </div>

      {fullscreenConcept && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl max-h-full overflow-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold">{fullscreenConcept.title}</h3>
              <Button size="sm" variant="ghost" onClick={() => setFullscreenConcept(null)} className="h-6 w-6 p-0">
                <X className="text-black h-4 w-4" />
              </Button>
            </div>
            <img src={fullscreenConcept.image} alt={fullscreenConcept.title} className="w-full h-auto rounded-md" />
          </div>
        </div>
      )}
    </div>
  )
}