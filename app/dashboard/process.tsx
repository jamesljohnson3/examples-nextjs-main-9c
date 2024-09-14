

"use client"

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Zap, RefreshCw, ThumbsUp, ThumbsDown, Download } from 'lucide-react'

export default function AIDesignLab() {
  const [prompt, setPrompt] = useState("")
  const [concepts, setConcepts] = useState([
    { id: 1, type: 'Moodboard', image: '/placeholder.svg?height=200&width=300', likes: 5, dislikes: 1 },
    { id: 2, type: 'Mockup', image: '/placeholder.svg?height=200&width=300', likes: 3, dislikes: 2 },
    { id: 3, type: 'Sketch', image: '/placeholder.svg?height=200&width=300', likes: 7, dislikes: 0 },
  ])
  const [aiProgress, setAIProgress] = useState(0)
  const [activeNode, setActiveNode] = useState(1)

  const handlePromptSubmit = (e: React.FormEvent) => {
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

  const handleFeedback = (id: number, isPositive: boolean) => {
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