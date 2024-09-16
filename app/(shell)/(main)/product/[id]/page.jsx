// pages/product/[id].js
import { useQuery } from '@apollo/client';
import { 
  GET_PRODUCT, 
  GET_PRODUCT_VERSIONS, 
  GET_DESIGN_CONCEPTS, 
  GET_AI_SUGGESTIONS, 
  GET_DESIGN_ELEMENTS, 
  GET_MEDIA_FILES, 
  GET_USER_DETAILS,
  GET_DOMAIN, 
} from '@/app/(shell)/(main)/queries';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

const ProductDetails = ({ productId }) => {
  const [designElements, setDesignElements] = useState([]);
  const [domains, setDomains] = useState({});
  const [mediaFiles, setMediaFiles] = useState({});
  
  // Fetch product details
  const { loading: loadingProduct, data: productData } = useQuery(GET_PRODUCT, {
    variables: { productId }
  });
  
  // Fetch product versions
  const { data: productVersionsData } = useQuery(GET_PRODUCT_VERSIONS, {
    variables: { productId }
  });

  // Fetch design concepts
  const { data: designConceptsData } = useQuery(GET_DESIGN_CONCEPTS, {
    variables: { productId }
  });

  // Fetch AI suggestions
  const { data: aiSuggestionsData } = useQuery(GET_AI_SUGGESTIONS, {
    variables: { productId }
  });

  // Fetch design elements
  const { data: designElementsData } = useQuery(GET_DESIGN_ELEMENTS, {
    variables: { designConceptId: productId }
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

  if (loadingProduct) return <p>Loading...</p>;

  return (
    <div>
      <h1>{productData?.Product[0].name}</h1>
      <p>{productData?.Product[0].description}</p>
      <div>
        <h2>Product Versions</h2>
        {productVersionsData?.ProductVersion.map((version) => (
          <div key={version.id}>
            <h3>Version Number: {version.versionNumber}</h3>
            <p>Changes: {version.changes}</p>
            <p>Created At: {version.createdAt}</p>
          </div>
        ))}
      </div>
      <div>
        <h2>Design Concepts</h2>
        {designConceptsData?.DesignConcept.map((concept) => (
          <div key={concept.id}>
            <h3>{concept.title}</h3>
            <img src={concept.image} alt={concept.title} />
            <p>Created At: {concept.createdAt}</p>
          </div>
        ))}
      </div>
      <div>
        <h2>AI Suggestions</h2>
        {aiSuggestionsData?.AISuggestion.map((suggestion) => (
          <div key={suggestion.id}>
            <p>{suggestion.content}</p>
            <p>Created At: {suggestion.createdAt}</p>
          </div>
        ))}
      </div>
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
              {mediaFiles[element.id]?.map((file) => (
                <div key={file.id}>
                  <p>File Name: {file.name}</p>
                  <img src={file.url} alt={file.name} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;