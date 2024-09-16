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
} from '@/app/(main)/queries';
import DesignElementsForConcept from "./design-element"
// Constants for fixed values
const PRODUCT_ID = 'cm14mvs2o000fue6yh6hb13yn';
const USER_ID = 'cm14mvrxe0002ue6ygbc4yyzr';

const ProductPage = () => {
  const [designElements, setDesignElements] = useState([]);
  const [domains, setDomains] = useState({});
  const [mediaFiles, setMediaFiles] = useState({});

  // Fetch product details
  const { data: productData, loading: productLoading, error: productError } = useQuery(GET_PRODUCT, { variables: { productId: PRODUCT_ID } });
  
  // Fetch product versions
  const { data: versionsData, loading: versionsLoading, error: versionsError } = useQuery(GET_PRODUCT_VERSIONS, { variables: { productId: PRODUCT_ID } });
  
  // Fetch design concepts
  const { data: conceptsData, loading: conceptsLoading, error: conceptsError } = useQuery(GET_DESIGN_CONCEPTS, { variables: { productId: PRODUCT_ID } });
  
  // Fetch AI suggestions
  const { data: aiSuggestionsData, loading: aiSuggestionsLoading, error: aiSuggestionsError } = useQuery(GET_AI_SUGGESTIONS, { variables: { productId: PRODUCT_ID } });

  // Fetch user details
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_DETAILS, { variables: { userId: USER_ID } });

  // Fetch design elements for the product
  const { data: designElementsData, loading: designElementsLoading, error: designElementsError } = useQuery(GET_DESIGN_ELEMENTS, {
    variables: { designConceptId: PRODUCT_ID },
    skip: !PRODUCT_ID // Skip if productId is not available
  });
  
  useEffect(() => {
    if (designElementsData) {
      setDesignElements(designElementsData.DesignElement);
  
      // Fetch domains for each design element
      designElementsData.DesignElement.forEach(async (element) => {
        const { data: domainData } = await client.query({
          query: GET_DOMAIN,
          variables: { domainId: element.domainId }
        });
        setDomains((prevDomains) => ({
          ...prevDomains,
          [element.domainId]: domainData.Domain
        }));

        // Fetch media files for each design element
        const { data: mediaFilesData } = await client.query({
          query: GET_MEDIA_FILES,
          variables: { designElementId: element.id }
        });
        setMediaFiles((prevMediaFiles) => ({
          ...prevMediaFiles,
          [element.id]: mediaFilesData.MediaFile
        }));
      });
    }
  }, [designElementsData]);

  if (productLoading || versionsLoading || conceptsLoading || aiSuggestionsLoading || userLoading || designElementsLoading) 
    return <p>Loading...</p>;
  
  if (productError || versionsError || conceptsError || aiSuggestionsError || userError || designElementsError) 
    return <p>Error loading data.</p>;

  const product = productData?.Product[0];

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <img src={product.primaryPhoto} alt={product.name} />
      <div>
        <h2>Image Gallery</h2>
        {product.imageGallery.map((url, index) => (
          <img key={index} src={url} alt={`Gallery ${index}`} />
        ))}
      </div>

      <h2>Versions</h2>
      {versionsData?.ProductVersion.map(version => (
        <div key={version.id}>
          <p>Version {version.versionNumber}</p>
          <p>{version.changes}</p>
        </div>
      ))}

      <h2>Design Concepts</h2>
      {conceptsData?.DesignConcept.map(concept => (
        <div key={concept.id}>
          <p>{concept.title}</p>
          <img src={concept.image} alt={concept.title} />
          {/* Fetch and render design elements for this concept */}
          <DesignElementsForConcept designConceptId={concept.id} />
        </div>
      ))}
      
      <h2>AI Suggestions</h2>
      {aiSuggestionsData?.AISuggestion.map(suggestion => (
        <div key={suggestion.id}>
          <p>{suggestion.content}</p>
        </div>
      ))}

      <div>
        <h2>Design Elements</h2>
        {designElements.map((element) => (
          <div key={element.id}>
            <h3>Element ID: {element.id}</h3>
            <p>Type: {element.elementType}</p>
            <p>Version: {element.currentVersion}</p>
            <p>Domain: {domains[element.domainId]?.domain || 'Loading domain...'}</p>
            <div>
              <h4>Media Files</h4>
              {mediaFiles[element.id]?.map(file => (
                <div key={file.id}>
                  <p>File Name: {file.name}</p>
                  <img src={file.url} alt={file.name} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2>User Details</h2>
      {userData?.User && (
        <div>
          <p>Username: {userData.User.username}</p>
          <p>Email: {userData.User.email}</p>
          <p>Role: {userData.User.role}</p>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
