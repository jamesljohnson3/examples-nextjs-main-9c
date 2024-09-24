"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Bell, User, Settings, LogOut, Edit, Eye, Share2, Sparkles, Zap, PlusCircle, Film, BarChart3, Code, Info } from 'lucide-react'

const product = {
  id: 'PROD-001',
  name: 'Premium Content Package',
  description: 'Engage your audience with our premium content package, designed for maximum user interaction and retention.',
  price: 299.99,
  rating: 4.5,
  reviews: 128,
}

export default function ImprovedAppProductPage() {
  const [aiDescription, setAiDescription] = useState('')
  const [pricingStrategy, setPricingStrategy] = useState(product.price)

  const generateAIDescription = () => {
    const descriptions = [
      "Elevate your app's engagement with our Premium Content Package. Designed to captivate and retain users, this package offers a perfect blend of interactive features and compelling content.",
      "Unlock the full potential of your app with our Premium Content Package. Tailored for maximum user interaction, it provides a rich, immersive experience that keeps users coming back for more.",
      "Transform your app into a powerhouse of engagement with our Premium Content Package. Packed with features designed to boost user retention and satisfaction, it's the key to app success."
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-sm col-span-2">
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
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Product Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Description</h3>
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
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pricing & Performance</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Pricing Strategy</h3>
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
                <div>
                  <h3 className="text-sm font-semibold mb-2">Performance Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Total Reach</span>
                      <span className="text-xs">2.5M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Avg. Engagement Rate</span>
                      <span className="text-xs">7.9%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Ad Performance</span>
                      <span className="text-xs">5.3% CTR</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Reel Views</span>
                      <span className="text-xs">265K</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4 text-xs h-8">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    View Detailed Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Content Management</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="segments">
                  <AccordionTrigger>Segment Management</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-300">
                        <CardContent className="flex flex-col items-center justify-center h-40">
                          <PlusCircle className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Add New Segment</p>
                        </CardContent>
                      </Card>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Card className="bg-blue-50 hover:bg-blue-100 transition-colors duration-300">
                              <CardContent className="p-4">
                                <h4 className="text-sm font-semibold mb-2">Young Adults</h4>
                                <p className="text-xs text-gray-600">Reach: 1.2M</p>
                                <p className="text-xs text-gray-600">Engagement: 8.5%</p>
                              </CardContent>
                            </Card>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to view detailed segment information</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="advertisements">
                  <AccordionTrigger>Advertisement Management</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-300">
                        <CardContent className="flex flex-col items-center justify-center h-40">
                          <PlusCircle className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Create New Ad</p>
                        </CardContent>
                      </Card>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Card className="bg-green-50 hover:bg-green-100 transition-colors duration-300">
                              <CardContent className="p-4">
                                <h4 className="text-sm font-semibold mb-2">Summer Sale Promo</h4>
                                <p className="text-xs text-gray-600">Views: 50K</p>
                                <p className="text-xs text-gray-600">CTR: 5%</p>
                              </CardContent>
                            </Card>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to view and edit ad details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="reels">
                  <AccordionTrigger>Reels Management</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-300">
                        <CardContent className="flex flex-col items-center justify-center h-40">
                          <Film className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Upload New Reel</p>
                        </CardContent>
                      </Card>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Card className="bg-purple-50 hover:bg-purple-100 transition-colors duration-300">
                              <CardContent className="p-4">
                                <h4 className="text-sm font-semibold mb-2">Quick Tips</h4>
                                <p className="text-xs text-gray-600">Views: 100K</p>
                                <p className="text-xs text-gray-600">Likes: 15K</p>
                              </CardContent>
                            </Card>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to view reel analytics and settings</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="shadow-sm col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Metadata & Integration</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-2">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Update Price
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Manage Stock
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Translate
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Version History
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2">Integration Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">API Access</span>
                      <Switch size="sm" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Webhook Notifications</span>
                      <Switch size="sm" />
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 mt-2">
                      <Code className="h-3 w-3 mr-1" />
                      View API Docs
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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