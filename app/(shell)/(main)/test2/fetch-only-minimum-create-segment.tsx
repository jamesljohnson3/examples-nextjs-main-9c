

"use client"


"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Copy, User, Sparkles as SparklesIcon, Image as ImageIcon } from 'lucide-react';
import useWindowSize from "@/hooks/use-window-size";
import Link from 'next/link';
import api from "@/api";
import type { VehicleRecord } from '@/types/api';
import { Badge } from "@/components/ui/badge";



// Define the type for your product
interface Product {
  name: string;
  description: string;
  price: string;
  category: string;
  inStock: boolean;
  images: string[];
  fields: {
    Attachments: Attachment[];
  };
}

interface Attachment {
  thumbnails: {
    large: {
      url: string;
    };
  };
}

export default function EnhancedSegmentCreatePage() {
  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    price: '',
    category: '',
    inStock: false,
    images: [],
    fields: {
      Attachments: []
    }
  });

  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { isMobile, isDesktop } = useWindowSize();

  // Fetch vehicles from the API
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const vehicleData = await api.list();
        setVehicles(vehicleData);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleCloneVehicle = (vehicle: VehicleRecord) => {
    setProduct({
      name: vehicle.fields.Name,
      description: vehicle.fields.Notes || '',
      price: vehicle.fields["Vehicle details 1"] || '0.00',
      category: vehicle.fields["Body type"],
      inStock: true,
      images: vehicle.fields.Attachments.map(
        (attachment) => attachment.thumbnails.large.url
      ),
      fields: {
        Attachments: vehicle.fields.Attachments
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation for product name and price
    if (!product.name || !product.price) {
      alert('Please fill in all required fields.');
      return;
    }
    if (isNaN(parseFloat(product.price))) {
      alert('Please enter a valid price.');
      return;
    }

    setLoading(true); // Show loading state
    try {
      console.log('Submitting product:', product);
      // Submit the form data to your backend here
      const response = {"id":"test"}

      // Check if the response is successful
      if (response && response.id) {
        // Use window.location.replace to redirect to the product ID page
        window.location.replace(`/product/${response.id}`); // Redirect to the product page
      } else {
        alert('Product submission failed. Please try again.'); // Handle submission error
      }
      
      // Optionally clear the input fields after submission
      setProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        inStock: false,
        images: [],
        fields: {
          Attachments: []
        }
      });
    } catch (error) {
      console.error('Error submitting product:', error);
      alert('There was an error submitting your product. Please try again.'); // User feedback
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  return (
    <div className="container mx-auto p-2 space-y-2 text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Link href={'/'}>
            <Button variant="ghost" size="sm" className="h-6">
              <ChevronLeft className="h-3 w-3 mr-1" />
              Back to Inventory
            </Button>
          </Link>
          <div className="text-muted-foreground">Dashboard / Create Segment</div>
        </div>
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

      <form onSubmit={handleSubmit}>
      {loading && <div className="loading-spinner">Submitting...</div>}
        <ResizablePanelGroup className="flex pl-8 items-center justify-center mx-auto space-x-2" direction="horizontal">
          <ResizablePanel defaultSize={70}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Add an existing product</CardTitle>
                <a href='/test4'> or Create new product</a>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full space-y-2">
                  <ScrollArea className="bg-slate-50 h-96 w-full rounded-md ">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <span>Loading vehicles...</span>
                      </div>
                    ) : (
                      <div className="p-4 grid grid-cols-2 gap-4">
                        {vehicles.map((vehicle) => (
                          <Card key={vehicle.id} className="overflow-hidden">
                            <CardContent className="p-2">
                              <img 
                                src={vehicle.fields.Attachments[0]?.thumbnails.large.url} 
                                alt={vehicle.fields.Name} 
                                className="w-full h-48 object-cover rounded mb-2" />
                              <h3 className="font-semibold text-xs mb-1">
                                <span>{vehicle.fields.Name}</span>
                              </h3>
                              <div className="text-xs font-bold flex items-center justify-between">
                                <span>Price:</span> 
                                <span>{vehicle.fields["Vehicle details 1"] || 0}</span>
                                <div className="ml-auto">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-xs h-6" 
                                    onClick={() => handleCloneVehicle(vehicle)}>
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </Accordion>
              </CardContent>
            </Card>
          </ResizablePanel>
          <ResizablePanel defaultSize={30}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Create Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-1">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={product.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={product.description}
                      onChange={handleInputChange}
                      placeholder="Enter product description"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={product.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={product.category}
                      onChange={handleInputChange}
                      placeholder="Enter category"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="inStock">In Stock</Label>
                    <Switch
                      id="inStock"
                      checked={product.inStock}
                      onCheckedChange={(checked) => setProduct({ ...product, inStock: checked })}
                    />
                  </div>
                  <div className="mt-4">
                    <Button type="submit" className="w-full">
                      Submit Product
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </form>
    </div>
  );
}