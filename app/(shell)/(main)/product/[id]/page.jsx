"use client";

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN } from '@/app/(shell)/(main)/queries';

const ProductSegmentPage = ({ params }) => {
  const PRODUCT_ID = params.id;
  const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku'; // Replace with your domain ID or fetch dynamically

  // Fetch segments by productId and domainId
  const { data, loading, error } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID },
  });

  const [segments, setSegments] = useState([]);

  useEffect(() => {
    if (data) {
      setSegments(data.Segment || []);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading segments: {error.message}</p>;

  return (
    <div>
      <h1>Segments for Product ID: {PRODUCT_ID}</h1>
      <div>
        {segments.length > 0 ? (
          segments.map((segment) => (
            <div key={segment.id}>
              <h2>{segment.name}</h2>
              <p>Slug: {segment.slug || 'No slug available'}</p>
              <p>Post: {segment.post ? JSON.stringify(segment.post) : 'No post available'}</p>
            </div>
          ))
        ) : (
          <p>No segments available for this product and domain.</p>
        )}
      </div>
    </div>
  );
};

export default ProductSegmentPage;
