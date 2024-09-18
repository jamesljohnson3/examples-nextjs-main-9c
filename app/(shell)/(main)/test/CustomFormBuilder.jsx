"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { PlusIcon, MinusIcon, GripVertical, Settings2Icon, BrainCircuitIcon, SparklesIcon, ImageIcon, EyeIcon, BarChart3Icon, Sliders, MessageSquare, ChevronLeft, Save, Upload, Image, FileImage, Tag, Search, User, Maximize2, X, ArrowLeft, Zap, RefreshCw, Download, ThumbsUp, ThumbsDown, Eye } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const initialFormElements = [
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'description', type: 'textarea', label: 'Desc' },
  { id: 'price', type: 'number', label: 'Price' },
  { id: 'quantity', type: 'number', label: 'Qty' },
  { id: 'category', type: 'select', label: 'Cat', options: ['Electronics', 'Clothing', 'Food', 'Books'] },
]

const sampleProductData = {
  id: 'PROD-12345',
  name: 'Wireless Earbuds',
  description: 'High-quality wireless earbuds with noise cancellation',
  price: 99.99,
  quantity: 500,
  category: 'Electronics',
}

const analyticsData = [
  { label: 'Views', value: 4328, icon: EyeIcon },
  { label: 'Likes', value: 1203, icon: BarChart3Icon },
  { label: 'Shares', value: 567, icon: Sliders },
  { label: 'Comments', value: 89, icon: MessageSquare },
]

const sampleDesignConcepts = [
  { id: 1, image: '/placeholder.svg?height=200&width=200', title: 'Concept 1' },
  { id: 2, image: '/placeholder.svg?height=200&width=200', title: 'Concept 2' },
  { id: 3, image: '/placeholder.svg?height=200&width=200', title: 'Concept 3' },
  { id: 4, image: '/placeholder.svg?height=200&width=200', title: 'Concept 4' },
]

