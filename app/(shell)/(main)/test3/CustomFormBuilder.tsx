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
} from '@/app/(shell)/(main)/queries';

const USER_ID = "cm14mvrxe0002ue6ygbc4yyzr";
const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
const WORKSPACE_ID = 'cm14mvrze0008ue6y9xr15bph';
const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';

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
    variables: { designElementId: 'example-design-element-id' }
  });

  const { data: userDetailsData } = useQuery(GET_USER_DETAILS, {
    variables: { userId: USER_ID }
  });

  const { data: domainData } = useQuery(GET_DOMAIN, {
    variables: { domainId: DOMAIN_ID }
  });

  const { data: designElementVersionsData } = useQuery(GET_DESIGN_ELEMENT_VERSIONS, {
    variables: { designElementId: 'example-design-element-id' }
  });

  const { data: workspaceData } = useQuery(GET_WORKSPACE, {
    variables: { workspaceId: WORKSPACE_ID }
  });

  const { data: organizationData } = useQuery(GET_ORGANIZATION, {
    variables: { organizationId: 'example-organization-id' }
  });

  const { data: dashboardData } = useQuery(GET_DASHBOARD_DATA, {
    variables: { organizationId: 'example-organization-id', userId: USER_ID }
  });

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
        createdAt: new Date().toISOString()
      });
      setEditedPost({
        name: data.name,
        description: data.description,
        // Add other fields as needed
      });
      const contentKeys = Object.keys(editedPost);
      setPostKeys(contentKeys);
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
          price: 100, // Set appropriate values
          quantity: 10,
          category: 'Example Category'
        }
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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
    </>
  );
}

export default SinglePost;
