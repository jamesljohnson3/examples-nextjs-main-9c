import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { ChevronRight, Layers, MessageSquare, Zap } from 'lucide-react'

export default function Dashboard() {
  const [prompt, setPrompt] = useState("")
  const [concepts, setConcepts] = useState([
    { id: 1, type: 'moodboard', image: '/placeholder.svg?height=200&width=300' },
    { id: 2, type: 'mockup', image: '/placeholder.svg?height=200&width=300' },
    { id: 3, type: 'sketch', image: '/placeholder.svg?height=200&width=300' },
  ])

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically call your AI processing function
    console.log("Processing prompt:", prompt)
    // For demo purposes, we'll just add a new concept
    setConcepts([...concepts, { id: concepts.length + 1, type: 'new concept', image: '/placeholder.svg?height=200&width=300' }])
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">processWithAI()</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li className="flex items-center space-x-2 p-2 bg-blue-100 text-blue-800 rounded">
              <Zap size={20} />
              <span>AI Design Lab</span>
            </li>
            <li className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
              <Layers size={20} />
              <span>Projects</span>
            </li>
            <li className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
              <MessageSquare size={20} />
              <span>Feedback</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <header className="bg-white shadow-sm p-4">
          <h2 className="text-2xl font-semibold">AI Design Lab</h2>
        </header>

        <main className="p-6 space-y-6 overflow-auto h-[calc(100vh-5rem)]">
          {/* Prompt input */}
          <form onSubmit={handlePromptSubmit} className="flex space-x-2">
            <Input 
              placeholder="Enter your design prompt..." 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Generate <ChevronRight className="ml-2 h-4 w-4" /></Button>
          </form>

          {/* Tabs for Gallery and 3D StyleScape */}
          <Tabs defaultValue="gallery" className="w-full">
            <TabsList>
              <TabsTrigger value="gallery">Design Gallery</TabsTrigger>
              <TabsTrigger value="stylescape">3D StyleScape</TabsTrigger>
            </TabsList>
            <TabsContent value="gallery" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {concepts.map((concept) => (
                  <Card key={concept.id}>
                    <CardContent className="p-4">
                      <img src={concept.image} alt={concept.type} className="w-full h-40 object-cover rounded-md mb-2" />
                      <p className="text-sm font-medium">{concept.type}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <Button variant="outline" size="sm">Refine</Button>
                        <Button variant="ghost" size="sm">Feedback</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="stylescape" className="mt-4">
              <div className="bg-gray-800 text-white p-8 rounded-lg">
                <h3 className="text-xl mb-4">3D StyleScape Visualization</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[1, 2, 3].map((node) => (
                    <div key={node} className="bg-gray-700 p-4 rounded-md">
                      <p className="text-sm mb-2">Design Node {node}</p>
                      <div className="w-full bg-gray-600 h-2 rounded-full">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: `${30 * node}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <span>Influence:</span>
                  <Slider defaultValue={[50]} max={100} step={1} className="flex-1" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}