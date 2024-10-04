import React, { useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'

export default function MobileResponsiveAppLayoutLoadingSkeleton() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Header */}
      <header className="bg-white py-2 px-4 rounded-b-2xl shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Skeleton className="h-8 w-32" />
          </div>
          <div className="flex space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>

      <div className="flex-grow flex flex-col md:flex-row p-4 space-y-4 md:space-y-0 md:space-x-4">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white p-4 rounded-2xl shadow-sm`}>
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow bg-white p-6 rounded-2xl shadow-sm">
          <div className="max-w-7xl mx-auto">
            {/* Action Components */}
            <div className="flex justify-end mb-6">
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>

            {/* Sub Header */}
            <div className="mb-6">
              <Skeleton className="h-8 w-full md:w-1/2" />
            </div>

            {/* Main Content Inner */}
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
              {/* Two-thirds column */}
              <div className="w-full md:w-2/3 space-y-4">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>

              {/* One-third column */}
              <div className="w-full md:w-1/3 space-y-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}