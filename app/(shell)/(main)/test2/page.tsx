'use client'
import React from 'react';
import { useQuery } from '@apollo/client';
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon } from 'lucide-react';
import { GET_PRODUCT } from '@/app/(shell)/(main)/queries'; // Adjust the import path as needed

// Define the interface for product data
interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  primaryPhoto?: string;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn"; // Example product ID

export default function InventoryManagement() {
  // Fetch product data using GraphQL query
  const { data, loading, error } = useQuery<{ Product: ProductData }>(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading product data: {error.message}</div>;

  // Destructure product data
  const product = data?.Product;

  return (
    <Card className="bg-white backdrop-blur-lg border-0">
      <CardContent className="p-2">
        <div className="bg-white p-2 rounded-md space-y-1">
          {product?.primaryPhoto ? (
            <img src={product.primaryPhoto} alt="Primary" className="w-full h-24 object-cover rounded-md mb-2" />
          ) : (
            <div className="w-full h-24 bg-white/20 rounded-md flex items-center justify-center mb-2">
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          {product && (
            <>
              <div className="text-xs">
                <span className="font-semibold">Name:</span> {product.name}
              </div>
              <div className="text-xs">
                <span className="font-semibold">Description:</span> {product.description}
              </div>
              <div className="text-xs">

              </div>
              <div className="text-xs">
                <span className="font-semibold">Quantity:</span> {product.quantity}
              </div>
              <div className="text-xs">
                <span className="font-semibold">Category:</span> {product.category}
              </div>
              {product.metadata && (
                <>
                  <div className="text-xs mt-2">
                    <span className="font-semibold">Meta Title:</span> {product.metadata.title}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">Meta Description:</span> {product.metadata.description}
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">Keywords:</span> {product.metadata.keywords}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
