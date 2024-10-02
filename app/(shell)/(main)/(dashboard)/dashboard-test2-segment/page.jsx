"use client"
import React, { useEffect, useState } from 'react';
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

  // Render matched segments
  return (
    <div>
      <h1>Matched Segments</h1>
      {dataSegments?.UserSegment?.length === 0 ? (
        <div>No segments found matching the criteria.</div>
      ) : (
        <ul>
          {dataSegments?.UserSegment.map(({ Segment }) => (
            <li key={Segment.id}>
              <h2>{Segment.name}</h2>
              <p>Slug: {Segment.slug}</p>
              <p>Product ID: {Segment.productId}</p>

              {/* Render post details */}
              <h3>Post Details:</h3>
              <p>Name: {Segment.post.name.value}</p>
              <p>Price: ${Segment.post.price.value}</p>
              <p>Category: {Segment.post.category.value}</p>
              <p>Quantity: {Segment.post.quantity.value || 'N/A'}</p>
              <p>Description: {Segment.post.description.value}</p>

              {/* Render additional post fields */}
              {Object.entries(Segment.post).map(([key, field]) => {
                if (field.type && field.label && key !== 'name' && key !== 'price' && key !== 'category' && key !== 'quantity' && key !== 'description') {
                  return (
                    <p key={key}>
                      {field.label}: {field.value}
                    </p>
                  );
                }
                return null;
              })}

              {/* Render Product details */}
              {Segment.Product && (
                <div>
                  <h3>Product Details:</h3>
                  <p>Product Name: {Segment.Product.name}</p>
                  <p>Description: {Segment.Product.description}</p>

                  {Segment.Product.imageGallery && Segment.Product.imageGallery.length > 0 && (
                    <div>
                      <h4>Image Gallery:</h4>
                      <ul>
                        {Segment.Product.imageGallery.map((image, index) => (
                          <li key={index}>
                            <img src={image} alt={`Product Image ${index + 1}`} style={{ width: '100px', height: 'auto' }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Segment.Product.primaryPhoto && (
                    <div>
                      <h4>Primary Photo:</h4>
                      <img src={Segment.Product.primaryPhoto} alt="Primary Product" style={{ width: '200px', height: 'auto' }} />
                    </div>
                  )}
                  {Segment.Product.ogImage && (
                    <div>
                      <h4>Open Graph Image:</h4>
                      <img src={Segment.Product.ogImage} alt="Open Graph" style={{ width: '200px', height: 'auto' }} />
                    </div>
                  )}
                  {Segment.Product.metadata && (
                    <div>
                      <h4>Metadata:</h4>
                      <pre>{JSON.stringify(Segment.Product.metadata, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
