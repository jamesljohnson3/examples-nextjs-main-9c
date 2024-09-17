"use client";

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_PRODUCT, 
  GET_DESIGN_CONCEPTS, 
  GET_DESIGN_ELEMENTS, 
  GET_DESIGN_ELEMENT_VERSIONS, 
  GET_DOMAIN, 
  ADD_DESIGN_ELEMENT_VERSION 
} from '@/app/(shell)/(main)/queries';

const ProductPage = () => {
  const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
  const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';
  const WORKSPACE_ID = 'cm14mvrze0008ue6y9xr15bph';

  // Fetch product details
  const { data: productData, loading: productLoading, error: productError } = useQuery(GET_PRODUCT, { variables: { productId: PRODUCT_ID } });
  
  // Fetch design concepts
  const { data: conceptsData, loading: conceptsLoading, error: conceptsError } = useQuery(GET_DESIGN_CONCEPTS, { variables: { productId: PRODUCT_ID } });

  // Fetch design elements for a specific concept
  const [selectedConceptId, setSelectedConceptId] = useState(null);
  const { data: designElementsData, loading: elementsLoading, error: elementsError } = useQuery(GET_DESIGN_ELEMENTS, { variables: { designConceptId: selectedConceptId }, skip: !selectedConceptId });

  // Mutation to add a new design element version
  const [addDesignElementVersion, { loading: addVersionLoading, error: addVersionError }] = useMutation(ADD_DESIGN_ELEMENT_VERSION);

  useEffect(() => {
    if (designElementsData) {
      // Fetch design element versions for each design element
      designElementsData.DesignElement.forEach(async (element) => {
        const { data: versionsData } = await client.query({
          query: GET_DESIGN_ELEMENT_VERSIONS,
          variables: { designElementId: element.id }
        });
        
        // Process version data here
      });
    }
  }, [designElementsData]);

  const handleAddVersion = async (designElementId, versionData) => {
    try {
      const { data } = await addDesignElementVersion({
        variables: {
          designElementId,
          versionNumber: versionData.versionNumber,
          elementData: versionData.elementData,
          screenshot: versionData.screenshot,
          createdById: versionData.createdById,
          organizationId: versionData.organizationId
        }
      });
      alert('Version added successfully!');
      console.log(data);
    } catch (error) {
      console.error('Error adding version:', error);
      alert('Error adding version.');
    }
  };

  if (productLoading || conceptsLoading || elementsLoading) return <p>Loading...</p>;
  if (productError || conceptsError || elementsError || addVersionError) return <p>Error loading data.</p>;

  const product = productData?.Product?.[0] || {};

  return (
    <div>
      <h1>{product?.name || 'Product Name'}</h1>
      <p>{product?.description || 'No description available.'}</p>
      {product?.primaryPhoto && <img src={product.primaryPhoto} alt={product?.name || 'Product Image'} />}
      <div>
        <h2>Image Gallery</h2>
        {product?.imageGallery?.length > 0 ? (
          product.imageGallery.map((url, index) => (
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
      <p>Price: ${product?.price || 'N/A'}</p>

      <h2>Design Concepts</h2>
      {conceptsData?.DesignConcept.map(concept => (
        <div key={concept.id} onClick={() => setSelectedConceptId(concept.id)}>
          <h3>{concept.title}</h3>
          <img src={concept.image} alt={concept.title} style={{ maxWidth: '100px', margin: '5px' }} />
        </div>
      ))}

      {selectedConceptId && (
        <div>
          <h2>Design Elements</h2>
          {designElementsData?.DesignElement.map(element => (
            <div key={element.id}>
              <h4>Element ID: {element.id}</h4>
              <p>Type: {element.elementType}</p>
              <p>Current Version: {element.currentVersion}</p>
              <p>Domain: {DOMAIN_ID}</p>
              {/* Example button to add a new version */}
              <button onClick={() => handleAddVersion(element.id, {
                versionNumber: element.currentVersion + 1,
                elementData: {}, // Replace with actual data
                screenshot: '', // Replace with actual screenshot URL
                createdById: 'user-id', // Replace with actual user ID
                organizationId: 'organization-id' // Replace with actual organization ID
              })}>
                Add New Version
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;


