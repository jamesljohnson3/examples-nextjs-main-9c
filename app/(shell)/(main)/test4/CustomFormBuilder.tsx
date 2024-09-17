"use client"
import React, { useState, useEffect } from 'react';

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

// React component example
const ProductEditor = () => {
  const [post, setPost] = useState<Post>(STATIC_PRODUCT_DATA);
  const [editedPost, setEditedPost] = useState<EditedPost>({});
  const [postKeys, setPostKeys] = useState<string[]>([]);

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

  const handleSubmit = () => {
    // Update content and simulate saving
    const updatedContent = JSON.stringify(editedPost);
    console.log('Updated Content:', updatedContent);
    // You can add code here to save the updated content to the backend
  };

  return (
    <div>
      <h1>Edit Product</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {postKeys.map(key => (
          <div key={key}>
            <label>{key}:</label>
            <input
              type="text"
              value={editedPost[key] || ''}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              disabled={RESERVED_FIELDS.has(key as ReservedFields)} // Disable input if it's a reserved field
            />
          </div>
        ))}
        <button type="button" onClick={handleSubmit}>Save</button>
      </form>
    </div>
  );
};

export default ProductEditor;
