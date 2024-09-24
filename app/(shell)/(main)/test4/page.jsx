"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, User, ImageIcon, Upload, X, Plus, Copy } from 'lucide-react'
import Link from 'next/link';

const sampleProducts = [
  {
    id: 1,
    name: 'Wireless Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation',
    price: '99.99',
    category: 'electronics',
    inStock: true,
    image: '/placeholder.svg?height=100&width=100&text=Earbuds'
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Feature-packed smartwatch with health tracking',
    price: '199.99',
    category: 'electronics',
    inStock: true,
    image: '/placeholder.svg?height=100&width=100&text=Watch'
  },
  {
    id: 3,
    name: 'Ergonomic Chair',
    description: 'Comfortable office chair for long working hours',
    price: '299.99',
    category: 'furniture',
    inStock: false,
    image: '/placeholder.svg?height=100&width=100&text=Chair'
  },
]

export default function SimplifiedProductCreatePage() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    inStock: true,
    image: null
  })

  const [isCloned, setIsCloned] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value) => {
    setProduct(prev => ({ ...prev, category: value }))
  }

  const handleStockToggle = () => {
    setProduct(prev => ({ ...prev, inStock: !prev.inStock }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProduct(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCloneProduct = (sampleProduct) => {
    setProduct({
      ...sampleProduct,
      id: undefined // Remove the id as this is a new product
    });
    setIsCloned(true); // Mark as cloned
  }

  const handleStartFromScratch = () => {
    setProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      inStock: true,
      image: null
    });
    setIsCloned(false); // Reset clone state
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitting product:', product)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
        </Link> 
        <Button variant="outline" size="sm">
          <User className="h-4 w-4 mr-2" />
          John Doe
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-6">Create New Product</h1>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
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
            <h1 className="text-lg font-bold text-center mt-6">Product Image</h1>

            <div className="space-y-4">
              {product.image ? (
                <div className="relative">
                  <img src={product.image} alt="Product" className="w-full h-48 object-cover rounded-md" />
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="absolute top-2 right-2" 
                    onClick={() => setProduct(prev => ({ ...prev, image: null }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="w-full h-48 flex flex-col items-center justify-center bg-muted rounded-md cursor-pointer">
                  <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">Click to upload image</span>
                </label>
              )}
            </div>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="sample-gallery">
                <AccordionTrigger>Advanced Options</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {sampleProducts.map((sampleProduct) => (
                      <Card key={sampleProduct.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="relative group">
                            <img src={sampleProduct.image} alt={sampleProduct.name} className="w-full h-32 object-cover rounded-md mb-2" />
                            <h3 className="font-semibold text-sm mb-1">{sampleProduct.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{sampleProduct.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold">${sampleProduct.price}</span>
                              <Button 
                                size="sm" 
                                className="opacity-0 group-hover:opacity-100 transition-opacity" 
                                onClick={() => handleCloneProduct(sampleProduct)}
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
            <Button type="submit">
              <Upload className="h-4 w-4 mr-2" />
              Create Product
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
