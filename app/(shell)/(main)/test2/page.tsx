"use client"
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Copy, User, Sparkles as SparklesIcon, Image as ImageIcon } from 'lucide-react';
import useWindowSize from "@/hooks/use-window-size";
import Link from 'next/link';
import api from "@/api";
import type { VehicleRecord } from '@/types/api';

// Define the type for your product
interface Product {
  name: string;
  description: string;
  price: string; // Changed to string to reflect the formatted price
  category: string;
  inStock: boolean;
  images: string[];
  fields: {
    Attachments: {
      thumbnails: {
        large: {
          url: string;
        };
      }[];
    }[];
  };
}

export default function EnhancedSegmentCreatePage() {
  const [product, setProduct] = useState<Product>({
    name: '',
    description: '',
    price: '', // Initialized as empty string
    category: '',
    inStock: false,
    images: [],
    fields: {
      Attachments: []
    }
  });

  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
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
      price: vehicle.fields["Vehicle details 1"] || '0.00', // Correctly maps vehicle price
      category: vehicle.fields["Body type"],
      inStock: true,
      images: vehicle.fields.Attachments.map(attachment => attachment.thumbnails.large.url),
      fields: {
        Attachments: vehicle.fields.Attachments
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting product:', product);
    // Submit the form data to your backend here
  };

  // Simulate continuous AI suggestions update
  useEffect(() => {
    const interval = setInterval(() => {
      setAiSuggestions(prev => {
        const newSuggestion = `New insight: ${Date.now()}`;
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
        <ResizablePanelGroup className="space-x-2" direction="horizontal">
          <ResizablePanel defaultSize={70}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Add an existing product</CardTitle>
                <a href='/test4'> or Create new product</a>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full space-y-2">
                  <ScrollArea className="h-72 w-full rounded-md border">
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
                                className="w-full h-24 object-cover rounded mb-2" 
                              />
                              <h3 className="font-semibold text-xs mb-1">
                                <span>{vehicle.fields.Name}</span>
                              </h3>
                              <div className="text-xs font-bold flex items-center justify-between">
                                <span>Price:</span>
                                <span>{vehicle.fields["Vehicle details 1"] || '0.00'}</span> {/* Display vehicle price */}
                                <div className="ml-auto flex items-center">
                                  <Button size="sm" className="h-6 text-[10px]" onClick={() => handleCloneVehicle(vehicle)}>
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
                          <Label htmlFor="name" className="text-xs">Product Name</Label>
                          <Input id="name" name="name" value={product.name} onChange={handleInputChange} className="h-7 text-xs" />
                        </div>
                        <Button type="submit" className="w-full h-8">Submit</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizablePanel className="hidden md:flex" defaultSize={30}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Product Preview & AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.images.length > 0 ? (
                    <a target="_blank" rel="noopener noreferrer" href={product.description}>
                      <img 
                        src={product.fields.Attachments[0]?.thumbnails.large.url} 
                        alt="Product preview" 
                        className="w-full h-40 object-cover rounded" 
                      />
                    </a>
                  ) : (
                    <div className="w-full h-40 bg-muted rounded flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-sm">{product.name || 'Product Name'}</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">{product.price || '0.00'}</span>
                  </div>

                  <div className="text-sm space-y-1">
                    <h4 className="font-semibold">AI Insights:</h4>
                    <ul>
                      {aiSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-2 text-xs">
                          <SparklesIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <a href={`/suggestion/id${Date.now() + index}`} className="text-blue-600 hover:underline">{suggestion}</a>
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
