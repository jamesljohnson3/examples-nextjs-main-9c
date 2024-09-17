/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN } from '@/app/(shell)/(main)/queries';
import CustomFormBuilder from './CustomFormBuilder'; // Adjust path as needed


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

const ProductPage: React.FC = () => {
  const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
  const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';

  // Fetch product details
  const { data: productData, loading: productLoading, error: productError } = useQuery(GET_PRODUCT, { variables: { productId: PRODUCT_ID } });
  const { data: segmentsData, loading: segmentsLoading, error: segmentsError } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID },
  });

  // Early return to handle loading and error states
  if (productLoading || segmentsLoading) return <p>Loading...</p>;
  if (productError) return <p>Error loading product: {productError.message}</p>;
  if (segmentsError) return <p>Error loading segments: {segmentsError.message}</p>;

  const product = productData?.Product?.[0] || {};
  const segments = segmentsData?.Segment || [];

  // State hooks
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [availableFields, setAvailableFields] = useState<FormField[]>(segments.map((segment: { id: any; name: any; }) => ({
    id: segment.id,
    type: 'text',
    label: segment.name,
  })));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<ProductData>(product);

  // Handler for input changes
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
          product.imageGallery.map((url: string | undefined, index: React.Key) => (
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
