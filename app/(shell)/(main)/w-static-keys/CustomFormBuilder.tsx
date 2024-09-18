"use client"
import { gql, useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
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
  GET_DESIGN_ELEMENT_VERSION2S,
  GET_WORKSPACE,
  GET_ORGANIZATION,
  GET_DASHBOARD_DATA,
  SAVE_PRODUCT,
  UPDATE_PRODUCT_VERSION,
  PUBLISH_SEGMENTS,
  UPDATE_PRODUCT_AND_INSERT_SEGMENT,
  ADD_DESIGN_ELEMENT_VERSION
} from '@/app/(shell)/(main)/queries';

const USER_ID = "cm14mvrxe0002ue6ygbc4yyzr";
const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
const WORKSPACE_ID = 'cm14mvrze0008ue6y9xr15bph';
const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';
  // Static post data
  const CustomFieldData: Post = {
    id: "sample-tableName-id",
    content: JSON.stringify([{
      model: "test",
      Make: "Nissan",
      Meta: "Vehicle for sale",
      Year: "2012",
      Mileage: "test",
      Transmission: "Auto",
      Passenger: "2 Door",
      Fuel: "test",
      Type: "Truck",
      html: "",
      image: "",
      video: "",
      caption: ""
    }]),
    createdAt: new Date().toISOString()
  };
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

  // Queries and Mutations
  const { data: productData } = useQuery(GET_PRODUCT, { variables: { productId: PRODUCT_ID } });
  const { data: designConceptsData } = useQuery(GET_DESIGN_CONCEPTS, { variables: { productId: PRODUCT_ID } });

  const [saveProduct] = useMutation(SAVE_PRODUCT);
  const [updateProductVersion] = useMutation(UPDATE_PRODUCT_VERSION);
  const [publishSegments] = useMutation(PUBLISH_SEGMENTS);
  const [updateProductAndInsertSegment] = useMutation(UPDATE_PRODUCT_AND_INSERT_SEGMENT);
  const [addDesignElementVersion] = useMutation(ADD_DESIGN_ELEMENT_VERSION);

  useEffect(() => {
    // Simulate fetching post data with static data
    const data = CustomFieldData;
    if (data) {
      setPost(data);
      const parsedContent = JSON.parse(data.content);
      if (Array.isArray(parsedContent) && parsedContent.length > 0) {
        setEditedPost(parsedContent[0]);
        const contentKeys = Object.keys(parsedContent[0]);
        setPostKeys(contentKeys);
      }
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const eventType = 'update';
    setIsLoading(true);
    try {
      const response = await fetch('/my-api-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...editedPost, 
          userId: USER_ID, 
          assetId: 'sample-asset-id', 
          eventType, 
          campaignId: 'sample-campaign-id', 
          postId: post?.id ?? ''
        }),
      });
      if (response.ok) {
        setSuccess(true);
      } else {
        throw new Error('Failed to update description');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      await saveProduct({ variables: { 
        productId: PRODUCT_ID, 
        name: 'Updated Product Name', 
        description: 'Updated Description', 
        price: 100.0, 
        quantity: 10, 
        category: 'Updated Category' 
      }});
      alert('Product saved successfully!');
    } catch (err: any) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  const handleUpdateProductVersion = async () => {
    try {
      await updateProductVersion({ variables: { 
        productId: PRODUCT_ID, 
        versionNumber: 2, 
        changes: 'Updated changes', 
        data: {}, 
        id: 'new-version-id' 
      }});
      alert('Product version updated successfully!');
    } catch (err: any) {
      alert(`Error updating product version: ${err.message}`);
    }
  };

  const handlePublishSegments = async () => {
    try {
      await publishSegments({ variables: { 
        productVersionId: 'version-id', 
        id: 'segment-id' 
      }});
      alert('Segments published successfully!');
    } catch (err: any) {
      alert(`Error publishing segments: ${err.message}`);
    }
  };

  const handleUpdateProductAndInsertSegment = async () => {
    try {
      await updateProductAndInsertSegment({ variables: { 
        productId: PRODUCT_ID, 
        name: 'Updated Product Name', 
        description: 'Updated Description', 
        segmentId: 'new-segment-id', 
        slug: 'new-segment-slug', 
        segmentName: 'New Segment Name', 
        domainId: DOMAIN_ID, 
        post: {} 
      }});
      alert('Product updated and segment inserted successfully!');
    } catch (err: any) {
      alert(`Error updating product and inserting segment: ${err.message}`);
    }
  };

  const handleAddDesignElementVersion = async () => {
    try {
      await addDesignElementVersion({ variables: { 
        designElementId: 'design-element-id', 
        versionNumber: 2, 
        elementData: {}, 
        screenshot: 'screenshot-url', 
        createdById: USER_ID, 
        organizationId: 'organization-id' 
      }});
      alert('Design element version added successfully!');
    } catch (err: any) {
      alert(`Error adding design element version: ${err.message}`);
    }
  };

  if (!post) {
    return null;
  }

  return (
    <>
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
                value={editedPost[key] ?? ""}
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
        
        {/* Example buttons for additional functionalities */}
        <div className="mt-4">
          <button onClick={handleSaveProduct} className="bg-blue-500 text-white p-2 rounded mr-2">
            Save Product
          </button>
          <button onClick={handleUpdateProductVersion} className="bg-green-500 text-white p-2 rounded mr-2">
            Update Product Version
          </button>
          <button onClick={handlePublishSegments} className="bg-yellow-500 text-white p-2 rounded mr-2">
            Publish Segments
          </button>
          <button onClick={handleUpdateProductAndInsertSegment} className="bg-purple-500 text-white p-2 rounded mr-2">
            Update Product & Insert Segment
          </button>
          <button onClick={handleAddDesignElementVersion} className="bg-red-500 text-white p-2 rounded">
            Add Design Element Version
          </button>
        </div>
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}
      {success && <p className="text-green-500">Description updated successfully!</p>}
    </>
  );
}

export default SinglePost;
