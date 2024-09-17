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
// Define an enum for reserved fields
enum ReservedFieldsEnum {
  ID = 'id',
  NAME = 'name',
  DESCRIPTION = 'description',
  PRICE = 'price',
  QUANTITY = 'quantity',
  CATEGORY = 'category',
  ORGANIZATION_ID = 'organizationId',
  CREATED_BY_ID = 'createdById',
  PRIMARY_PHOTO = 'primaryPhoto',
  IMAGE_GALLERY = 'imageGallery',
  OG_IMAGE = 'ogImage',
  METADATA = 'metadata',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  DESIGN_CONCEPTS = 'designConcepts',
  AI_SUGGESTIONS = 'aiSuggestions',
  SEGMENT = 'Segment'
}

// Define the type using the enum values
type ReservedFields = keyof typeof ReservedFieldsEnum;

// Define reserved fields as a Set for faster lookup
const RESERVED_FIELDS: Set<ReservedFields> = new Set([
  ReservedFieldsEnum.ID,
  ReservedFieldsEnum.NAME,
  ReservedFieldsEnum.DESCRIPTION,
  ReservedFieldsEnum.PRICE,
  ReservedFieldsEnum.QUANTITY,
  ReservedFieldsEnum.CATEGORY,
  ReservedFieldsEnum.ORGANIZATION_ID,
  ReservedFieldsEnum.CREATED_BY_ID,
  ReservedFieldsEnum.PRIMARY_PHOTO,
  ReservedFieldsEnum.IMAGE_GALLERY,
  ReservedFieldsEnum.OG_IMAGE,
  ReservedFieldsEnum.METADATA,
  ReservedFieldsEnum.CREATED_AT,
  ReservedFieldsEnum.UPDATED_AT,
  ReservedFieldsEnum.DESIGN_CONCEPTS,
  ReservedFieldsEnum.AI_SUGGESTIONS,
  ReservedFieldsEnum.SEGMENT
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

// React component example
const ProductEditor = () => {
  const [post, setPost] = useState<Post>(STATIC_PRODUCT_DATA);
  const [editedPost, setEditedPost] = useState<EditedPost>({});
  const [postKeys, setPostKeys] = useState<string[]>([]);
  const [customFields, setCustomFields] = useState<EditedPost>({});

  useEffect(() => {
    const parseContent = () => {
      try {
        const content = JSON.parse(post.content);
        setEditedPost(content);

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

  const handleCustomFieldChange = (key: string, value: string) => {
    setEditedPost((prev: any) => ({
      ...prev,
      [key]: value
    }));
    setCustomFields((prev: any) => ({
      ...prev,
      [key]: value
    }));
  };

  const validateCustomFields = () => {
    for (let key of Object.keys(customFields)) {
      if (RESERVED_FIELDS.has(key as ReservedFields)) {
        console.error(`Custom field '${key}' is reserved and cannot be used.`);
        return false;
      }
    }
    return true;
  };

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
