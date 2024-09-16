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


const ProductPage = () => {
  // Constants for fixed values
  const PRODUCT_ID = 'cm14mvs2o000fue6yh6hb13yn';
  const USER_ID = 'cm14mvrxe0002ue6ygbc4yyzr';

  // Fetch product details
  const { data: productData, loading: productLoading, error: productError } = useQuery(GET_PRODUCT, { variables: { productId: PRODUCT_ID } });
  if (productLoading) return <p>Loading...</p>;
  if (productError) return <p>Error loading data.</p>;

  const product = productData?.Product;

  return (
    <div>
      
      <h1>{product?.name}</h1>
      <p>{product?.description}</p>
      <img src={product?.primaryPhoto} alt={product?.name} />
      <div>
        <h2>Image Gallery</h2>
        {product?.imageGallery.map((url, index) => (
          <img key={index} src={url} alt={`Gallery ${index}`} />
        ))}
      </div>
      
      
      
      
      <p>Price: ${product?.price}</p>

    </div>
  );
};

export default ProductPage