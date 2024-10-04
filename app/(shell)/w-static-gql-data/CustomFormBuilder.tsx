"use client"
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { 
  GET_PRODUCT, 
  GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN,
  GET_PRODUCT_VERSIONS, 
  GET_DESIGN_CONCEPTS, 
  GET_AI_SUGGESTIONS, 
  GET_DESIGN_ELEMENTS, 
  GET_MEDIA_FILES, 
  GET_USER_DETAILS,
  GET_DOMAIN,
  GET_DESIGN_ELEMENT_VERSIONS,
  GET_WORKSPACE,
  GET_ORGANIZATION,
  GET_DASHBOARD_DATA, 
  SAVE_PRODUCT, 
  UPDATE_PRODUCT_VERSION, 
  PUBLISH_SEGMENTS, 
  UPDATE_PRODUCT_AND_INSERT_SEGMENT, 
  ADD_DESIGN_ELEMENT_VERSION
} from '@/app/queries';

const USER_ID = "cm14mvrxe0002ue6ygbc4yyzr";
const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
const WORKSPACE_ID = 'cm14mvrze0008ue6y9xr15bph';
const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';
const ORGANIZATION_ID = 'cm14mvrwe0000ue6ygx7gfevr';

type Post = {
  id: string;
  content: string;
  createdAt: string;
};

type EditedPost = {
  [key: string]: string;
};

