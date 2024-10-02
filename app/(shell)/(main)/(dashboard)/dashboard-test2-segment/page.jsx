"use client"
import React, { useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_SEGMENT_SLUG, GET_MATCHED_SEGMENTS } from '@/app/(shell)/(main)/queries'; // Assuming you have these queries defined

const App = () => {
  const userId = "cm14mvrxe0002ue6ygbc4yyzr"; // Replace with actual user ID
  const segmentId = "unique-segment-id2"; // Replace with actual segment ID

  // Fetch the segment slug
  const { loading: loadingSlug, error: errorSlug, data: dataSlug } = useQuery(GET_SEGMENT_SLUG, {
    variables: { segmentId },
  });

  // Use LazyQuery for matched segments
  const [getMatchedSegments, { loading: loadingSegments, error: errorSegments, data: dataSegments }] = useLazyQuery(GET_MATCHED_SEGMENTS);

  useEffect(() => {
    if (dataSlug && dataSlug.Segment.length > 0) {
      const slug = dataSlug.Segment[0]?.slug; // Get the slug of the segment

      if (slug) {
        // Fetch matched segments using the slug
        getMatchedSegments({
          variables: { userId, slug: `%${slug}%` }, // Use ILIKE for partial match
        });
      }
    }
  }, [dataSlug, getMatchedSegments, userId]);

  // Handle loading and error states
  if (loadingSlug) return <div>Loading slug...</div>;
  if (errorSlug) return <div>Error fetching segment slug: {errorSlug.message}</div>;
  if (loadingSegments) return <div>Loading matched segments...</div>;
  if (errorSegments) return <div>Error fetching matched segments: {errorSegments.message}</div>;

  // Log the fetched segments data for debugging
  console.log(dataSegments);

  // Safely access UserSegment data
  const userSegments = dataSegments?.UserSegment ?? [];

  return (
    <div>
      <h1>Matched Segments</h1>
      {userSegments.length === 0 ? (
        <div>No segments found matching the criteria.</div>
      ) : (
        <ul>
          {userSegments.map((userSegment, index) => {
            const segment = userSegment.Segment;
            const product = segment?.Product;

            return (
              <li key={segment?.id || `user-segment-${index}`} style={{ border: '1px solid #ccc', padding: '16px', margin: '8px 0', borderRadius: '8px' }}>
                <h2>{segment?.name}</h2>
                <div><strong>Segment ID:</strong> {segment?.id}</div>
                <div><strong>Slug:</strong> {segment?.slug}</div>

                {/* Safely access the product details */}
                {product ? (
                  <div>
                    <div><strong>Product Name:</strong> {product.name}</div>
                    <div><strong>Description:</strong> {product.description}</div>
                    <div><strong>Price:</strong> ${product.price}</div>
                    <div><strong>Category:</strong> {product.category}</div>
                    <div><strong>Quantity:</strong> {product.quantity}</div>
                    <div>
                      <strong>Images:</strong>
                      <div>
                        {product.imageGallery?.map((image, imageIndex) => (
                          <img key={imageIndex} src={image} alt={`Image ${imageIndex + 1}`} style={{ width: '100px', margin: '5px' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div><strong>No product data available</strong></div>
                )}

                {/* Handle post if available */}
                {segment?.post && typeof segment.post === 'object' && Object.keys(segment.post).length > 0 ? (
                  <div>
                    <h3>Post Details:</h3>
                    {Object.entries(segment.post).map(([key, value]) => (
                      <p key={key}>
                        <strong>{key}:</strong> {typeof value === 'object' && value !== null ? JSON.stringify(value) : value}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div><strong>No post data available</strong></div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default App;
