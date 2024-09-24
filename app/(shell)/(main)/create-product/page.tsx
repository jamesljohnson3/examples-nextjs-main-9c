"use client"
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, User, ImageIcon, Upload, X, Copy } from 'lucide-react';
import Link from 'next/link';
import api from "@/api";
import type { VehicleRecord } from '@/types/api';
import { nanoid } from 'nanoid'; // Import nanoid for unique ID generation

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";



// Define the type for your product
interface Product {
  id: string; // Add an ID property for the product
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

export default function SimplifiedProductPage() {
  const [product, setProduct] = useState<Product>({
    id: nanoid(), // Generate a unique ID for the product
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
  const [isCloned, setIsCloned] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

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
      id: nanoid(), // Generate a unique ID when cloning a vehicle
      name: vehicle.fields.Name,
      description: vehicle.fields.Notes || '',
      price: vehicle.fields["Vehicle details 1"] || '0.00',
      category: vehicle.fields["Body type"],
      inStock: true,
      images: vehicle.fields.Attachments.map(
        (attachment) => attachment.thumbnails.large.url
      ),
      fields: {
        Attachments: [] // Ensure Attachments is initialized
      }
    });
  };

  const handleCategoryChange = (value: string) => {
    setProduct(prev => ({ ...prev, category: value }));
  };

  const handleStockToggle = () => {
    setProduct(prev => ({ ...prev, inStock: !prev.inStock }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct(prev => ({ ...prev, images: [reader.result as string] }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloneProduct = (sampleProduct: Product) => {
    setProduct({
      ...sampleProduct,
      id: nanoid(), // Generate a unique ID for the new cloned product
      fields: { Attachments: [] } // Ensure Attachments is reset for new product
    });
    setIsCloned(true); // Mark as cloned
  };

  const handleStartFromScratch = () => {
    setProduct({
      id: nanoid(), // Generate a unique ID for the new product
      name: '',
      description: '',
      price: '',
      category: '',
      inStock: true,
      images: [],
      fields: {
        Attachments: [] // Initialize the fields.Attachments property
      }
    });
    setIsCloned(false); // Reset clone state
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Show loading state

    try {
      console.log('Submitting product:', product);

      // Simulate API call response
      const response = { id: "test" }; // Replace with actual API call

      if (response && response.id) {
        window.location.replace(`/product/${response.id}`); // Redirect to the product page
      } else {
        alert('Product submission failed. Please try again.'); // Handle submission error
      }

    } catch (error) {
      console.error('Error submitting product:', error);
      alert('There was an error submitting your product. Please try again.');
    } finally {
      setLoading(false); // Hide loading state after submission
    }
  };

  return (<div>
    

    <div className="p-1 flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Link href={'/'}>
            <Button variant="ghost" size="sm" className="h-6">
              <ChevronLeft className="h-3 w-3 mr-1" />
              Back to Inventory
            </Button>
          </Link>
          <div className="text-muted-foreground">Dashboard / Create Product</div>
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

  <div className="container mx-auto p-4 max-w-3xl">
      
      <div className='h-7'/>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={product.name} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={product.description} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  value={product.price} 
                  onChange={handleInputChange} 
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={product.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="inStock" 
                  checked={product.inStock} 
                  onCheckedChange={handleStockToggle}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
            </div>


            <div className="space-y-4">
              {product.images.length > 0 ? (
                <div className="relative">
                  <img src={product.images[0]} alt="Product" className="w-48 h-48 object-cover rounded-md" />
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="absolute top-2 right-2" 
                    onClick={() => setProduct(prev => ({ ...prev, images: [] }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="w-48 h-48 flex flex-col items-center justify-center bg-muted rounded-md cursor-pointer">
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload an Image</p>
                </label>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Advanced Options</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Available Vehicles</AccordionTrigger>
                <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {vehicles.map((vehicle) => (
                      <Card key={vehicle.id}
                      
                      className="overflow-hidden cursor-pointer group"
                      onClick={() => handleCloneVehicle(vehicle)} // Clone product when the card is clicked
                    >
                    <CardContent className="p-4">
                    <div className="relative">
                            <img 
                              src={vehicle.fields.Attachments[0]?.thumbnails.large.url} 
                              alt={vehicle.fields.Name} 
                              className="w-full h-32 object-cover mb-2 rounded-md"
                            />
                            <h3 className="font-semibold text-sm mb-1">{vehicle.fields.Name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{vehicle.fields.Notes}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold">{vehicle.fields["Vehicle details 1"]}</span>
                              <Button 
                                size="sm" 
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent the card's onClick from firing when the button is clicked
                                  handleCloneVehicle(vehicle);
                                }}
                              >
                                <Copy className="h-4 w-4 mr-1" />
                                Clone
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          {isCloned ? (
            <Button onClick={handleStartFromScratch}>
              <Upload className="h-4 w-4 mr-2" />
              Start from Scratch
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Create Product
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  </div>
   
  );
}