function SinglePost({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [editedPost, setEditedPost] = useState<EditedPost>({});
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [postKeys, setPostKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Queries
  const { data: productData } = useQuery(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID }
  });

  const { data: segmentsData } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID }
  });

  const { data: productVersionsData } = useQuery(GET_PRODUCT_VERSIONS, {
    variables: { productId: PRODUCT_ID }
  });

  const { data: designConceptsData } = useQuery(GET_DESIGN_CONCEPTS, {
    variables: { productId: PRODUCT_ID }
  });

  const { data: aiSuggestionsData } = useQuery(GET_AI_SUGGESTIONS, {
    variables: { productId: PRODUCT_ID }
  });

  const { data: designElementsData } = useQuery(GET_DESIGN_ELEMENTS, {
    variables: { domainId: DOMAIN_ID }
  });

  const { data: mediaFilesData } = useQuery(GET_MEDIA_FILES, {
    variables: { designElementId: 'example-design-element-id' } // Replace with actual ID
  });

  const { data: userDetailsData } = useQuery(GET_USER_DETAILS, {
    variables: { userId: USER_ID }
  });

  const { data: domainData } = useQuery(GET_DOMAIN, {
    variables: { domainId: DOMAIN_ID }
  });

  const { data: designElementVersionsData } = useQuery(GET_DESIGN_ELEMENT_VERSIONS, {
    variables: { designElementId: 'example-design-element-id' } // Replace with actual ID
  });

  const { data: workspaceData } = useQuery(GET_WORKSPACE, {
    variables: { workspaceId: WORKSPACE_ID }
  });

  const { data: organizationData } = useQuery(GET_ORGANIZATION, {
    variables: { organizationId: ORGANIZATION_ID }
  });

  const { data: dashboardData } = useQuery(GET_DASHBOARD_DATA, {
    variables: { organizationId: ORGANIZATION_ID, userId: USER_ID }
  });

  // Mutations
  const [saveProduct] = useMutation(SAVE_PRODUCT);
  const [updateProductVersion] = useMutation(UPDATE_PRODUCT_VERSION);
  const [publishSegments] = useMutation(PUBLISH_SEGMENTS);
  const [updateProductAndInsertSegment] = useMutation(UPDATE_PRODUCT_AND_INSERT_SEGMENT);
  const [addDesignElementVersion] = useMutation(ADD_DESIGN_ELEMENT_VERSION);

  useEffect(() => {
    const data = productData?.Product?.[0];
    if (data) {
      setPost({
        id: data.id,
        content: data.description,
        createdAt: data.createdAt
      });
      setEditedPost({
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        quantity: data.quantity.toString(),
        category: data.category
      });
      setPostKeys(Object.keys(editedPost));
    }
  }, [productData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await saveProduct({
        variables: {
          productId: PRODUCT_ID,
          name: editedPost.name,
          description: editedPost.description,
          price: parseFloat(editedPost.price),
          quantity: parseInt(editedPost.quantity, 10),
          category: editedPost.category
        }
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProductVersion = async () => {
    try {
      await updateProductVersion({
        variables: {
          productId: PRODUCT_ID,
          versionNumber: 1,
          changes: "Initial version",
          data: { name: "New Product Version Data" },
          id: "new-version-id"
        }
      });
    } catch (err: any) {
      console.error('Error updating product version:', err.message);
    }
  };

  const handlePublishSegments = async () => {
    try {
      await publishSegments({
        variables: {
          productVersionId: "product-version-id",
          id: "segment-id"
        }
      });
    } catch (err: any) {
      console.error('Error publishing segments:', err.message);
    }
  };

  const handleUpdateProductAndInsertSegment = async () => {
    try {
      await updateProductAndInsertSegment({
        variables: {
          productId: PRODUCT_ID,
          name: "Updated Product Name",
          description: "Updated Product Description",
          segmentId: "new-segment-id",
          slug: "new-segment-slug",
          segmentName: "New Segment Name",
          domainId: DOMAIN_ID,
          post: { key: "value" }
        }
      });
    } catch (err: any) {
      console.error('Error updating product and inserting segment:', err.message);
    }
  };

  const handleAddDesignElementVersion = async () => {
    try {
      await addDesignElementVersion({
        variables: {
          designElementId: "design-element-id",
          versionNumber: 1,
          elementData: { key: "value" },
          screenshot: "screenshot-url",
          createdById: USER_ID,
          organizationId: ORGANIZATION_ID
        }
      });
    } catch (err: any) {
      console.error('Error adding design element version:', err.message);
    }
  };

  if (!post) {
    return null;
  }

  return (
    <div>
      <div className="flex max-w-sm flex-col flex-1">
        <div className="px-5 py-3">
          {postKeys.map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700">
                {key}
              </label>
              <input
                type="text"
                name={key}
                value={editedPost[key] || ""}
                onChange={handleInputChange}
                className="block w-full border rounded-md px-3 py-2 mt-2"
              />
            </div>
          ))}
        </div>

        <div className="px-2 hidden md:block mt-auto border-y p-2.5">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`justify-center items-center mt-4 ${isLoading ? 'bg-gray-500' : 'hover:bg-gray-900'}`}
            style={{
              backgroundColor: 'black',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              maxWidth: '200px',
              height: '2.5rem',
              width: '100%'
            }}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <time className="text-[11px] uppercase text-zinc-500 font-medium">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}
      {success && <p className="text-green-500">Description updated successfully!</p>}

      {/* Buttons to trigger mutations */}
      <button onClick={handleUpdateProductVersion} className="btn">Update Product Version</button>
      <button onClick={handlePublishSegments} className="btn">Publish Segments</button>
      <button onClick={handleUpdateProductAndInsertSegment} className="btn">Update Product & Insert Segment</button>
      <button onClick={handleAddDesignElementVersion} className="btn">Add Design Element Version</button>

      {/* Display fetched data */}
      <div>
        <h2>Product Details</h2>
        {productData?.Product && (
          <pre>{JSON.stringify(productData.Product, null, 2)}</pre>
        )}

        <h2>Segments</h2>
        {segmentsData?.Segment && (
          <pre>{JSON.stringify(segmentsData.Segment, null, 2)}</pre>
        )}

        <h2>Product Versions</h2>
        {productVersionsData?.ProductVersion && (
          <pre>{JSON.stringify(productVersionsData.ProductVersion, null, 2)}</pre>
        )}

        <h2>Design Concepts</h2>
        {designConceptsData?.DesignConcept && (
          <pre>{JSON.stringify(designConceptsData.DesignConcept, null, 2)}</pre>
        )}

        <h2>AI Suggestions</h2>
        {aiSuggestionsData?.AISuggestion && (
          <pre>{JSON.stringify(aiSuggestionsData.AISuggestion, null, 2)}</pre>
        )}

        <h2>Design Elements</h2>
        {designElementsData?.DesignElement && (
          <pre>{JSON.stringify(designElementsData.DesignElement, null, 2)}</pre>
        )}

        <h2>Media Files</h2>
        {mediaFilesData?.MediaFile && (
          <pre>{JSON.stringify(mediaFilesData.MediaFile, null, 2)}</pre>
        )}

        <h2>User Details</h2>
        {userDetailsData?.User && (
          <pre>{JSON.stringify(userDetailsData.User, null, 2)}</pre>
        )}

        <h2>Domain</h2>
        {domainData?.Domain && (
          <pre>{JSON.stringify(domainData.Domain, null, 2)}</pre>
        )}

        <h2>Design Element Versions</h2>
        {designElementVersionsData?.DesignElementVersion && (
          <pre>{JSON.stringify(designElementVersionsData.DesignElementVersion, null, 2)}</pre>
        )}

        <h2>Workspace</h2>
        {workspaceData?.Workspace && (
          <pre>{JSON.stringify(workspaceData.Workspace, null, 2)}</pre>
        )}

        <h2>Organization</h2>
        {organizationData?.Organization && (
          <pre>{JSON.stringify(organizationData.Organization, null, 2)}</pre>
        )}

        <h2>Dashboard Data</h2>
        {dashboardData && (
          <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
        )}
      </div>
    </div>
  );
}

export default SinglePost;
