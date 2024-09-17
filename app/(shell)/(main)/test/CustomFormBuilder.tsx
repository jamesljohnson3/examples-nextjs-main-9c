"use client"
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import React, { useEffect, useState } from "react";
import { 
  GET_PRODUCT, 
  GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN,
  GET_PRODUCT_VERSIONS, 
  GET_DESIGN_CONCEPTS, 
  GET_AI_SUGGESTIONS, 
  GET_DESIGN_ELEMENTS, 
  GET_MEDIA_FILES, 
  GET_USER_DETAILS,
  GET_DOMAIN ,
  GET_DESIGN_ELEMENT_VERSIONS,
  GET_WORKSPACE,
  GET_ORGANIZATION
} from '@/app/(shell)/(main)/queries';

const USER_ID = "cm14mvrxe0002ue6ygbc4yyzr";

const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
const WORKSPACE_ID = 'cm14mvrze0008ue6y9xr15bph'; // Define your workspace ID here
const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku'; // Define your domain ID here


// Define a type for the post
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

  // Static post data
  const CustomFieldData: Post = {
    id: "sample-tableName-id",
    content: JSON.stringify([{
      model: "test",
      Make: "Nissan",
      CalltoAction: "Vehicle for sale",
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

  useEffect(() => {
    // Simulate fetching post data with static data
    const data = CustomFieldData;
    if (data) {
      setPost(data);
      const parsedContent = JSON.parse(data.content);
      if (Array.isArray(parsedContent) && parsedContent.length > 0) {
        setEditedPost(parsedContent[0]); // Initialize editedPost with the first object of post.content
        const contentKeys = Object.keys(parsedContent[0]);
        setPostKeys(contentKeys); // Extracting keys from the fetched post data
      }
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const eventType = 'update';
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
          postId: post?.id // Use optional chaining in case post is null
        }),
      });
      if (response.ok) {
        setSuccess(true);
      } else {
        throw new Error('Failed to update description');
      }
    } catch (err: any) {
      setError(err.message);
      setSuccess(false);
      console.error("Error sending data to webhook:", err);
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
            className="hover:bg-gray-900 justify-center items-center mt-4"
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
            Save
          </button>
          <time className="text-[11px] uppercase text-zinc-500 font-medium">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </div>

      {error && <p>Error: {error}</p>}
      {success && <p>Description updated successfully!</p>}
    </>
  );
}

export default SinglePost;