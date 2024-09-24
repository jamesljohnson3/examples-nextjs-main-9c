"use client";
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN 
} from '@/app/(shell)/(main)/queries';
import { DELETE_SEGMENT } from './mutations';  // Adjust import path as needed
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, BarChart, Bell, ChevronLeft, Edit, Eye, ImageIcon, LayoutDashboard, LogOut, Plus, RefreshCw, Search, Settings, Share2, ShoppingCart, Sparkles, Star, User, Zap } from 'lucide-react'
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

// New component to display when there are no segments
const NoSegmentsComponent = ({ productId }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-muted">
      <h3 className="text-lg font-semibold">No Segments Available</h3>
      <p className="text-sm">Product ID: {productId}</p>
      <UpdateProductAndInsertSegment/>
    </div>
  );
};

// Ensure ProductEditDashboard accepts and uses the segment prop
function ProductEditDashboard({ segment, setSegments }) {
  const [product, setProduct] = useState({
    name: segment.name || '',
    description: segment.description || '',
    price: segment.price || '',
    quantity: segment.quantity || '',
    category: segment.category || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const [deleteSegment, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_SEGMENT, {
    onCompleted: () => {
      alert('Segment deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting segment:', error);
      alert('Error deleting segment.');
    }
  });

  const handleDeleteSegment = async (segmentId) => {
    const confirmation = window.confirm('Are you sure you want to delete this segment?');
    if (!confirmation) return;

    try {
      await deleteSegment({ variables: { segmentId } });
      // Optionally update the local state to remove the deleted segment
      setSegments(prevSegments => prevSegments.filter(s => s.id !== segmentId));
    } catch (error) {
      console.error('Error executing delete mutation:', error);
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => handleDeleteSegment(segment.id)}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Segment'}
          </Button>
          <Button variant="primary">
            Save
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary">
            Edit Product
          </Button>
          <Button variant="secondary">
            View Analytics
          </Button>
          <Button variant="secondary">
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

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
