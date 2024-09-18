"use client"
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { EyeIcon, BarChart3Icon, Sliders, MessageSquare } from 'lucide-react'

type FieldType = 'text' | 'textarea' | 'number' | 'select'

interface FormField {
  id: string
  type: FieldType
  label: string
  options?: string[]
}

interface ProductData {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  category: string
}

interface AnalyticsItem {
  label: string
  value: number
  icon: React.ElementType
}

const initialFormElements: FormField[] = [
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'description', type: 'textarea', label: 'Description' },
  { id: 'price', type: 'number', label: 'Price' },
  { id: 'quantity', type: 'number', label: 'Quantity' },
  { id: 'category', type: 'select', label: 'Category', options: ['Electronics', 'Clothing', 'Food', 'Books'] },
]

const sampleProductData: ProductData = {
  id: 'PROD-12345',
  name: 'Wireless Earbuds',
  description: 'High-quality wireless earbuds with noise cancellation',
  price: 99.99,
  quantity: 500,
  category: 'Electronics',
}

const analyticsData: AnalyticsItem[] = [
  { label: 'Views', value: 4328, icon: EyeIcon },
  { label: 'Likes', value: 1203, icon: BarChart3Icon },
  { label: 'Shares', value: 567, icon: Sliders },
  { label: 'Comments', value: 89, icon: MessageSquare },
]

export default function EnhancedProductMoodboard() {
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [availableFields, setAvailableFields] = useState<FormField[]>(initialFormElements)
  const [previewData, setPreviewData] = useState<ProductData>(sampleProductData)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false)
  const [imageGallery, setImageGallery] = useState<string[]>([])
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null)
  const [ogImage, setOgImage] = useState<string | null>(null)
  const [metadata, setMetadata] = useState<{ title: string, description: string, keywords: string }>({ title: '', description: '', keywords: '' })
  const [fullscreenConcept, setFullscreenConcept] = useState<{ title: string, image: string } | null>(null)
  const [activeTab, setActiveTab] = useState<string>('form')

  useEffect(() => {
    setFormFields(initialFormElements.map(field => ({ ...field, id: `${field.id}-${Date.now()}` })))
    setAvailableFields([])
  }, [])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(formFields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setFormFields(items)
    setHasUnsavedChanges(true)
  }

  const addFormField = (field: FormField) => {
    setFormFields([...formFields, { ...field, id: `${field.id}-${Date.now()}` }])
    setAvailableFields(availableFields.filter(f => f.id !== field.id))
    setHasUnsavedChanges(true)
  }

  const removeFormField = (index: number) => {
    const removedField = formFields[index]
    const newFields = [...formFields]
    newFields.splice(index, 1)
    setFormFields(newFields)
    setAvailableFields([...availableFields, initialFormElements.find(f => f.id === removedField.id.split('-')[0])!])
    setHasUnsavedChanges(true)
  }

  const handleInputChange = (id: string, value: string | number) => {
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'primary' | 'og') => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        switch (type) {
          case 'gallery':
            setImageGallery([...imageGallery, reader.result as string])
            break
          case 'primary':
            setPrimaryPhoto(reader.result as string)
            break
          case 'og':
            setOgImage(reader.result as string)
            break
        }
        setHasUnsavedChanges(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMetadataChange = (key: 'title' | 'description' | 'keywords', value: string) => {
    setMetadata({ ...metadata, [key]: value })
    setHasUnsavedChanges(true)
  }

  const renderFormFields = () => (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {formFields.map((field, index) => (
        <AccordionItem key={field.id} value={field.id}>
          <AccordionTrigger>{field.label}</AccordionTrigger>
          <AccordionContent>
            {field.type === 'text' && (
              <Input
                value={(previewData as any)[field.id.split('-')[0]] || ''}
                onChange={e => handleInputChange(field.id.split('-')[0], e.target.value)}
              />
            )}
            {field.type === 'textarea' && (
              <Textarea
                value={(previewData as any)[field.id.split('-')[0]] || ''}
                onChange={e => handleInputChange(field.id.split('-')[0], e.target.value)}
              />
            )}
            {field.type === 'number' && (
              <Input
                type="number"
                value={(previewData as any)[field.id.split('-')[0]] || 0}
                onChange={e => handleInputChange(field.id.split('-')[0], parseFloat(e.target.value))}
              />
            )}
            {field.type === 'select' && (
              <Select
                onValueChange={value => handleInputChange(field.id.split('-')[0], value)}
                defaultValue={(previewData as any)[field.id.split('-')[0]] || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button onClick={() => removeFormField(index)}>Remove</Button>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )

  const renderAnalytics = () => (
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

  return (
    <div className="container mx-auto p-2 space-y-2 text-xs">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="form">{renderFormFields()}</TabsContent>
        <TabsContent value="analytics">{renderAnalytics()}</TabsContent>
      </Tabs>
      <Button onClick={handleSave} disabled={!hasUnsavedChanges}>Save Changes</Button>
      <Button onClick={handlePublish}>Publish</Button>
    </div>
  )
}
