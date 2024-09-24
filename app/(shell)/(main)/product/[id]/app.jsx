"use client";
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN,
  UPDATE_PRODUCT_AND_INSERT_SEGMENT 
} from '@/app/(shell)/(main)/queries';
import { DELETE_SEGMENT } from './mutations'; // Adjust import path as needed
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Component to update product and insert a new segment
const UpdateProductAndInsertSegment = ({ productId }) => {
  const [updateProductAndInsertSegment, { data, loading, error }] = useMutation(UPDATE_PRODUCT_AND_INSERT_SEGMENT);
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

// New component to display when there are no segments
const NoSegmentsComponent = ({ productId }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-muted">
      <h3 className="text-lg font-semibold">No Segments Available</h3>
      <p className="text-sm">Product ID: {productId}</p>
      <UpdateProductAndInsertSegment productId={productId}/>
    </div>
  );
};

// Component for editing product segments
function ProductEditDashboard({ segment, setSegments }) {
  const [initialProduct, setInitialProduct] = useState({
    name: segment.name || '',
    description: segment.description || '',
    price: segment.price || '',
    quantity: segment.quantity || '',
    category: segment.category || ''
  });

  const [product, setProduct] = useState(initialProduct);
  const [hasChanges, setHasChanges] = useState(false); // Track if changes have been made

  // Handle input changes and track changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => {
      const updatedProduct = { ...prev, [name]: value };
      
      // Check if any changes have been made by comparing current product with the initial state
      setHasChanges(JSON.stringify(updatedProduct) !== JSON.stringify(initialProduct));
      
      return updatedProduct;
    });
  };

  const handleSave = () => {
    // Implement the save logic here (e.g., sending updated data to the server)
    alert('Product saved successfully!');
    
    // After saving, update the initialProduct state to the current product state
    setInitialProduct(product);
    setHasChanges(false); // Reset changes tracker after saving
  };

  const handleDeleteSegment = async (segmentId) => {
    const confirmation = window.confirm('Are you sure you want to delete this segment?');
    if (!confirmation) return;

    try {
      // Assume deleteSegment mutation exists, this will delete the segment
      await deleteSegment({ variables: { segmentId } });
      setSegments(prevSegments => prevSegments.filter(s => s.id !== segmentId));
    } catch (error) {
      alert('Error deleting segment. Please try again later.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{segment.name}</CardTitle>
        <CardDescription>Segment ID: {segment.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <h3 className="text-lg font-semibold">Description</h3>
          <Textarea 
            name="description" 
            value={product.description} 
            onChange={handleInputChange} 
            className="w-full"
          />
          {/* Add other input fields here if needed */}
        </div>
      </CardContent>
      {hasChanges && ( // Only show the footer with Save and other buttons if there are changes
        <CardFooter className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => handleDeleteSegment(segment.id)}
              disabled={false} // replace with loading state if necessary
            >
              Delete Segment
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="secondary">Edit Product</Button>
            <Button variant="secondary">View Analytics</Button>
            <Button variant="secondary">Share</Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

// Main component for managing segments of a product
const ProductSegmentPage = ({ params }) => {
  const PRODUCT_ID = params.id;
  const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku'; // Replace with your domain ID or fetch dynamically

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
    <div className="container mx-auto px-4 py-8">
      <div>
        {segments.length > 0 ? (
          segments.map((segment) => (
            <ProductEditDashboard 
              key={segment.id} 
              segment={segment} 
              setSegments={setSegments} 
            />
          ))
        ) : (
          <NoSegmentsComponent productId={PRODUCT_ID} />
        )}
      </div>
    </div>
  );
};

export default ProductSegmentPage;
