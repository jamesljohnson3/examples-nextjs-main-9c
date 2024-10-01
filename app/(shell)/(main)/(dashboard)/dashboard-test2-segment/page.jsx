"use client"
import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_SEGMENT_SLUG, GET_MATCHED_SEGMENTS } from '@/app/(shell)/(main)/queries'; // Assuming you have these queries defined


const App = () => {
    const userId = "cm14mvrxe0002ue6ygbc4yyzr"; // Replace with actual user ID
    const segmentId = "unique-segment-id"; // Replace with actual segment ID
  
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
                <p>Post: {Segment.post}</p> {/* Include post information */}
                <p>Product ID: {Segment.productId}</p> {/* Include product ID */}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default App;