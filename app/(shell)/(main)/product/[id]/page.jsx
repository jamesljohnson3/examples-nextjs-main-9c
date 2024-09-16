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

  const [designElements, setDesignElements] = useState([]);
  const [domains, setDomains] = useState({});

  // Fetch product details
  const { data: productData, loading: productLoading, error: productError } = useQuery(GET_PRODUCT, { variables: { productId: PRODUCT_ID } });

  // Fetch design elements for the product
  const { data: designElementsData, loading: designElementsLoading, error: designElementsError } = useQuery(GET_DESIGN_ELEMENTS, { variables: { designConceptId: PRODUCT_ID }, skip: !PRODUCT_ID });

  useEffect(() => {
    if (designElementsData) {
      setDesignElements(designElementsData.DesignElement);

      // Fetch domains for each design element
      designElementsData.DesignElement.forEach(async (element) => {
        try {
          const { data: domainData } = await client.query({
            query: GET_DOMAIN,
            variables: { domainId: element.domainId }
          });
          setDomains((prevDomains) => ({
            ...prevDomains,
            [element.domainId]: domainData.Domain
          }));
        } catch (error) {
          console.error(`Error fetching domain for element ${element.id}:`, error);
        }
      });
    }
  }, [designElementsData]);

  if (productLoading || designElementsLoading) return <p>Loading...</p>;
  if (productError) return <p>Error loading product data: {productError.message}</p>;
  if (designElementsError) return <p>Error loading design elements: {designElementsError.message}</p>;

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

      <div>
        <h2>Design Elements</h2>
        {designElements.length > 0 ? (
          designElements.map((element) => (
            <div key={element.id}>
              <h3>{element.name}</h3>
              {/* Display more properties of design elements as needed */}
              {domains[element.domainId] && (
                <div>
                  <h4>Domain: {domains[element.domainId].name}</h4>
                  {/* Display more properties of domains as needed */}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No design elements available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;