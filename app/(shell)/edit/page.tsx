"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, Zap, RefreshCw, Download, Sparkles, MessageCircle, ThumbsUp, ThumbsDown, Eye, Lightbulb, TrendingUp } from 'lucide-react'

export default function EnhancedRefineConcept() {
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