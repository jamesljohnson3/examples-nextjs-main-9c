
"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Search, User, ImageIcon } from 'lucide-react'

const sampleProducts = [
  {
    id: 'PROD-12345',
    name: 'Wireless Earbuds',
    description: 'High-quality wireless earbuds with noise cancellation',
    price: 99.99,
    category: 'Electronics',
    image: '/placeholder.svg?height=100&width=100&text=Earbuds'
  },
  {
    id: 'PROD-67890',
    name: 'Smart Watch',
    description: 'Feature-packed smartwatch with health tracking',
    price: 199.99,
    category: 'Electronics',
    image: '/placeholder.svg?height=100&width=100&text=Watch'
  },
  {
    id: 'PROD-11111',
    name: 'Ergonomic Chair',
    description: 'Comfortable office chair for long working hours',
    price: 299.99,
    category: 'Furniture',
    image: '/placeholder.svg?height=100&width=100&text=Chair'
  },
]

export default function ProductListHomepage() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
  }

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
            <Input placeholder="Type a command or search..." className="flex-grow h-8 text-xs" />
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
                {sampleProducts.map((product) => (
                  <AccordionItem key={product.id} value={product.id}>
                    <AccordionTrigger onClick={() => handleProductSelect(product)} className="text-xs">
                      <div className="flex items-center space-x-2">
                        <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded" />
                        <span>{product.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-2 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-xs text-muted-foreground">{product.description}</p>
                          </div>
                          <Badge>{product.category}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">${product.price.toFixed(2)}</span>
                          <Button size="sm">Delete Product</Button>

                        </div>
                        {selectedProduct && selectedProduct.id === product.id && (
                          <Card className="mt-2">
                            <CardContent className="p-2">
                              <h2 className="font-semibold mb-1">Live Product Preview</h2>
                              <div className="bg-muted p-2 rounded space-y-1">
                                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-24 object-cover rounded mb-2" />
                                <div className="text-xs">
                                  <span className="font-semibold">ID:</span> {selectedProduct.id}
                                </div>
                                <div className="text-xs">
                                  <span className="font-semibold">Name:</span> {selectedProduct.name}
                                </div>
                                <div className="text-xs">
                                  <span className="font-semibold">Description:</span> {selectedProduct.description}
                                </div>
                                <div className="text-xs">
                                  <span className="font-semibold">Price:</span> ${selectedProduct.price.toFixed(2)}
                                </div>
                                <div className="text-xs">
                                  <span className="font-semibold">Category:</span> {selectedProduct.category}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                                                  <Button size="sm">Edit Product</Button>

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
                  <span className="font-bold">{sampleProducts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Categories:</span>
                  <span className="font-bold">{new Set(sampleProducts.map(p => p.category)).size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs">Avg. Price:</span>
                  <span className="font-bold">
                    ${(sampleProducts.reduce((sum, p) => sum + p.price, 0) / sampleProducts.length).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}