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
// Constants for fixed values
const PRODUCT_ID = 'cm14mvs2o000fue6yh6hb13yn';
const USER_ID = 'cm14mvrxe0002ue6ygbc4yyzr';

const ProductPage = () => {
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id: PRODUCT_ID },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data.product;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Quantity: {product.quantity}</p>
    </div>
  );
};