"use client"
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, User, ImageIcon, Upload, X, Plus, Copy, Zap, RefreshCw, SparklesIcon, Settings2Icon, BrainCircuitIcon } from 'lucide-react'
import useWindowSize from "@/hooks/use-window-size";

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

export default function EnhancedProductCreatePage() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    inStock: true,
    images: []
  })
  
  const [aiSuggestions, setAiSuggestions] = useState([])
  const { isMobile, isDesktop } = useWindowSize();

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
        setProduct(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleCloneProduct = (sampleProduct) => {
    setProduct({
      ...sampleProduct,
      id: undefined,
      images: [sampleProduct.image]
    })
  }

  

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitting product:', product)
    // Here you would typically send the data to your backend
  }

  useEffect(() => {
    // Simulate AI continuously analyzing and updating suggestions
    const interval = setInterval(() => {
      setAiSuggestions(prev => {
        const newSuggestion = `New insight: ${Date.now()}`
        return [...prev.slice(1), newSuggestion]
      })
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto p-2 space-y-2 text-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-6">
            <ChevronLeft className="h-3 w-3 mr-1" />
            Back to Products
          </Button>
          <div className="text-muted-foreground">
            Dashboard / Create Product
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
      
      <h1 className="text-lg font-bold text-center mb-2">Create New Product</h1>
      
      <form onSubmit={handleSubmit}>
      <ResizablePanelGroup className='space-x-2' direction={isMobile ? "vertical" : "horizontal"}>
      <ResizablePanel defaultSize={60}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full space-y-2">
                <ScrollArea className="h-72 w-full rounded-md border">
                        <div className="p-4 grid grid-cols-2 gap-4">
                          {sampleProducts.map((sampleProduct) => (
                            <Card key={sampleProduct.id} className="overflow-hidden">
                              <CardContent className="p-2">
                                <img src={sampleProduct.image} alt={sampleProduct.name} className="w-full h-24 object-cover rounded mb-2" />
                                <h3 className="font-semibold text-xs mb-1">{sampleProduct.name}</h3>
                                <p className="text-[10px] text-muted-foreground mb-2">{sampleProduct.description}</p>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-bold">${sampleProduct.price}</span>
                                  <Button size="sm" className="h-6 text-[10px]" onClick={() => handleCloneProduct(sampleProduct)}>
                                    <Copy className="h-3 w-3 mr-1" />
                                    Clone
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>

                  <AccordionItem value="basic-info">
                    <AccordionTrigger className="text-xs font-semibold">Basic Information</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="name" className="text-xs">Product Name</Label>
                          <Input 
                            id="name" 
                            name="name" 
                            value={product.name} 
                            onChange={handleInputChange} 
                            className="h-7 text-xs"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-xs">Description</Label>
                          <Textarea 
                            id="description" 
                            name="description" 
                            value={product.description} 
                            onChange={handleInputChange} 
                            className="h-20 text-xs"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price" className="text-xs">Price</Label>
                          <Input 
                            id="price" 
                            name="price" 
                            type="number" 
                            value={product.price} 
                            onChange={handleInputChange} 
                            className="h-7 text-xs"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category" className="text-xs">Category</Label>
                          <Select value={product.category} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="h-7 text-xs">
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
                          <Label htmlFor="inStock" className="text-xs">In Stock</Label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="images">
                    <AccordionTrigger className="text-xs font-semibold">Product Images</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {product.images.map((img, index) => (
                            <div key={index} className="relative">
                              <img src={img} alt={`Product ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="absolute top-0 right-0 h-4 w-4 p-0" 
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-2 w-2" />
                              </Button>
                            </div>
                          ))}
                          <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                            <Plus className="h-6 w-6 text-muted-foreground" />
                          </label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  
                  

                </Accordion>
              </CardContent>
            </Card>
          </ResizablePanel>
          <ResizablePanel className="hidden md:flex" defaultSize={40}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Product Preview & AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.images.length > 0 ? (
                    <img src={product.images[0]} alt="Product preview" className="w-full h-40 object-cover rounded" />
                  ) : (
                    <div className="w-full h-40 bg-muted rounded flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-sm">{product.name || 'Product Name'}</h3>
                    <p className="text-xs text-muted-foreground">{product.description || 'Product description will appear here'}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">${product.price || '0.00'}</span>
                    <Badge>{product.category || 'Category'}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-xs">AI Suggestions</h4>
                    <ul className="space-y-1">
                      {aiSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-2 text-xs">
                          <SparklesIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
        <div className="mt-4 flex justify-end">
          <Button type="submit" size="sm" className="h-7 text-xs">
            <Upload className="h-3 w-3 mr-1" />
            Create Product
          </Button>
        </div>
      </form>
    </div>
  )
}