import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Toast } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { Check, ChevronsUpDown, Edit, Plus, Tag, ChevronRight } from 'lucide-react'

export default function RefinedProductManagement() {
  const [product, setProduct] = useState({
    id: '1',
    name: 'Premium Widget',
    description: 'High-quality widget for all your needs',
    price: 29.99,
    image: '/placeholder.svg?height=200&width=200',
  })
  const [segments, setSegments] = useState([
    { id: '1', name: 'New Customers' },
    { id: '2', name: 'Returning Customers' },
    { id: '3', name: 'VIP Customers' },
  ])
  const [assignedSegments, setAssignedSegments] = useState([])
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [isSegmentDialogOpen, setIsSegmentDialogOpen] = useState(false)
  const [newSegment, setNewSegment] = useState({ name: '', description: '' })
  const [progress, setProgress] = useState({ created: true, edited: false, assigned: false })
  const { toast } = useToast()

  const handleEditProduct = (updatedProduct) => {
    setProduct(updatedProduct)
    setIsEditDrawerOpen(false)
    setProgress({ ...progress, edited: true })
    toast({
      title: "Product Updated",
      description: "Your product details have been successfully updated.",
    })
  }

  const handleAssignSegment = (segmentId) => {
    if (assignedSegments.includes(segmentId)) {
      setAssignedSegments(assignedSegments.filter(id => id !== segmentId))
    } else {
      setAssignedSegments([...assignedSegments, segmentId])
    }
    setProgress({ ...progress, assigned: true })
    toast({
      title: "Segments Updated",
      description: "Your product segments have been updated.",
    })
  }

  const handleCreateSegment = () => {
    const newSegmentId = (segments.length + 1).toString()
    setSegments([...segments, { id: newSegmentId, ...newSegment }])
    setAssignedSegments([...assignedSegments, newSegmentId])
    setNewSegment({ name: '', description: '' })
    setIsSegmentDialogOpen(false)
    toast({
      title: "New Segment Created",
      description: "Your new segment has been created and assigned to the product.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Card className="bg-white shadow-sm border-0">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-gray-800">Product Management</CardTitle>
          <CardDescription className="text-sm text-gray-500">Manage your product details and segment assignments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              <p className="text-lg font-semibold text-gray-800 mt-2">${product.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md space-y-3">
            <h3 className="text-sm font-medium text-gray-700">What would you like to do next?</h3>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={() => setIsEditDrawerOpen(true)}>
                <Edit className="mr-2 h-3 w-3" />
                Edit Details
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Tag className="mr-2 h-3 w-3" />
                    Assign Segments
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0">
                  <Command>
                    <CommandInput placeholder="Search segments..." className="h-9" />
                    <CommandEmpty>No segments found.</CommandEmpty>
                    <CommandGroup>
                      {segments.map((segment) => (
                        <CommandItem
                          key={segment.id}
                          onSelect={() => handleAssignSegment(segment.id)}
                          className="text-sm"
                        >
                          <Checkbox
                            checked={assignedSegments.includes(segment.id)}
                            onCheckedChange={() => handleAssignSegment(segment.id)}
                            className="mr-2 h-3 w-3"
                          />
                          {segment.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                  <Separator />
                  <Button
                    variant="ghost"
                    className="w-full h-9 text-xs justify-start font-normal"
                    onClick={() => setIsSegmentDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Create New Segment
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Assigned Segments</h3>
            <div className="flex flex-wrap gap-1">
              {assignedSegments.map((segmentId) => {
                const segment = segments.find(s => s.id === segmentId)
                return (
                  <Badge key={segmentId} variant="secondary" className="text-xs py-0 px-2">
                    {segment.name}
                  </Badge>
                )
              })}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Progress Tracker</h3>
            <div className="space-y-1">
              {Object.entries(progress).map(([key, value]) => (
                <div key={key} className="flex items-center text-xs">
                  <Check className={`mr-2 h-3 w-3 ${value ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={value ? 'text-green-700' : 'text-gray-500'}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Drawer open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
        <DrawerContent>
          <DrawerHeader className="border-b border-gray-100">
            <DrawerTitle className="text-lg font-semibold">Edit Product Details</DrawerTitle>
            <DrawerDescription className="text-sm text-gray-500">Make changes to your product here.</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm font-medium">Product Name</Label>
                <Input
                  id="name"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  className="h-24 text-sm resize-none"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="price" className="text-sm font-medium">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </ScrollArea>
          <DrawerFooter className="border-t border-gray-100">
            <Button size="sm" onClick={() => handleEditProduct(product)}>Save changes</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Dialog open={isSegmentDialogOpen} onOpenChange={setIsSegmentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Create New Segment</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">Add a new segment to assign to your products.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="segmentName" className="text-sm font-medium">Segment Name</Label>
              <Input
                id="segmentName"
                value={newSegment.name}
                onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="segmentDescription" className="text-sm font-medium">Description</Label>
              <Textarea
                id="segmentDescription"
                value={newSegment.description}
                onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                className="h-24 text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={handleCreateSegment}>Create Segment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}