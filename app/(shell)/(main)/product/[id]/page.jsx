"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_PRODUCT,
  GET_DESIGN_CONCEPTS,
  GET_DESIGN_ELEMENTS,
  GET_DESIGN_ELEMENT_VERSIONS,
  GET_WORKSPACE,
  GET_ORGANIZATION,
  GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, // Import the new query
} from "@/app/(shell)/(main)/queries";

const ProductPage = ({ params }) => {
  const PRODUCT_ID = params.id;
  const WORKSPACE_ID = 'cm14mvrze0008ue6y9xr15bph'; // Define your workspace ID here
  const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku'; // Define your domain ID here

  // Fetch product details
  const { data: productData, loading: productLoading, error: productError } = useQuery(GET_PRODUCT, { variables: { productId: PRODUCT_ID } });

  // Fetch design concepts
  const { data: designConceptsData, loading: designConceptsLoading, error: designConceptsError } = useQuery(GET_DESIGN_CONCEPTS, { variables: { productId: PRODUCT_ID } });

  // Fetch workspace details
  const { data: workspaceData, loading: workspaceLoading, error: workspaceError } = useQuery(GET_WORKSPACE, { variables: { workspaceId: WORKSPACE_ID } });

  // Fetch segments by productId and domainId
  const { data: segmentsData, loading: segmentsLoading, error: segmentsError } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID },
  });

  if (productLoading || designConceptsLoading || workspaceLoading || segmentsLoading) {
    return <p>Loading...</p>;
  }

  if (productError) return <p>Error loading product data: {productError.message}</p>;
  if (designConceptsError) return <p>Error loading design concepts: {designConceptsError.message}</p>;
  if (workspaceError) return <p>Error loading workspace data: {workspaceError.message}</p>;
  if (segmentsError) return <p>Error loading segments: {segmentsError.message}</p>;

  const product = productData?.Product?.[0] || {};
  const segments = segmentsData?.Segment || [];

  return (
    <div>
      <h1>{product?.name || 'Product Name'}</h1>
      <p>{product?.description || 'No description available.'}</p>

      <div>
        <h2>Segments</h2>
        {segments.length > 0 ? (
          segments.map(segment => (
            <div key={segment.id}>
              <h3>{segment.name}</h3>
              <p>{segment.slug}</p>
              <p>{segment.post ? JSON.stringify(segment.post) : 'No post data available'}</p>
            </div>
          ))
        ) : (
          <p>No segments available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
