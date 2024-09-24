'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, BarChart, Bell, ChevronLeft, Code, Edit, Eye, Globe, History, ImageIcon, LayoutDashboard, LogOut, Plus, RefreshCw, Search, Settings, Share2, ShoppingCart, Sparkles, Star, Tag, Truck, User, Zap, Languages, MessageSquare, GitCompare } from 'lucide-react'

const product = {
  id: 'PROD-001',
  name: 'Ergonomic Office Chair',
  description: 'Experience ultimate comfort with our ergonomic office chair, designed for long hours of work. Features adjustable lumbar support, breathable mesh back, and customizable armrests.',
  price: 299.99,
  rating: 4.5,
  reviews: 128,
  stock: 50,
  category: 'Office Furniture',
  tags: ['ergonomic', 'office', 'chair'],
  images: [
    '/placeholder.svg?height=400&width=400&text=Chair+Front',
    '/placeholder.svg?height=400&width=400&text=Chair+Side',
    '/placeholder.svg?height=400&width=400&text=Chair+Back',
    '/placeholder.svg?height=400&width=400&text=Chair+Details',
  ],
  variants: [
    { id: 'VAR-001', name: 'Black', sku: 'EC-001-BLK', stock: 30, color: '#000000' },
    { id: 'VAR-002', name: 'Gray', sku: 'EC-001-GRY', stock: 20, color: '#808080' },
    { id: 'VAR-003', name: 'Blue', sku: 'EC-001-BLU', stock: 15, color: '#0000FF' },
  ],
  seo: {
    title: 'Ergonomic Office Chair for Ultimate Comfort',
    description: 'Boost productivity with our ergonomic office chair. Adjustable support for long work hours. Free shipping on orders over $500.',
    keywords: 'ergonomic chair, office furniture, lumbar support, mesh chair',
  },
}

const relatedProducts = [
  { id: 1, name: 'Adjustable Desk', price: 499.99, image: '/placeholder.svg?height=200&width=200&text=Desk' },
  { id: 2, name: 'Ergonomic Keyboard', price: 129.99, image: '/placeholder.svg?height=200&width=200&text=Keyboard' },
  { id: 3, name: 'LED Desk Lamp', price: 79.99, image: '/placeholder.svg?height=200&width=200&text=Lamp' },
  { id: 4, name: 'Footrest', price: 39.99, image: '/placeholder.svg?height=200&width=200&text=Footrest' },
]

