'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  PlusIcon,
  MinusIcon,
  GripVertical,
  ImageIcon,
  EyeIcon,
  BarChart3Icon,
  Sliders,
  MessageSquare,
  ChevronLeft,
  Save,
  Upload,
  Image,
  FileImage,
  X,
} from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useState, useEffect, memo, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client'; 
import { GET_PRODUCT, SAVE_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS, UPDATE_SEGMENT } from '@/app/(shell)/(main)/queries';
import { v4 as uuidv4 } from 'uuid';
import { DELETE_SEGMENT } from './mutations';

interface FormElement {
  id: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  label: string;
  options?: string[];
}

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

const sampleProductData: ProductData = {
  id: 'PROD-12345',
  name: 'Wireless Earbuds',
  description: 'High-quality wireless earbuds with noise cancellation',
  price: 99.99,
  quantity: 500,
  category: 'Electronics',
};

export default function EnhancedProductMoodboard() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [remainingFields, setRemainingFields] = useState<FormField[]>(initialAvailableFields);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [imageGallery, setImageGallery] = useState<string[]>([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    keywords: '',
  });
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldType, setCustomFieldType] = useState('text');
  const [customFieldOptions, setCustomFieldOptions] = useState('');
  const [activeTab, setActiveTab] = useState<'form' | 'refine' | 'analytics'>(
    'form'
  );
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
          id: field.id || uuidv4(),
          type: field.type || 'text',
          label: field.label || '',
          value: field.value || '',
          options: field.options || []
        }))
      );
  
      console.log('formfields', segmentFields);
  
      setFormFields(segmentFields);
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
          category
        }
      });
      alert('Product saved successfully!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'primary' | 'og' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      switch (type) {
        case 'primary':
          setPrimaryPhoto(reader.result as string);
          break;
        case 'og':
          setOgImage(reader.result as string);
          break;
        case 'gallery':
          setImageGallery(prev => [...prev, reader.result as string]);
          break;
      }
      setHasUnsavedChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleMetadataChange = (key: 'title' | 'description' | 'keywords', value: string) => {
    setMetadata(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="productImages">
          <AccordionTrigger>Images</AccordionTrigger>
          <AccordionContent>
            <div>
              <h4>Primary Photo</h4>
              <input type="file" onChange={(e) => handleImageUpload(e, 'primary')} />
              {primaryPhoto && <img src={primaryPhoto} alt="Primary" />}
            </div>

            <div>
              <h4>OG Image</h4>
              <input type="file" onChange={(e) => handleImageUpload(e, 'og')} />
              {ogImage && <img src={ogImage} alt="OG" />}
            </div>

            <div>
              <h4>Image Gallery</h4>
              <input type="file" multiple onChange={(e) => handleImageUpload(e, 'gallery')} />
              <div>
                {imageGallery.map((img, index) => (
                  <img key={index} src={img} alt={`Gallery ${index}`} />
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="productMetadata">
          <AccordionTrigger>Metadata</AccordionTrigger>
          <AccordionContent>
            <Input
              placeholder="Meta Title"
              value={metadata.title}
              onChange={(e) => handleMetadataChange('title', e.target.value)}
            />
            <Textarea
              placeholder="Meta Description"
              value={metadata.description}
              onChange={(e) => handleMetadataChange('description', e.target.value)}
            />
            <Input
              placeholder="Keywords (comma-separated)"
              value={metadata.keywords}
              onChange={(e) => handleMetadataChange('keywords', e.target.value)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ResizablePanelGroup direction={"horizontal"}>
        <ResizablePanel>
          <Accordion type="single" collapsible>
            <AccordionItem value="productDetails">
              <AccordionTrigger>Product Details</AccordionTrigger>
              <AccordionContent>
                <div>
                  {formFields.map((field, index) => (
                    <div key={field.id}>
                      <label>{field.label}</label>
                      {field.type === 'text' || field.type === 'number' ? (
                        <Input
                          type={field.type}
                          value={field.value as string | number}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                      ) : field.type === 'textarea' ? (
                        <Textarea
                          value={field.value as string}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                      ) : field.type === 'select' && field.options ? (
                        <Select onValueChange={(value) => handleInputChange(field.id, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : null}
                      <Button variant="destructive" onClick={() => handleRemoveField(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="addField">
              <AccordionTrigger>Add Field</AccordionTrigger>
              <AccordionContent>
                <div>
                  <Input
                    placeholder="Field Label"
                    value={customFieldLabel}
                    onChange={(e) => setCustomFieldLabel(e.target.value)}
                  />
                  <Select onValueChange={setCustomFieldType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select field type" />
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
                      placeholder="Comma-separated options"
                      value={customFieldOptions}
                      onChange={(e) => setCustomFieldOptions(e.target.value)}
                    />
                  )}
                  <Button
                    onClick={() =>
                      handleAddField({
                        id: uuidv4(),
                        type: customFieldType,
                        label: customFieldLabel,
                        options: customFieldType === 'select' ? customFieldOptions.split(',') : undefined,
                      })
                    }
                  >
                    Add Field
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ResizablePanel>

        <ResizableHandle />
        <ResizablePanel>
          <Button onClick={handleSave}>Save Product</Button>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
