"use client"
import React, { useEffect, useState } from 'react';
import {  useQuery } from '@apollo/client';




// Main component
const App = () => {
  const userId = "cm14mvrxe0002ue6ygbc4yyzr"; // replace with actual user ID
  const segmentId = "unique-segment-id"; // replace with actual segment ID

  // Fetch the segment slug
  const { loading: loadingSlug, error: errorSlug, data: dataSlug } = useQuery(GET_SEGMENT_SLUG, {
    variables: { segmentId },
  });

  const [matchedSegments, setMatchedSegments] = useState([]);

  useEffect(() => {
    if (!loadingSlug && dataSlug) {
      const slug = dataSlug.segments[0]?.slug;

      // Fetch matched segments using the slug
      const { loading: loadingSegments, error: errorSegments, data: dataSegments } = useQuery(GET_MATCHED_SEGMENTS, {
        variables: { userId, slug: `%${slug}%` }, // Using LIKE to match slug
      });

      if (!loadingSegments && dataSegments) {
        setMatchedSegments(dataSegments.user_segments);
      }
    }
  }, [loadingSlug, dataSlug, userId]);

  if (loadingSlug) return <div>Loading...</div>;
  if (errorSlug) return <div>Error fetching segment slug: {errorSlug.message}</div>;

  return (
    <div>
      <h1>Matched Segments</h1>
      {matchedSegments.length === 0 ? (
        <div>No segments found matching the criteria.</div>
      ) : (
        <ul>
          {matchedSegments.map(({ segment }) => (
            <li key={segment.id}>
              <h2>{segment.name}</h2>
              <p>Slug: {segment.slug}</p>
              <p>Product: {segment.product?.name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App