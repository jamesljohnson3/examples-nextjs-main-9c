"use client"
import React, { useState, useEffect } from 'react';

// Define types for the component
type Post = {
  id: string;
  content: string;
  createdAt: string;
};

type EditedPost = {
  [key: string]: string;
};

type ReservedFields = 'id' | 'name' | 'description' | 'price' | 'quantity' | 'category' |
  'organizationId' | 'createdById' | 'primaryPhoto' | 'imageGallery' | 'ogImage' |
  'metadata' | 'createdAt' | 'updatedAt' | 'designConcepts' | 'aiSuggestions' | 'Segment';

// Define reserved fields as a Set for faster lookup
const RESERVED_FIELDS: Set<ReservedFields> = new Set([
  'id', 'name', 'description', 'price', 'quantity', 'category',
  'organizationId', 'createdById', 'primaryPhoto', 'imageGallery', 'ogImage',
  'metadata', 'createdAt', 'updatedAt', 'designConcepts', 'aiSuggestions', 'Segment'
]);

// Sample static data
const STATIC_PRODUCT_DATA: Post = {
  id: 'prod123',
  content: JSON.stringify({
    name: 'Sample Product',
    description: 'A sample product for demonstration.',
    price: '99.99',
    quantity: '10',
    category: 'Electronics',
    customField1: 'Custom Value 1',
    customField2: 'Custom Value 2'
  }),
  createdAt: '2023-01-01T00:00:00Z'
};

const ProductEditor = () => {
  const [post, setPost] = useState<Post>(STATIC_PRODUCT_DATA);
  const [editedPost, setEditedPost] = useState<EditedPost>({});
  const [postKeys, setPostKeys] = useState<string[]>([]);
  const [customFields, setCustomFields] = useState<EditedPost>({});

  // Parse content from static data to initialize the form fields
  useEffect(() => {
    const parseContent = () => {
      try {
        const content = JSON.parse(post.content);
        setEditedPost(content);

        // Filter out reserved fields
        const customFieldsData = Object.keys(content).reduce((acc, key) => {
          if (!RESERVED_FIELDS.has(key as ReservedFields)) {
            acc[key] = content[key];
          }
          return acc;
        }, {} as EditedPost);

        setCustomFields(customFieldsData);
        setPostKeys(Object.keys(content));
      } catch (error) {
        console.error('Error parsing content:', error);
      }
    };

    parseContent();
  }, [post]);

  // Handler for input changes in custom fields
  const handleCustomFieldChange = (key: string, value: string) => {
    setEditedPost(prev => ({
      ...prev,
      [key]: value
    }));
    setCustomFields(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Validate custom fields to avoid overlap with reserved fields
  const validateCustomFields = () => {
    for (let key of Object.keys(customFields)) {
      if (RESERVED_FIELDS.has(key as ReservedFields)) {
        console.error(`Custom field '${key}' is reserved and cannot be used.`);
        return false;
      }
    }
    return true;
  };

  // Submit handler (placeholder)
  const handleSubmit = () => {
    if (validateCustomFields()) {
      console.log('Custom fields are valid. Submit data.');
      // Code to handle submission
    } else {
      console.log('Custom fields validation failed.');
    }
  };

  return (
    <div>
      <h1>Edit Product</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {/* Display core product fields */}
        {postKeys.map(key => {
          if (RESERVED_FIELDS.has(key as ReservedFields)) {
            return (
              <div key={key}>
                <label>{key}:</label>
                <input
                  type="text"
                  value={editedPost[key] || ''}
                  onChange={(e) => handleCustomFieldChange(key, e.target.value)}
                  disabled={RESERVED_FIELDS.has(key as ReservedFields)}
                />
              </div>
            );
          } else {
            return (
              <div key={key}>
                <label>{key}:</label>
                <input
                  type="text"
                  value={customFields[key] || ''}
                  onChange={(e) => handleCustomFieldChange(key, e.target.value)}
                />
              </div>
            );
          }
        })}
        <button type="button" onClick={handleSubmit}>Save</button>
      </form>
    </div>
  );
};

export default ProductEditor;
