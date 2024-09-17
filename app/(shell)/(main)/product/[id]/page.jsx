"use client"
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { 
  GET_PRODUCT, 
  GET_DESIGN_CONCEPTS, 
  GET_DESIGN_ELEMENTS, 
  GET_DESIGN_ELEMENT_VERSIONS,
  GET_WORKSPACE,
  GET_ORGANIZATION
} from '@/app/(shell)/(main)/queries';

const ProductPage = ({ params }) => {
  const PRODUCT_ID = params.id;
  const WORKSPACE_ID = 'cm14mvrze0008ue6y9xr15bph'; // Define your workspace ID here
const DOMAIN_ID ='cm14mvs4l000jue6y5eo3ngku'
  const [organizationId, setOrganizationId] = useState(null);
  const [designElements, setDesignElements] = useState([]);
  const [designElementVersions, setDesignElementVersions] = useState({});

  // Fetch workspace details
  const { data: workspaceData, loading: workspaceLoading, error: workspaceError } = useQuery(GET_WORKSPACE, { variables: { workspaceId: WORKSPACE_ID } });

  // Fetch product details
  const { data: productData, loading: productLoading, error: productError } = useQuery(GET_PRODUCT, { variables: { productId: PRODUCT_ID } });

  // Fetch design concepts
  const { data: designConceptsData, loading: designConceptsLoading, error: designConceptsError } = useQuery(GET_DESIGN_CONCEPTS, { variables: { productId: PRODUCT_ID } });

  // Fetch organization details only when organizationId is available
  const { data: organizationData, loading: organizationLoading, error: organizationError } = useQuery(GET_ORGANIZATION, { 
    variables: { organizationId: organizationId },

  });

  // Fetch design elements only when organizationId is available
  const { data: designElementsData, loading: designElementsLoading, error: designElementsError } = useQuery(GET_DESIGN_ELEMENTS, { 
    variables: { domainId: DOMAIN_ID },

  });

  useEffect(() => {
    if (workspaceData) {
      const fetchedOrganizationId = workspaceData.Workspace?.[0]?.organization?.id;
      if (fetchedOrganizationId) {
        setOrganizationId(fetchedOrganizationId);
      }
    }
  }, [workspaceData]);

  useEffect(() => {
    if (organizationId) {
      // Fetch organization data when organizationId is available
      // This query is already done above, so nothing more to do here
    }
  }, [organizationId]);

  useEffect(() => {
    if (designElementsData) {
      setDesignElements(designElementsData.DesignElement || []);

      // Fetch versions for each design element
      designElementsData.DesignElement.forEach(async (element) => {
        try {
          const { data: versionsData } = await client.query({
            query: GET_DESIGN_ELEMENT_VERSIONS,
            variables: { designElementId: element.id }
          });

          if (versionsData) {
            setDesignElementVersions(prevVersions => ({
              ...prevVersions,
              [element.id]: versionsData.DesignElementVersion || []
            }));
          }
        } catch (error) {
          console.error('Error loading versions for element', element.id, error);
        }
      });
    }
  }, [designElementsData]);

  if (productLoading || designConceptsLoading || workspaceLoading || designElementsLoading || organizationLoading) {
    return <p>Loading...</p>;
  }

  if (productError) return <p>Error loading product data: {productError.message}</p>;
  if (designConceptsError) return <p>Error loading design concepts: {designConceptsError.message}</p>;
  if (workspaceError) return <p>Error loading workspace data: {workspaceError.message}</p>;
  if (designElementsError) return <p>Error loading design elements: {designElementsError.message}</p>;
  if (organizationError) return <p>Error loading organization data: {organizationError.message}</p>;

  const product = productData?.Product?.[0] || {};
  const workspace = workspaceData?.Workspace?.[0] || {};
  const organization = organizationData?.Organization?.[0] || {};

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

      <div>
        <h2>Design Concepts</h2>
        {designConceptsData?.DesignConcept?.length > 0 ? (
          designConceptsData.DesignConcept.map((concept) => (
            <div key={concept.id}>
              <h3>{concept.title}</h3>
              <img src={concept.image} alt={concept.title} />
            </div>
          ))
        ) : (
          <p>No design concepts available.</p>
        )}
      </div>

      <div>
        <h2>Design Elements</h2>
        {designElements.length > 0 ? (
          designElements.map((element) => (
            <div key={element.id}>
              <h3>{element.name}</h3>
              <p>Current Version: {element.currentVersion || 'N/A'}</p>
              {designElementVersions[element.id] && (
                <div>
                  <h4>Versions:</h4>
                  {designElementVersions[element.id].map((version) => (
                    <div key={version.id}>
                      <p>Version Number: {version.versionNumber}</p>
                      <p>Created By: {version.createdBy.username}</p>
                      <p>Created At: {new Date(version.createdAt).toLocaleString()}</p>
                      <img src={version.screenshot} alt={`Version ${version.versionNumber}`} style={{ maxWidth: '200px' }} />
                      {/* Display other fields as needed */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No design elements available.</p>
        )}
      </div>

      <div>
        <h1>Workspace Details</h1>
        <p>Name: {workspace?.name || 'N/A'}</p>
        <p>Created At: {workspace?.createdAt ? new Date(workspace.createdAt).toLocaleString() : 'N/A'}</p>

        {organization && (
          <div>
            <h2>Organization Details</h2>
            <p>Organization Name: {organization.name || 'N/A'}</p>
            <p>Created At: {organization.createdAt ? new Date(organization.createdAt).toLocaleString() : 'N/A'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
