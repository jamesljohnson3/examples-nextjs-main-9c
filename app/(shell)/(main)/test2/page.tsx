

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
import { ChevronLeft, Copy, Zap, User, Sparkles as SparklesIcon, Image as ImageIcon } from 'lucide-react';
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
    Attachments: {
      thumbnails: {
        large: {
          url: string;
        };
      };
    }[];
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
  const [aiSuggestions, setAiSuggestions] = useState<{ id: string; text: string }[]>([]);
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

  const handleCategoryChange = (value: string) => {
    setProduct(prev => ({ ...prev, category: value }));
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
    if (!product.name) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true); // Show loading state
    try {
      console.log('Submitting product:', product);
      const response = {"id":"test"}

      if (response && response.id) {
        window.location.replace(`/product/${response.id}`); // Redirect to the product page
      } else {
        alert('Product submission failed. Please try again.'); // Handle submission error
      }

      // Clear the input fields after submission
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
      setLoading(false); // Hide loading state after submission
    }
  };


  // Simulate continuous AI suggestions update
  useEffect(() => {
    const interval = setInterval(() => {
      setAiSuggestions(prev => {
        const newId = Date.now().toString();
        const newSuggestion = { id: newId, text: `New insight: ${newId}` };
        return [...prev.slice(1), newSuggestion];
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
                      <div className="p-4 grid grid-cols-3 gap-4">
                        {vehicles.map((vehicle) => (
                          <Card key={vehicle.id} className="overflow-hidden">
                            <CardContent className="p-2">
                              <img 
                                src={vehicle.fields.Attachments[0]?.thumbnails.large.url} 
                                alt={vehicle.fields.Name} 
                                className="w-full h-36 object-cover rounded mb-2" />
                              <h3 className="font-semibold text-xs mb-1">
                                <span>{vehicle.fields.Name}</span>
                              </h3>
                              <div className="text-xs font-bold flex items-center justify-between">
                                <span>Price:</span> 
                                <span>{vehicle.fields["Vehicle details 1"] || 0}</span>
                                <div className="ml-auto flex items-center">
                                  <Button   type="button" size="sm" className="h-6 text-[10px]" onClick={() => handleCloneVehicle(vehicle)}>
                                    <Copy className="h-3 w-3 mr-1" />
                                    Clone
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  <AccordionItem value="basic-info">
                    <AccordionTrigger className="text-xs font-semibold">Basic Information</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="productName" className="text-xs">Product Name</Label>
                          <Input
                            disabled
                            id="productName"
                            name="productName"
                            value={product.name}
                            onChange={handleInputChange}
                            className="h-7 text-xs"
                          />
                        </div>

                        <div>
                          <Label htmlFor="segmentName" className="text-xs">Segment Name</Label>
                          <Input
                            disabled
                            id="segmentName"
                            name="segmentName"
                            value={product.category}
                            onChange={handleInputChange}
                            className="h-7 text-xs"
                          />
                        </div>

                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <Button type="submit" className="w-full h-8">Submit</Button>

            </Card>


          </ResizablePanel>

          <ResizablePanel className="hidden md:flex" defaultSize={30}>
            <Card>
              <CardHeader>
              <CardTitle className="text-sm">Segment Preview & AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.images.length > 0 ? (
                    <a target="_blank" rel="noopener noreferrer" href={`${product.description}`}>
                      <img
                        src={product.fields.Attachments[0]?.thumbnails.large.url}
                        alt="Product preview"
                        className="w-full h-40 object-cover rounded"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center">
                      <span>No images available</span>
                    </div>
                  )}
                <div>
                    <h3 className="font-semibold text-sm">{product.name || 'Product Name'}</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{product.price || '0.00'}</span>
                    <Badge>{product.category || 'Category'}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-xs">AI Suggestions</h4>
                    <ul className="space-y-1">
                      {aiSuggestions.map(({ id, text }) => (
                        <li key={id} className="flex items-start space-x-2 text-xs">
                          <SparklesIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <a href={`/suggestion/${id}`} className="text-blue-500 hover:underline">
                            {text}
                          </a>
                        </li>
                      ))}
                    </ul>
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
