"use client";

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_PRODUCT_AND_INSERT_SEGMENT } from '@/app/(shell)/(main)/queries';

const UpdateProductAndInsertSegment = () => {
  const [updateProductAndInsertSegment, { data, loading, error }] = useMutation(UPDATE_PRODUCT_AND_INSERT_SEGMENT);
  const [productId, setProductId] = useState('cm14mvs2o000fue6yh6hb13yn');
  const [name, setName] = useState('Updated Product Name');
  const [description, setDescription] = useState('Updated description');
  const [segmentId, setSegmentId] = useState('unique-segment-id');
  const [slug, setSlug] = useState('new-segment-slug');
  const [segmentName, setSegmentName] = useState('New Segment Name');
  const [domainId, setDomainId] = useState('cm14mvs4l000jue6y5eo3ngku');
  const [post, setPost] = useState('{"key": "value"}');

  const handleUpdate = async () => {
    try {
      const { data } = await updateProductAndInsertSegment({
        variables: {
          productId,
          name,
          description,
          segmentId,
          slug,
          segmentName,
          domainId,
          post,
        },
      });
      console.log('Mutation result:', data);
    } catch (error) {
      console.error('Error executing mutation:', error);
    }
  };

  return (
    <div>
      <h1>Update Product and Insert Segment</h1>
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Updating...' : 'Update Product and Insert Segment'}
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          <p>Update Result: {data.update_Product.affected_rows} rows affected</p>
          <p>Inserted Segment ID: {data.insert_Segment_one.id}</p>
        </div>
      )}
    </div>
  );
};

export default UpdateProductAndInsertSegment;
