
"use client"
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Search, User } from 'lucide-react';
import api from "@/api";
import type { VehicleRecord } from '@/types/api';

export default function ProductListHomepage() {
  const [products, setProducts] = useState<VehicleRecord[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<VehicleRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch the vehicle records (products)
  useEffect(() => {
    async function fetchProducts() {
      try {
        const vehicles = await api.list();
        setProducts(vehicles);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  const handleProductSelect = (product: VehicleRecord) => {
    setSelectedProduct(product);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));
      setSelectedProduct(null); // Deselect the product after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products.filter(product => 
    product.fields.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-2 space-y-2 text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-6">
            <ChevronLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
          <div className="text-muted-foreground">
            Dashboard / Product List
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <User className="h-4 w-4 mr-1" />
                User
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john@example.com</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <Card className="mb-2">
        <CardContent className="p-2">
          <div className="flex space-x-2 mb-2">
            <Input 
              placeholder="Type a command or search..." 
              className="flex-grow h-8 text-xs" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" size="sm" className="h-8">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={80}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Product List</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredProducts.map((product) => (
                  <AccordionItem key={product.id} value={product.id}>
                    <AccordionTrigger onClick={() => handleProductSelect(product)} className="text-xs">
                      <div className="flex items-center space-x-2">
                        <img src={product.fields.Image} alt={product.fields.Name} className="w-8 h-8 object-cover rounded" />
                        <span>{product.fields.Name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-2 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{product.fields.Name}</h3>
                            <p className="text-xs text-muted-foreground">{product.fields.Description}</p>
                          </div>
                          <Badge>{product.fields.Category}</Badge>
                        </div>
                        <div className="flex justify-between items-center">

                          <Button size="sm" onClick={() => handleDeleteProduct(product.id)}>Delete Product</Button>
                        </div>
                        {selectedProduct && selectedProduct.id === product.id && (
                          <Card className="mt-2">
                            <CardContent className="p-2">
                              <h2 className="font-semibold mb-1">Live Product Preview</h2>
                              <div className="bg-muted p-2 rounded space-y-1">
                                <img src={selectedProduct.fields.Image} alt={selectedProduct.fields.Name} className="w-full h-24 object-cover rounded mb-2" />
                                <div className="text-xs">
                                  <span className="font-semibold">ID:</span> {selectedProduct.id}
                                </div>
                                <div className="text-xs">
                                  <span className="font-semibold">Name:</span> {selectedProduct.fields.Name}
                                </div>
                                <div className="text-xs">
                                  <span className="font-semibold">Description:</span> {selectedProduct.fields.Description}
                                </div>
                                <div className="text-xs">

                                </div>
                                <div className="text-xs">
                                  <span className="font-semibold">Category:</span> {selectedProduct.fields.Category}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                        <a href={`/product/edit/${product.id}`}>
                          <Button size="sm">Edit Product</Button>
                        </a>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizablePanel defaultSize={20}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs">Total Products:</span>
                  <span className="font-bold">{filteredProducts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Categories:</span>
                  <span className="font-bold">{new Set(filteredProducts.map(p => p.fields.Category)).size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Avg. Price:</span>
                  <span className="font-bold">
                    ${(filteredProducts.reduce((sum, p) => sum + p.fields.Price, 0) / filteredProducts.length).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
