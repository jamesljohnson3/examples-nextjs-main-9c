'use client'
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon } from 'lucide-react';
import { GET_PRODUCT } from '@/app/(shell)/(main)/queries'; // Adjust the import path as needed

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

const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn"; // Example product ID

export default function InventoryManagement() {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [availableFields, setAvailableFields] = useState<FormField[]>(initialFormElements);
  const [previewData, setPreviewData] = useState<ProductData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({ title: '', description: '', keywords: '' });
  const [versions, setVersions] = useState<Version[]>([
    { id: 1, timestamp: new Date().toISOString(), changes: 'Initial version' },
    { id: 2, timestamp: new Date(Date.now() - 86400000).toISOString(), changes: 'Updated product description' },
  ]);
  const [activeVersion, setActiveVersion] = useState(1);

  // Fetch product data using GraphQL query
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID }
  });

  useEffect(() => {
    if (data && data.Product) {
      const product = data.Product;
      setPreviewData({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        category: product.category,
      });
      setPrimaryPhoto(product.primaryPhoto || null);
      // Set additional metadata if available
      setMetadata({
        title: product.metadata?.title || '',
        description: product.metadata?.description || '',
        keywords: product.metadata?.keywords || '',
      });
    }
  }, [data]);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading product data: {error.message}</div>;

  return (
    <Card className="bg-white backdrop-blur-lg border-0">
      <CardContent className="p-2">
        <div className="flex items-center space-x-4">
          {hasUnsavedChanges && <span className="text-yellow-500 text-sm">Unsaved changes</span>}
        </div>

        <div className="bg-white p-2 rounded-md space-y-1">
          {primaryPhoto ? (
            <img src={primaryPhoto} alt="Primary" className="w-full h-24 object-cover rounded-md mb-2" />
          ) : (
            <div className="w-full h-24 bg-white/20 rounded-md flex items-center justify-center mb-2">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          {previewData && Object.entries(previewData).map(([key, value]) => (
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
  );
}