export default function StreamlinedProductPage() {
  const [selectedImage, setSelectedImage] = useState(product.images[0])
  const [aiDescription, setAiDescription] = useState('')
  const [pricingStrategy, setPricingStrategy] = useState(product.price)

  const generateAIDescription = () => {
    const descriptions = [
      "Elevate your workspace with our cutting-edge ergonomic office chair. Designed to provide unparalleled comfort during long work hours, this chair features state-of-the-art adjustable lumbar support, a breathable mesh back for optimal ventilation, and fully customizable armrests. Perfect for professionals who demand the best in ergonomic design.",
      "Introducing the ultimate solution for workplace comfort - our premium ergonomic office chair. Engineered with advanced support technologies, including precision-tuned lumbar adjustment and a responsive mesh back, this chair adapts to your body's needs. Ideal for those who prioritize both style and functionality in their office environment.",
      "Transform your office experience with our innovative ergonomic chair. Crafted for the modern professional, this chair combines sleek aesthetics with ergonomic excellence. Featuring a range of adjustable elements and a breathable design, it's the perfect companion for productive, comfortable workdays."
    ]
    setAiDescription(descriptions[Math.floor(Math.random() * descriptions.length)])
  }

  const simulatePricingStrategy = (strategy) => {
    const strategies = {
      'cost-plus': product.price * 1.2,
      'value-based': product.price * 1.5,
      'competitive': product.price * 0.9,
      'skimming': product.price * 2,
      'penetration': product.price * 0.7
    }
    setPricingStrategy(strategies[strategy])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center space-x-3">
            <Input 
              type="search" 
              placeholder="Search..." 
              className="w-48 h-8 text-xs"
            />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="end">
                <Command>
                  <CommandInput placeholder="Search options..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Account">
                      <CommandItem>
                        <User className="mr-2 h-3 w-3" />
                        Profile
                      </CommandItem>
                      <CommandItem>
                        <Settings className="mr-2 h-3 w-3" />
                        Settings
                      </CommandItem>
                      <CommandItem>
                        <LogOut className="mr-2 h-3 w-3" />
                        Log out
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={75}>
            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-800">{product.name}</CardTitle>
                      <CardDescription className="text-sm text-gray-500">Product ID: {product.id}</CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <img src={selectedImage} alt={product.name} className="w-full h-64 object-cover rounded-lg shadow-md" />
                      <ScrollArea className="h-20 w-full">
                        <div className="flex space-x-2">
                          {product.images.map((image, index) => (
                            <img 
                              key={index} 
                              src={image} 
                              alt={`${product.name} ${index + 1}`} 
                              className="w-16 h-16 object-cover rounded-md cursor-pointer border-2 hover:border-blue-500 transition-all"
                              onClick={() => setSelectedImage(image)}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Product Description</h3>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-2">AI-Generated Description</h3>
                        <Card className="bg-blue-50 border-blue-200">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-4">
                              <Sparkles className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-blue-800">{aiDescription || "Click the button below to generate an AI-powered product description."}</p>
                                <Button onClick={generateAIDescription} size="sm" className="mt-2 bg-blue-500 text-white hover:bg-blue-600">
                                  <Zap className="h-3 w-3 mr-1" />
                                  Generate AI Description
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Pricing</h3>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-2xl font-bold">${pricingStrategy.toFixed(2)}</span>
                          <Badge variant="secondary" className="text-xs">
                            {pricingStrategy > product.price ? 'Increased' : 'Decreased'}
                          </Badge>
                        </div>
                        <Select onValueChange={simulatePricingStrategy}>
                          <SelectTrigger className="w-full text-xs">
                            <SelectValue placeholder="Select pricing strategy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cost-plus">Cost-Plus Pricing</SelectItem>
                            <SelectItem value="value-based">Value-Based Pricing</SelectItem>
                            <SelectItem value="competitive">Competitive Pricing</SelectItem>
                            <SelectItem value="skimming">Price Skimming</SelectItem>
                            <SelectItem value="penetration">Penetration Pricing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-xs font-semibold mb-2">Specifications</h3>
                      <div className="space-y-1">
                        {product.customFields?.map((field, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-gray-600">{field.name}:</span>
                            <span className="font-medium">{field.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold mb-2">Categories & Tags</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-600">Category:</span>
                          <Badge variant="secondary" className="ml-1 text-xs">{product.category}</Badge>
                        </div>
                        <div>
                          <span className="text-xs text-gray-600">Tags:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Product Variants</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Variant</TableHead>
                        <TableHead className="text-xs">SKU</TableHead>
                        <TableHead className="text-xs">Stock</TableHead>
                        <TableHead className="text-xs">Color</TableHead>
                        <TableHead className="text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.variants.map((variant) => (
                        <TableRow key={variant.id}>
                          <TableCell className="text-xs">{variant.name}</TableCell>
                          <TableCell className="text-xs">{variant.sku}</TableCell>
                          <TableCell className="text-xs">{variant.stock}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: variant.color }}></div>
                              <span className="text-xs">{variant.color}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="text-xs h-6">Edit</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button className="mt-3 text-xs" size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Variant
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">SEO Settings</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="seo-title" className="text-xs font-medium">SEO Title</label>
                      <Input id="seo-title" value={product.seo.title} className="mt-1 text-xs" />
                    </div>
                    <div>
                      <label htmlFor="seo-description" className="text-xs font-medium">Meta Description</label>
                      <Textarea id="seo-description" value={product.seo.description} className="mt-1 text-xs" />
                    </div>
                    <div>
                      <label htmlFor="seo-keywords" className="text-xs font-medium">Keywords</label>
                      <Input id="seo-keywords" value={product.seo.keywords} className="mt-1 text-xs" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
          <ResizablePanel defaultSize={25}>
            <div className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <Tag className="h-3 w-3 mr-1" />
                      Update Price
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <Truck className="h-3 w-3 mr-1" />
                      Manage Stock
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <Globe className="h-3 w-3 mr-1" />
                      Translate
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <History className="h-3 w-3 mr-1" />
                      Version History
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Reviews
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      <GitCompare className="h-3 w-3 mr-1" />
                      Compare
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Related Products</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <ScrollArea className="h-[200px]">
                    <div className="grid grid-cols-2 gap-2">
                      {relatedProducts.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                          <CardContent className="p-2">
                            <img src={product.image} alt={product.name} className="w-full h-16 object-cover rounded-sm mb-1" />
                            <h4 className="text-xs font-medium truncate">{product.name}</h4>
                            <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Developer Options</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">API Access</span>
                      <Switch size="sm" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8">
                      <Code className="h-3 w-3 mr-1" />
                      View API Docs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      <footer className="border-t mt-6 bg-gray-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between text-xs text-gray-500">
          <div>© 2024 Your Company. All rights reserved.</div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}