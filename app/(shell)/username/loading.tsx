import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft } from 'lucide-react'

export default function InventoryManagementSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-white p-4 space-y-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>

        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={70}>
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  <AccordionItem value="product-details">
                    <AccordionTrigger className="text-sm font-semibold">Product Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <div className="flex space-x-4">
                          <Skeleton className="h-10 w-1/2" />
                          <Skeleton className="h-10 w-1/2" />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="images">
                    <AccordionTrigger className="text-sm font-semibold">Images</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <div className="flex items-center space-x-4">
                            <Skeleton className="w-24 h-24 rounded-md" />
                            <Skeleton className="h-9 w-24" />
                          </div>
                        </div>
                        <div>
                          <Skeleton className="h-4 w-16 mb-2" />
                          <div className="flex flex-wrap gap-4">
                            <Skeleton className="w-24 h-24 rounded-md" />
                            <Skeleton className="w-24 h-24 rounded-md" />
                            <Skeleton className="w-24 h-24 rounded-md" />
                            <Skeleton className="w-24 h-24 rounded-md" />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="metadata">
                    <AccordionTrigger className="text-sm font-semibold">Metadata</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={30}>
            <Card className="bg-white shadow-sm border border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Command Center</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>

                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <ScrollArea className="h-32 rounded-md border p-2">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </ScrollArea>
                  </div>

                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="w-full h-24 rounded-md" />
                      <Skeleton className="w-full h-24 rounded-md" />
                      <Skeleton className="w-full h-24 rounded-md" />
                      <Skeleton className="w-full h-24 rounded-md" />
                    </div>
                  </div>

                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <ScrollArea className="h-48 rounded-md border p-2">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>

        <div className="mt-6 flex justify-between">
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div className="space-x-2">
            <Skeleton className="h-9 w-24 inline-block" />
            <Skeleton className="h-9 w-32 inline-block" />
          </div>
        </div>
      </div>
    </div>
  )
}