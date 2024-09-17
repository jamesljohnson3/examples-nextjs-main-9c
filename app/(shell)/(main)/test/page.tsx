'use client'
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { 
  PlusIcon, MinusIcon, GripVertical, 
  ImageIcon, EyeIcon, BarChart3Icon, Sliders as SlidersIcon, MessageSquare, ChevronLeft, 
  Save, FileImage, Image  } from 'lucide-react';
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable";
import Link from 'next/link';

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
  
  const [previewData, setPreviewData] = useState<ProductData>(sampleProductData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [imageGallery, setImageGallery] = useState<string[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({ title: '', description: '', keywords: '' });
  
  const [activeTab, setActiveTab] = useState('form');
  

  const [versions, setVersions] = useState<Version[]>([
    { id: 1, timestamp: new Date().toISOString(), changes: 'Initial version' },
    { id: 2, timestamp: new Date(Date.now() - 86400000).toISOString(), changes: 'Updated product description' },
  ]);
  const [activeVersion, setActiveVersion] = useState(1);

  

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


          </Accordion>
        ); 
        case 'refine':
          return (
          
                  <Card className="bg-white backdrop-blur-lg border-0">
                    <CardContent className="p-2 space-y-2">
                      heello world
                      
                    </CardContent>
                  </Card>
             
             
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
            
            
          </ResizablePanel>
        </ResizablePanelGroup>
  )
}