"use client"
import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_SEGMENT_SLUG, GET_MATCHED_SEGMENTS } from './queries'; // Assuming you have these queries defined

const App = () => {
  const userId = "cm14mvrxe0002ue6ygbc4yyzr"; // replace with actual user ID
  const segmentId = "unique-segment-id"; // replace with actual segment ID

  // Fetch the segment slug
  const { loading: loadingSlug, error: errorSlug, data: dataSlug } = useQuery(GET_SEGMENT_SLUG, {
    variables: { segmentId },
  });

  // Use LazyQuery for matched segments
  const [getMatchedSegments, { loading: loadingSegments, error: errorSegments, data: dataSegments }] = useLazyQuery(GET_MATCHED_SEGMENTS);

  useEffect(() => {
    if (dataSlug) {
      const slug = dataSlug.segments[0]?.slug;

      if (slug) {
        // Fetch matched segments using the slug
        getMatchedSegments({
          variables: { userId, slug: `%${slug}%` }, // Use LIKE for partial match
        });
      }
    }
  }, [dataSlug, getMatchedSegments, userId]);

  if (loadingSlug) return <div>Loading slug...</div>;
  if (errorSlug) return <div>Error fetching segment slug: {errorSlug.message}</div>;
  if (loadingSegments) return <div>Loading matched segments...</div>;
  if (errorSegments) return <div>Error fetching matched segments: {errorSegments.message}</div>;

  return (
    <div>
      <h1>Matched Segments</h1>
      {dataSegments?.user_segments?.length === 0 ? (
        <div>No segments found matching the criteria.</div>
      ) : (
        <ul>
          {dataSegments?.user_segments.map(({ segment }) => (
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

export default App;
