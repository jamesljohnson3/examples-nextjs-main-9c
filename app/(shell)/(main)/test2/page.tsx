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
import { ScrollArea } from "@/components/ui/scroll-area"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Copy, Zap, User } from 'lucide-react'
import useWindowSize from "@/hooks/use-window-size"
import Link from 'next/link'
import api from "@/api"
import type { VehicleRecord } from '@/types/api'

export default function EnhancedSegmentCreatePage() {
  const [product, setProduct] = useState({
    name: '',
  })

  const [vehicles, setVehicles] = useState<VehicleRecord[]>([])  // Store fetched vehicles
  const [loading, setLoading] = useState(false)  // Loading state
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const { isMobile, isDesktop } = useWindowSize()

  // Fetch vehicles from the API
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true)
      try {
        const vehicleData = await api.list()
        setVehicles(vehicleData)
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setProduct(prev => ({ ...prev, category: value }))
  }

  const handleCloneVehicle = (vehicle: VehicleRecord) => {
    setProduct({
        name: vehicle.fields.Name,
        description: '',  // Assume default or fetch from somewhere
        price: vehicle.fields["Vehicle details 1"] || 0, // Adjust according to API
        category: '', // Set category as needed
        inStock: true, // Assume default
        images: [vehicle.fields.Attachments[0]?.thumbnails.small.url || ''], // Assuming the vehicle has an image
    });
}

  


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting product:', product)
    // Submit the form data to your backend here
  }

  // Simulate continuous AI suggestions update
  useEffect(() => {
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
       <Link href={'/'}>  <Button variant="ghost" size="sm" className="h-6">
            <ChevronLeft className="h-3 w-3 mr-1" />
            Back to Inventory
          </Button></Link> 
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
          <ResizablePanel defaultSize={80}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Segment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full space-y-2">
                  <ScrollArea className="h-72 w-full rounded-md border">
                   <div className="p-4 grid grid-cols-2 gap-4">
  {vehicles.map((vehicle) => (
    <Card key={vehicle.id} className="overflow-hidden">
      <CardContent className="p-2">
        <img 
          src={vehicle.fields.Attachments[0]?.thumbnails.small.url} 
          alt={vehicle.fields.Name} 
          className="w-10 h-10 object-cover rounded mb-2" 
        />
        <span>{vehicle.fields.Name}</span>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Price:</span> 
          <span>{vehicle.fields["Vehicle details 1"] || 0}</span>
          <Button size="sm" className="h-6 text-[10px]" onClick={() => handleCloneVehicle(vehicle)}>
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
                          <Input id="name" name="name" value={product.name} onChange={handleInputChange} className="h-7 text-xs" />
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-xs">Description</Label>
                         </div>
                        <div>
                          <Label htmlFor="price" className="text-xs">Price</Label>
                         </div>
                        <div>
                          <Label htmlFor="category" className="text-xs">Category</Label>

                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="in-stock" className="text-xs">In Stock</Label>

                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>

        <div className="mt-4 flex justify-end">
       <Link href={'/'}>
       <Button type="submit" className="text-xs">
            <Zap className="h-4 w-4 mr-1" />
            Submit
          </Button>
       </Link>  
        </div>
      </form>
    </div>
  )
}