export default function EnhancedProductMoodboard() {
  const [formFields, setFormFields] = useState([])
  const [availableFields, setAvailableFields] = useState(initialFormElements) 
  const [previewData, setPreviewData] = useState(sampleProductData)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [imageGallery, setImageGallery] = useState([])
  const [primaryPhoto, setPrimaryPhoto] = useState(null)
  const [ogImage, setOgImage] = useState(null)
  const [metadata, setMetadata] = useState({ title: '', description: '', keywords: '' }) 
  const [fullscreenConcept, setFullscreenConcept] = useState(null)
  const [activeTab, setActiveTab] = useState('form') 

  useEffect(() => {
    setFormFields(initialFormElements.map(field => ({ ...field, id: `${field.id}-${Date.now()}` })))
    setAvailableFields([])
  }, [])

  const onDragEnd = (result) => {
    if (!result.destination) return
    const items = Array.from(formFields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setFormFields(items)
    setHasUnsavedChanges(true)
  }

  const addFormField = (field) => {
    setFormFields([...formFields, { ...field, id: `${field.id}-${Date.now()}` }])
    setAvailableFields(availableFields.filter(f => f.id !== field.id))
    setHasUnsavedChanges(true)
  }

  const removeFormField = (index) => {
    const removedField = formFields[index]
    const newFields = [...formFields]
    newFields.splice(index, 1)
    setFormFields(newFields)
    setAvailableFields([...availableFields, initialFormElements.find(f => f.id === removedField.id.split('-')[0])])
    setHasUnsavedChanges(true)
  }

  const handleInputChange = (id, value) => {
    setPreviewData({ ...previewData, [id]: value })
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    console.log('Saving changes...')
    setHasUnsavedChanges(false)
  }

  const handlePublish = () => {
    console.log('Publishing product...')
    setHasUnsavedChanges(false)
  }

  const handleImageUpload = (event, type) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        switch (type) {
          case 'gallery':
            setImageGallery([...imageGallery, reader.result])
            break
          case 'primary':
            setPrimaryPhoto(reader.result)
            break
          case 'og':
            setOgImage(reader.result)
            break
        }
        setHasUnsavedChanges(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMetadataChange = (key, value) => {
    setMetadata({ ...metadata, [key]: value })
    setHasUnsavedChanges(true)
  }

  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'form':
        return (
          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="product-form">
              <AccordionTrigger className="text-sm font-semibold">Product Form</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex space-x-1">
                        {availableFields.map((element) => (
                          <Button key={element.id} variant="outline" size="sm" className="h-6 text-xs px-1" onClick={() => addFormField(element)}>
                            <PlusIcon className="h-3 w-3 mr-1" /> {element.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="form-fields">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                            {formFields.map((field, index) => (
                              <Draggable key={field.id} draggableId={field.id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex items-center space-x-1 bg-muted p-1 rounded text-xs"
                                  >
                                    <GripVertical className="h-3 w-3 text-muted-foreground" />
                                    {field.type === 'text' && (
                                      <Input 
                                        placeholder={field.label} 
                                        className="h-6 text-xs" 
                                        value={previewData[field.id.split('-')[0]] || ''}
                                        onChange={(e) => handleInputChange(field.id.split('-')[0], e.target.value)} 
                                      />
                                    )}
                                    {field.type === 'textarea' && (
                                      <Textarea 
                                        placeholder={field.label} 
                                        className="h-6 text-xs" 
                                        value={previewData[field.id.split('-')[0]] || ''}
                                        onChange={(e) => handleInputChange(field.id.split('-')[0], e.target.value)} 
                                      />
                                    )}
                                    {field.type === 'number' && (
                                      <Input 
                                        type="number" 
                                        placeholder={field.label} 
                                        className="h-6 text-xs" 
                                        value={previewData[field.id.split('-')[0]] || ''}
                                        onChange={(e) => handleInputChange(field.id.split('-')[0], e.target.value)} 
                                      />
                                    )}
                                    {field.type === 'select' && (
                                      <Select 
                                        value={previewData[field.id.split('-')[0]] || ''}
                                        onValueChange={(value) => handleInputChange(field.id.split('-')[0], value)}
                                      >
                                        <SelectTrigger className="h-6 text-xs">
                                          <SelectValue placeholder={field.label} />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {field.options.map((option) => (
                                            <SelectItem key={option} value={option} className="text-xs">{option}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => removeFormField(index)}>
                                      <MinusIcon className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="image-gallery">
              <AccordionTrigger className="text-sm font-semibold">Image Gallery</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-2 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {imageGallery.map((img, index) => (
                        <div key={index} className="w-16 h-16 relative">
                          <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover rounded" />
                          <Button size="sm" variant="destructive" className="absolute top-0 right-0 h-4 w-4 p-0" onClick={() => {
                            const newGallery = [...imageGallery]
                            newGallery.splice(index, 1)
                            setImageGallery(newGallery)
                            setHasUnsavedChanges(true)
                          }}>
                            <MinusIcon className="h-2 w-2" />
                          </Button>
                        </div>
                      ))}
                      <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                        <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'gallery')} accept="image/*" />
                        <PlusIcon className="h-6 w-6 text-muted-foreground" />
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="primary-photo">
              <AccordionTrigger className="text-sm font-semibold">Primary Photo</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      {primaryPhoto ? (
                        <div className="w-16 h-16 relative">
                          <img src={primaryPhoto} alt="Primary" className="w-full h-full object-cover rounded" />
                          <Button size="sm" variant="destructive" className="absolute top-0 right-0 h-4 w-4 p-0" onClick={() => {
                            setPrimaryPhoto(null)
                            setHasUnsavedChanges(true)
                          }}>
                            <MinusIcon className="h-2 w-2" />
                          </Button>
                        </div>
                      ) : (
                        <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'primary')} accept="image/*" />
                          <Image className="h-6 w-6 text-muted-foreground" />
                        </label>
                      )}
                      <span className="text-xs text-muted-foreground">Set as primary product image</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="og-image">
              <AccordionTrigger className="text-sm font-semibold">OG Image</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      {ogImage ? (
                        <div className="w-16 h-16 relative">
                          <img src={ogImage} alt="OG" className="w-full h-full object-cover rounded" />
                          <Button size="sm" variant="destructive" className="absolute top-0 right-0 h-4 w-4 p-0" onClick={() => {
                            setOgImage(null)
                            setHasUnsavedChanges(true)
                          }}>
                            <MinusIcon className="h-2 w-2" />
                          </Button>
                        </div>
                      ) : (
                        <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'og')} accept="image/*" />
                          <FileImage className="h-6 w-6 text-muted-foreground" />
                        </label>
                      )}
                      <span className="text-xs text-muted-foreground">Set Open Graph image for social sharing</span>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="metadata">
              <AccordionTrigger className="text-sm font-semibold">Metadata</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="p-2 space-y-2">
                    <div className="space-y-1">
                      <Input 
                        placeholder="Meta Title" 
                        className="h-6 text-xs" 
                        value={metadata.title}
                        onChange={(e) => handleMetadataChange('title', e.target.value)}
                      />
                      <Textarea 
                        placeholder="Meta Description" 
                        className="h-12 text-xs" 
                        value={metadata.description}
                        onChange={(e) => handleMetadataChange('description', e.target.value)}
                      />
                      <Input 
                        placeholder="Keywords (comma-separated)" 
                        className="h-6 text-xs" 
                        value={metadata.keywords}
                        onChange={(e) => handleMetadataChange('keywords', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )
      case 'refine':
        return (
          
          <></>
        )
      case 'analytics':
        return (
          <Card>
            <CardContent className="p-2">
              <h2 className="font-semibold mb-1">Analytics Scoreboard</h2>
              <div className="grid grid-cols-2 gap-2">
                {analyticsData.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <item.icon className="h-4 w-4" />
                        <span className="font-semibold">{item.label}</span>
                      </div>
                      <span className="text-lg font-bold">{item.value.toLocaleString()}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
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
            Products / {previewData.category} / {previewData.id}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && <span className="text-yellow-500">Unsaved changes</span>}
          <Button size="sm" className="h-6" onClick={handleSave}>
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button size="sm" className="h-6" onClick={handlePublish}>
            <Upload className="h-3 w-3 mr-1" />
            Publish
          </Button>
        </div>
      </div>
      
      <h1 className="text-lg font-bold text-center mb-2">Enhanced Product Moodboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-8">
          <TabsTrigger value="form" className="text-xs">Form Builder</TabsTrigger>
          <TabsTrigger value="refine" className="text-xs">Refine with AI</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="mb-2">
        <CardContent className="p-2">
          <div className="flex space-x-2 mb-2">
            <Input placeholder="Search..." className="flex-grow h-8 text-xs" />
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
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Type a command or search..." className="h-8 text-xs" />
            <CommandList className="h-24 overflow-y-auto">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Actions">
                <CommandItem className="text-xs">Generate New Concept</CommandItem>
                <CommandItem className="text-xs">Modify Existing Concept</CommandItem>
                <CommandItem className="text-xs">Apply Style Transfer</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </CardContent>
      </Card>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          {renderTabContent()}
        </ResizablePanel>
        <ResizablePanel defaultSize={50}>
          <Card>
            <CardContent className="p-2">
              <h2 className="font-semibold mb-1">Live Product Preview</h2>
              <div className="bg-muted p-2 rounded space-y-1">
                {primaryPhoto ? (
                  <img src={primaryPhoto} alt="Primary" className="w-full h-24 object-cover rounded mb-2" />
                ) : (
                  <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center mb-2">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                {Object.entries(previewData).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="font-semibold">{key}:</span> {value}
                  </div>
                ))}
                <div className="text-xs mt-2">
                  <span className="font-semibold">Meta Title:</span> {metadata.title}
                </div>
                <div className="text-xs">
                  <span className="font-semibold">Meta Description:</span> {metadata.description}
                </div>
                <div className="text-xs">
                  <span className="font-semibold">Keywords:</span> {metadata.keywords}
                </div>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>

      {fullscreenConcept && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-full overflow-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">{fullscreenConcept.title}</h3>
              <Button size="sm" variant="ghost" onClick={() => setFullscreenConcept(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <img src={fullscreenConcept.image} alt={fullscreenConcept.title} className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  )
}