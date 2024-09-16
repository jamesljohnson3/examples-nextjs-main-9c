"use client"
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, Zap, RefreshCw, Download, Sparkles, MessageCircle, ThumbsUp, ThumbsDown, Eye, Upload, X, Save, Lightbulb, TrendingUp } from 'lucide-react'

function EnhancedRefineConcept1() {
  const [concept, setConcept] = useState({
    id: 1,
    type: 'Moodboard',
    image: '/placeholder.svg?height=400&width=600&text=AI+Generated+Concept',
    likes: 15,
    dislikes: 2,
  })
  const [feedback, setFeedback] = useState('')
  const [aiProgress, setAIProgress] = useState(0)
  const [iterations, setIterations] = useState([
    { id: 1, image: '/placeholder.svg?height=200&width=300&text=Iteration+1' },
    { id: 2, image: '/placeholder.svg?height=200&width=300&text=Iteration+2' },
    { id: 3, image: '/placeholder.svg?height=200&width=300&text=Iteration+3' },
  ])
  const [creativityLevel, setCreativityLevel] = useState(50)
  const [aiSuggestions, setAiSuggestions] = useState([
    "Try a more vibrant color palette to evoke energy",
    "Consider incorporating organic shapes for a softer feel",
    "Experiment with typography to enhance the visual hierarchy",
  ])
  const [aiAnalysis, setAiAnalysis] = useState([
    { x: 20, y: 30, content: "Strong focal point" },
    { x: 60, y: 70, content: "Color harmony needs improvement" },
    { x: 80, y: 40, content: "Negative space well utilized" },
  ])
  const [competitorData, setCompetitorData] = useState([
    { name: "Competitor A", strength: "Bold typography", weakness: "Cluttered layout" },
    { name: "Competitor B", strength: "Unique color scheme", weakness: "Lack of contrast" },
    { name: "Competitor C", strength: "Innovative use of whitespace", weakness: "Inconsistent branding" },
  ])

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

  const handleRefinement = () => {
    setAIProgress(0)
    const interval = setInterval(() => {
      setAIProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Add a new iteration
          setIterations(prev => [...prev, {
            id: prev.length + 1,
            image: `/placeholder.svg?height=200&width=300&text=Iteration+${prev.length + 1}`
          }])
          // Simulate new AI analysis
          setAiAnalysis(prev => [
            ...prev,
            { x: Math.random() * 100, y: Math.random() * 100, content: "New design element detected" }
          ])
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 flex items-center">
        <Button variant="ghost" className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gallery
        </Button>
        <h1 className="text-3xl font-bold">AI-Powered Concept Refinement</h1>
      </header>

      <main className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>AI Vision: Current Concept</CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <img src={concept.image} alt={concept.type} className="w-full h-auto rounded-lg shadow-lg" />
              {aiAnalysis.map((point, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-8 h-8 rounded-full absolute p-0"
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <p>{point.content}</p>
                  </PopoverContent>
                </Popover>
              ))}
              <div className="mt-4 flex justify-between items-center">
                <Badge>{concept.type}</Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {concept.likes}
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    {concept.dislikes}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Refinement Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">AI Creativity Level</label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[creativityLevel]}
                  onValueChange={(value) => setCreativityLevel(value[0])}
                />
                <span className="text-sm text-gray-500">{creativityLevel}% Creative</span>
              </div>
              <Textarea
                placeholder="Provide feedback to guide the AI..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
              <Button onClick={handleRefinement} className="w-full">
                {aiProgress > 0 && aiProgress < 100 ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Trigger AI Refinement
              </Button>
              {aiProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${aiProgress}%` }}></div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="iterations" className="w-full">
          <TabsList>
            <TabsTrigger value="iterations">AI Iterations</TabsTrigger>
            <TabsTrigger value="ai-suggestions">AI Insights</TabsTrigger>
            <TabsTrigger value="competitor-analysis">Competitor Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="iterations">
            <ScrollArea className="h-72 w-full rounded-md border">
              <div className="flex p-4 space-x-4">
                {iterations.map((iteration) => (
                  <Card key={iteration.id} className="flex-shrink-0 w-60">
                    <CardContent className="p-2">
                      <img src={iteration.image} alt={`Iteration ${iteration.id}`} className="w-full h-auto rounded" />
                      <Button variant="ghost" size="sm" className="w-full mt-2">
                        <Sparkles className="h-4 w-4 mr-1" />
                        Apply This Iteration
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="ai-suggestions">
            <Card>
              <CardContent className="p-4">
                <ul className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2 animate-fade-in">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="competitor-analysis">
            <Card>
              <CardContent className="p-4">
                <ul className="space-y-4">
                  {competitorData.map((competitor, index) => (
                    <li key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-semibold flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                        {competitor.name}
                      </h3>
                      <p className="text-sm text-green-600 mt-1">Strength: {competitor.strength}</p>
                      <p className="text-sm text-red-600">Weakness: {competitor.weakness}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export AI-Refined Concept
          </Button>
          <Button>Save and Return to AI Gallery</Button>
        </div>
      </main>
    </div>
  )
}

export default function RefinedProductMoodboard() {
  const [savedProduct, setSavedProduct] = useState({
    name: 'Ergonomic Chair',
    description: 'A comfortable chair designed for long working hours.',
    featuredImage: '/placeholder.svg?height=400&width=600&text=Featured+Image',
    gallery: [
      { id: 1, url: '/placeholder.svg?height=200&width=300&text=Gallery+1', caption: 'Front view' },
      { id: 2, url: '/placeholder.svg?height=200&width=300&text=Gallery+2', caption: 'Side view' },
      { id: 3, url: '/placeholder.svg?height=200&width=300&text=Gallery+3', caption: 'Back view' },
    ],
    moodboardType: 'Office Furniture',
    aiAnalysis: [
      { x: 20, y: 30, content: "Strong ergonomic design" },
      { x: 60, y: 70, content: "Color scheme needs refinement" },
      { x: 80, y: 40, content: "Sleek modern aesthetic" },
    ],
    creativityLevel: 50,
  })

  const [unsavedProduct, setUnsavedProduct] = useState({ ...savedProduct })
  const [aiProgress, setAIProgress] = useState(0)
  const [aiSuggestions, setAiSuggestions] = useState([
    "Consider a more vibrant color palette to appeal to younger professionals",
    "Emphasize the chair's adjustable features in product imagery",
    "Explore adding accessories like headrests or lumbar support pillows",
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUnsavedProduct({ ...unsavedProduct, [e.target.name]: e.target.value })
  }

  const handleGalleryChange = (id: number, field: 'url' | 'caption', value: string) => {
    setUnsavedProduct({
      ...unsavedProduct,
      gallery: unsavedProduct.gallery.map(img => 
        img.id === id ? { ...img, [field]: value } : img
      )
    })
  }

  const addGalleryImage = () => {
    const newId = Math.max(...unsavedProduct.gallery.map(img => img.id), 0) + 1
    setUnsavedProduct({
      ...unsavedProduct,
      gallery: [...unsavedProduct.gallery, { id: newId, url: '/placeholder.svg?height=200&width=300&text=New+Image', caption: '' }]
    })
  }

  const removeGalleryImage = (id: number) => {
    setUnsavedProduct({
      ...unsavedProduct,
      gallery: unsavedProduct.gallery.filter(img => img.id !== id)
    })
  }

  const handleRefinement = () => {
    setAIProgress(0)
    const interval = setInterval(() => {
      setAIProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Simulate AI refinement
          setUnsavedProduct(prev => ({
            ...prev,
            aiAnalysis: [
              ...prev.aiAnalysis,
              { x: Math.random() * 100, y: Math.random() * 100, content: "New design element suggested" }
            ]
          }))
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleSave = () => {
    setSavedProduct({ ...unsavedProduct })
  }

  const handlePublish = () => {
    console.log('Publishing product:', savedProduct)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Saved Version */}
      <div className="w-1/2 p-6 border-r border-gray-300 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Saved Version</h2>
        <Card>
          <CardHeader>
            <CardTitle>{savedProduct.name}</CardTitle>
            <Badge>{savedProduct.moodboardType}</Badge>
          </CardHeader>
          <CardContent>
            <img src={savedProduct.featuredImage} alt="Featured product" className="w-full h-64 object-cover rounded-lg mb-4" />
            <p className="text-gray-600 mb-4">{savedProduct.description}</p>
            <div className="grid grid-cols-3 gap-2">
              {savedProduct.gallery.map((img) => (
                <img key={img.id} src={img.url} alt={img.caption} className="w-full h-24 object-cover rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unsaved Version */}
      <div className="w-1/2 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Unsaved Changes</h2>
          <div>
            <Button onClick={handleSave} className="mr-2">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button onClick={handlePublish}>Publish</Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" value={unsavedProduct.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={unsavedProduct.description} 
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="featuredImage">Featured Image URL</Label>
                <Input 
                  id="featuredImage" 
                  name="featuredImage" 
                  value={unsavedProduct.featuredImage} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gallery Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="grid grid-cols-2 gap-4">
                {unsavedProduct.gallery.map((image) => (
                  <Card key={image.id}>
                    <CardContent className="p-4 space-y-2">
                      <img src={image.url} alt={image.caption} className="w-full h-32 object-cover rounded-md" />
                      <Input 
                        placeholder="Image URL" 
                        value={image.url} 
                        onChange={(e) => handleGalleryChange(image.id, 'url', e.target.value)}
                      />
                      <Input 
                        placeholder="Caption" 
                        value={image.caption} 
                        onChange={(e) => handleGalleryChange(image.id, 'caption', e.target.value)}
                      />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeGalleryImage(image.id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            <Button onClick={addGalleryImage} className="mt-4">
              Add Gallery Image
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>AI Moodboard Refinement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="creativityLevel">AI Creativity Level</Label>
                <Slider
                  id="creativityLevel"
                  min={0}
                  max={100}
                  step={1}
                  value={[unsavedProduct.creativityLevel]}
                  onValueChange={(value) => setUnsavedProduct({ ...unsavedProduct, creativityLevel: value[0] })}
                />
                <span className="text-sm text-gray-500">{unsavedProduct.creativityLevel}% Creative</span>
              </div>
              <Button onClick={handleRefinement} className="w-full">
                {aiProgress > 0 && aiProgress < 100 ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Generate AI Refinement
              </Button>
              {aiProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${aiProgress}%` }}></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Sparkles className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}