"use client"
import React, { useEffect, useState } from "react";

function SinglePost({ id }: { id: string }) {
  const [post, setPost] = useState<any>(null);
  const [editedPost, setEditedPost] = useState<any>({});
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [postKeys, setPostKeys] = useState<string[]>([]);

  // Static post data
  const staticPostData = {
    id: "sample-post-id",
    author: "sample-user-id",
    content: JSON.stringify([{
      price: "test",
      model: "test",
      Make: "Nissan",
      meta: "Vehicle for sale",
      Year: "2012",
      Price: "test",
      Description: "test",
      Mileage: "test",
      Transmission: "Auto",
      Passenger: "2 Door",
      Fuel: "test",
      Type: "Truck"
    }]),
    createdAt: new Date().toISOString()
  };

  useEffect(() => {
    // Simulate fetching post data with static data
    const data = staticPostData;
    if (!data) {
      // Handle not found logic here
    } else {
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
    setEditedPost({ ...editedPost, [name]: value });
  };

  const handleSubmit = async () => {
    const eventtype = 'update';
    try {
      const response = await fetch('https://unlimitpotntlj.dataplane.rudderstack.com/v1/webhook?writeKey=2a0rvNg3rm1cTepcofpRSJhKjxf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...editedPost, userId: post.author, assetId: 'sample-asset-id', eventtype, campaignId: 'sample-campaign-id', postId: post.id }), // Include assetId and userId in the body
      });
      if (response.ok) {
        setSuccess(true); // Set success state to true
      } else {
        throw new Error('Failed to update description');
      }
    } catch (err: any) {
      setError(err.message);
      setSuccess(false); // Set success state to false
      console.error("Error sending data to webhook:", err);
    }
  };

  if (!post) {
    return null;
  }

  return (
    <>
      {/* Your image display code */}
      
      <div className="flex max-w-sm flex-col flex-1">
        <div className="px-5 py-3">
          {/* Render input fields based on postKeys */}
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
