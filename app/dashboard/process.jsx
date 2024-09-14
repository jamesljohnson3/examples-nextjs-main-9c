/* eslint-disable react/no-unescaped-entities */


"use client"


import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Zap, RefreshCw, ThumbsUp, ThumbsDown, MessageCircle, Sparkles, Download } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

 function AIDesignLab() {
  const [prompt, setPrompt] = useState("")
  const [concepts, setConcepts] = useState([
    { id: 1, type: 'Moodboard', image: '/placeholder.svg?height=200&width=300', likes: 5, dislikes: 1 },
    { id: 2, type: 'Mockup', image: '/placeholder.svg?height=200&width=300', likes: 3, dislikes: 2 },
    { id: 3, type: 'Sketch', image: '/placeholder.svg?height=200&width=300', likes: 7, dislikes: 0 },
  ])
  const [aiProgress, setAIProgress] = useState(0)
  const [activeNode, setActiveNode] = useState(1)

  const handlePromptSubmit = (e) => {
    e.preventDefault()
    // Simulate AI processing
    setAIProgress(0)
    const interval = setInterval(() => {
      setAIProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Add a new concept after processing
          setConcepts([...concepts, { 
            id: concepts.length + 1, 
            type: 'AI Generated', 
            image: '/placeholder.svg?height=200&width=300', 
            likes: 0, 
            dislikes: 0 
          }])
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleFeedback = (id, isPositive) => {
    setConcepts(concepts.map(concept => 
      concept.id === id 
        ? { 
            ...concept, 
            likes: isPositive ? concept.likes + 1 : concept.likes,
            dislikes: !isPositive ? concept.dislikes + 1 : concept.dislikes
          }
        : concept
    ))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Design Lab</h1>
        <p className="text-gray-600">Collaborate with AI to create innovative designs</p>
      </header>

      <main className="space-y-8">
        {/* Prompt input and AI progress */}
        <Card>
          <CardHeader>
            <CardTitle>Design Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePromptSubmit} className="flex space-x-2 mb-4">
              <Input 
                placeholder="Describe your design idea..." 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={aiProgress > 0 && aiProgress < 100}>
                {aiProgress > 0 && aiProgress < 100 ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="mr-2 h-4 w-4" />
                )}
                Generate
              </Button>
            </form>
            {aiProgress > 0 && (
              <Progress value={aiProgress} className="w-full" />
            )}
          </CardContent>
        </Card>

        {/* Tabs for Gallery and 3D StyleScape */}
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery">Design Gallery</TabsTrigger>
            <TabsTrigger value="stylescape">3D StyleScape</TabsTrigger>
          </TabsList>
          <TabsContent value="gallery" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {concepts.map((concept) => (
                <Card key={concept.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <img src={concept.image} alt={concept.type} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Badge>{concept.type}</Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleFeedback(concept.id, true)}>
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {concept.likes}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleFeedback(concept.id, false)}>
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            {concept.dislikes}
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm">Refine</Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="stylescape" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">3D StyleScape Visualization</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[1, 2, 3].map((node) => (
                    <Card 
                      key={node} 
                      className={`cursor-pointer transition-all ${activeNode === node ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setActiveNode(node)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Design Node {node}</h4>
                        <Progress value={30 * node} className="h-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Node Influence</label>
                    <Slider defaultValue={[50]} max={100} step={1} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Creativity Level</label>
                    <Slider defaultValue={[70]} max={100} step={1} />
                  </div>
                  <Button className="w-full">Apply StyleScape Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}



export default function AIDesignLab2() {
  const [prompt, setPrompt] = useState("")
  const [concepts, setConcepts] = useState([])
  const [aiProgress, setAIProgress] = useState(0)
  const [aiSuggestion, setAISuggestion] = useState("")
  const [creativityLevel, setCreativityLevel] = useState(50)

  useEffect(() => {
    // Simulate continuous AI generation
    const interval = setInterval(() => {
      if (concepts.length < 20) {
        addNewConcept()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [concepts])

  const addNewConcept = () => {
    const newConcept = {
      id: Date.now(),
      type: ['Moodboard', 'Sketch', 'Mockup', 'Color Palette', '3D Render'][Math.floor(Math.random() * 5)],
      image: `/placeholder.svg?height=300&width=400&text=AI+Generated+${concepts.length + 1}`,
      likes: 0,
      dislikes: 0,
      score: Math.random() * 100
    }
    setConcepts(prev => [...prev, newConcept].sort((a, b) => b.score - a.score))
  }

  const handlePromptSubmit = (e) => {
    e.preventDefault()
    setAIProgress(0)
    const interval = setInterval(() => {
      setAIProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          addNewConcept()
          generateAISuggestion()
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleFeedback = (id, isPositive) => {
    setConcepts(concepts.map(concept => 
      concept.id === id 
        ? { 
            ...concept, 
            likes: isPositive ? concept.likes + 1 : concept.likes,
            dislikes: !isPositive ? concept.dislikes + 1 : concept.dislikes,
            score: isPositive ? concept.score + 10 : concept.score - 5
          }
        : concept
    ).sort((a, b) => b.score - a.score))
    generateAISuggestion()
  }

  const generateAISuggestion = () => {
    const suggestions = [
      "Try incorporating more vibrant colors for a modern feel.",
      "Consider a minimalist approach to highlight key elements.",
      "Experiment with asymmetrical layouts for visual interest.",
      "Integrate more organic shapes to soften the design.",
      "Explore a retro-inspired palette for a unique twist."
    ]
    setAISuggestion(suggestions[Math.floor(Math.random() * suggestions.length)])
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">AI Design Lab 2.0</h1>
        <p className="text-gray-600">Collaborate with AI to explore innovative design concepts</p>
      </header>

      <main className="space-y-8">
        <Card>
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handlePromptSubmit} className="flex space-x-2">
              <Input 
                placeholder="Describe your design vision..." 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="submit" disabled={aiProgress > 0 && aiProgress < 100}>
                      {aiProgress > 0 && aiProgress < 100 ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Zap className="mr-2 h-4 w-4" />
                      )}
                      Generate Concepts
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>AI will generate new design concepts based on your prompt</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </form>
            {aiProgress > 0 && (
              <Progress value={aiProgress} className="w-full" />
            )}
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">AI Creativity Level:</span>
              <Slider 
                min={0} 
                max={100} 
                step={1} 
                value={[creativityLevel]}
                onValueChange={(value) => setCreativityLevel(value[0])}
                className="w-64" 
              />
              <span>{creativityLevel}%</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ScrollArea className="h-[calc(100vh-280px)] lg:col-span-2 rounded-lg border bg-white p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {concepts.map((concept) => (
                <Card key={concept.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <img src={concept.image} alt={concept.type} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <Badge>{concept.type}</Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleFeedback(concept.id, true)}>
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {concept.likes}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleFeedback(concept.id, false)}>
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            {concept.dislikes}
                          </Button>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Provide Feedback
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share your thoughts to guide the AI's next iterations</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">AI Design Assistant</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">AI Suggestion:</h4>
                  <p className="text-blue-600">{aiSuggestion || "Generating suggestions based on your interactions..."}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Design Trends:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Neomorphism in UI elements</li>
                    <li>Dark mode optimized designs</li>
                    <li>Microinteractions for enhanced UX</li>
                  </ul>
                </div>
                <Button className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate New Direction
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}