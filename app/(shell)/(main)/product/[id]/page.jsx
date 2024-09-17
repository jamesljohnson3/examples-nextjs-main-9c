"use client";
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { 
  GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN 
} from '@/app/(shell)/(main)/queries';
import { DELETE_SEGMENT } from './mutations';  // Adjust import path as needed

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Save, Settings2 } from 'lucide-react';

// Ensure ProductEditDashboard accepts and uses the segment prop
function ProductEditDashboard({ segment }) {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: ''
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
    try {
      await deleteSegment({ variables: { segmentId } });
    } catch (error) {
      console.error('Error executing delete mutation:', error);
    }
  };

  if (deleteLoading) return <p>Deleting...</p>;
  if (deleteError) return <p>Error deleting segment.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-500">Products / Electronics / {segment.id}</div>
            <h1 className="text-2xl font-bold text-gray-900">{segment.name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">Version v2.1.3</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-grow">
            <Tabs defaultValue="form-builder">
              <TabsList>
                <TabsTrigger value="form-builder">Form Builder</TabsTrigger>
                <TabsTrigger value="refine-ai">Refine with AI</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="form-builder" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Edit your product information below.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <Input id="name" name="name" value={product.name} onChange={handleInputChange} />
                      </div>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <Textarea id="description" name="description" value={product.description} onChange={handleInputChange} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                          <Input id="price" name="price" type="number" value={product.price} onChange={handleInputChange} />
                        </div>
                        <div>
                          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                          <Input id="quantity" name="quantity" type="number" value={product.quantity} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <Input id="category" name="category" value={product.category} onChange={handleInputChange} />
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Primary Photo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <img src="/placeholder.svg?height=200&width=200" alt="Product" className="mx-auto mb-4" />
                      <Button>Set as primary product image</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="w-80">
            <Card>
              <CardHeader>
                <CardTitle>Unsaved Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Updated product name</li>
                  <li>Modified description</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Version History</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>v2 - 9/15/2024, 10:22:50 PM: Updated product description</li>
                  <li>v1 - 9/16/2024, 10:22:50 PM: Initial version</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Button variant="outline"><ChevronLeft className="mr-2 h-4 w-4" /> Go Back</Button>
          <div>
            <Button variant="outline" className="mr-2"><Settings2 className="mr-2 h-4 w-4" /> Advanced Options</Button>
            <Button><Save className="mr-2 h-4 w-4" /> Save</Button>
            <div key={segment.id}>
            <h3>{segment.name}</h3>
            <button onClick={() => handleDeleteSegment(segment.id)}>Delete Segment</button>
          </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const ProductSegmentPage = ({params}) => {
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
      <div>
        {segments.length > 0 ? (
          segments.map((segment) => (
            <ProductEditDashboard key={segment.id} segment={segment} />
          ))
        ) : (
          <p>No segments available for this product and domain. create asegmett bubttoon or form orrsskipfor now buutton seet cookie to false for show crreatte segments?</p>
         
        )}
      </div>
    </div>
  );
};

export default ProductSegmentPage;

