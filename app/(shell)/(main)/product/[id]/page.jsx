"use client"
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { 
  GET_PRODUCT, 
  GET_PRODUCT_VERSIONS, 
  GET_DESIGN_CONCEPTS, 
  GET_AI_SUGGESTIONS, 
  GET_DESIGN_ELEMENTS, 
  GET_MEDIA_FILES, 
  GET_USER_DETAILS,
  GET_DOMAIN 
} from '@/app/(shell)/(main)/queries';
import DesignElementsForConcept from "./design-element"


const ProductPage = ({ params }) => {
  const PRODUCT_ID = params.id;

  // Fetch product details
  const { data, loading, error } = useQuery(GET_PRODUCT, { variables: { productId: PRODUCT_ID } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  const product = data?.Product?.[0]; // Assuming `Product` returns an array

  return (
    <div>
      <h1>{product?.name || 'Product Name'}</h1>
      <p>{product?.description || 'No description available.'}</p>
      {product?.primaryPhoto && <img src={product.primaryPhoto} alt={product?.name || 'Product Image'} />}
      <div>
        <h2>Image Gallery</h2>
        {product?.imageGallery?.length > 0 ? (
          product.imageGallery.map((url, index) => (
            <img key={index} src={url} alt={`Gallery ${index}`} style={{ maxWidth: '200px', margin: '10px' }} />
          ))
        ) : (
          <p>No images available.</p>
        )}
      </div>
      <p>Price: ${product?.price || 'N/A'}</p>
    </div>
  );
};

export default ProductPage;