"use client"
import React, { useEffect, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_SEGMENT_SLUG, GET_MATCHED_SEGMENTS } from '@/app/(shell)/(main)/queries'; // Assuming you have these queries defined

export interface JsonObject {
    [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> { }

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    quantity: number;
    primaryPhoto: string | null;
    imageGallery: string[];
    createdAt: string | null;
    updatedAt: string | null;
    metadata: JsonValue;
    ogImage: string | null;
}

export interface Segment {
    id: string;
    slug: string | null;
    name: string;
    post: JsonValue;
    product: Product | null;
    domainId: string | null;
}

export interface UserSegmentResponse {
    id: string;
    userId: string | null;
    segmentId: string | null;
    segment: Segment | null;
}

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

  // Ensure matchedSegments exist before mapping
  const matchedSegments: UserSegmentResponse[] = dataSegments?.matchedSegments?.map((segment: { id: any; userId: any; segmentId: any; segment: { id: any; slug: any; name: any; post: string | number | boolean | JsonObject | JsonArray | null; product: { id: any; name: any; description: any; price: any; category: any; quantity: any; primaryPhoto: any; imageGallery: any; createdAt: { toString: () => any; }; updatedAt: { toString: () => any; }; metadata: string | number | boolean | JsonObject | JsonArray | null; ogImage: any; }; domainId: any; }; }) => ({
    id: segment.id,
    userId: segment.userId ?? null,
    segmentId: segment.segmentId ?? null,
    segment: segment.segment ? {
      id: segment.segment.id,
      slug: segment.segment.slug ?? null,
      name: segment.segment.name,
      post: segment.segment.post as JsonValue,
      product: segment.segment.product ? {
        id: segment.segment.product.id,
        name: segment.segment.product.name,
        description: segment.segment.product.description,
        price: segment.segment.product.price,
        category: segment.segment.product.category,
        quantity: segment.segment.product.quantity,
        primaryPhoto: segment.segment.product.primaryPhoto ?? null,
        imageGallery: segment.segment.product.imageGallery ?? [],
        createdAt: segment.segment.product.createdAt ? segment.segment.product.createdAt.toString() : null,
        updatedAt: segment.segment.product.updatedAt ? segment.segment.product.updatedAt.toString() : null,
        metadata: segment.segment.product.metadata as JsonValue,
        ogImage: segment.segment.product.ogImage ?? null,
      } : null,
      domainId: segment.segment.domainId ?? null,
    } : null,
  })) ?? [];  // Safeguard array

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
      {matchedSegments.length === 0 ? (
        <div>No segments found matching the criteria.</div>
      ) : (
        <ul>
          {matchedSegments.map((segment) => (
            <div key={segment.segment?.id || segment.id} style={{ border: '1px solid #ccc', padding: '16px', margin: '8px 0', borderRadius: '8px' }}>
              <h2>{segment.segment?.name}</h2>
              <div><strong>Segment ID:</strong> {segment.segment?.id}</div>
              <div><strong>Product Name:</strong> {segment.segment?.product?.name}</div>
              <div><strong>Description:</strong> {segment.segment?.product?.description}</div>
              <div><strong>Price:</strong> ${segment.segment?.product?.price}</div>
              <div><strong>Category:</strong> {segment.segment?.product?.category}</div>
              <div><strong>Quantity:</strong> {segment.segment?.product?.quantity}</div>
              <div>
                <strong>Images:</strong>
                <div>
                  {segment.segment?.product?.imageGallery?.map((image, index) => (
                    <img key={index} src={image} alt={`Image ${index + 1}`} style={{ width: '100px', margin: '5px' }} />
                  ))}
                </div>
              </div>
              <div><strong>Created At:</strong> {segment.segment?.product?.createdAt ? new Date(segment.segment.product.createdAt).toLocaleDateString() : 'N/A'}</div>
              <div><strong>Updated At:</strong> {segment.segment?.product?.updatedAt ? new Date(segment.segment.product.updatedAt).toLocaleDateString() : 'N/A'}</div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
