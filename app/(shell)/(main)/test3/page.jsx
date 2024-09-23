import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { BarChart, ChevronLeft, Bell, Book, Box, Globe, LayoutDashboard, LogOut, Plus, Search, Settings, User } from 'lucide-react'

import api from "@/api";
import { deleteVehiclebyId } from '@/actions/dashboard';
import Link from 'next/link';


const getStartedItems = [
  { href:'/test2', title: 'Create New Product', description: 'Add a new product to your inventory', icon: Plus },
  { href:'/admin/settings', title: 'Update Settings', description: 'Configure your store preferences', icon: Settings },
]

const previewProducts = [
  { id: 1, name: 'Wireless Earbuds', price: '$99.99', image: '/placeholder.svg?height=200&width=200&text=Earbuds' },
  { id: 2, name: 'Smart Watch', price: '$199.99', image: '/placeholder.svg?height=200&width=200&text=Watch' },
  { id: 3, name: 'Ergonomic Chair', price: '$299.99', image: '/placeholder.svg?height=200&width=200&text=Chair' },
  { id: 4, name: 'Laptop Stand', price: '$49.99', image: '/placeholder.svg?height=200&width=200&text=Laptop+Stand' },
  { id: 5, name: 'Wireless Mouse', price: '$39.99', image: '/placeholder.svg?height=200&width=200&text=Mouse' },
  { id: 6, name: 'Mechanical Keyboard', price: '$129.99', image: '/placeholder.svg?height=200&width=200&text=Keyboard' },
]

const documentationSections = [
  { title: 'Getting Started', content: 'Learn the basics of setting up your dashboard and navigating the interface.' },
  { title: 'Product Management', content: 'Detailed guide on adding, editing, and managing your product catalog.' },
  { title: 'Order Processing', content: 'Step-by-step instructions for handling customer orders from receipt to shipment.' },
  { title: 'Analytics', content: 'How to interpret and leverage your store\'s performance data for growth.' },
  { title: 'User Management', content: 'Managing user accounts, roles, and permissions within your organization.' },
  { title: 'API Documentation', content: 'Technical details for integrating our platform with your existing systems.' },
]

export default function UpdatedDashboard() {
  return (
    <div className="min-h-screen bg-white flex flex-col ">
      <header className="p-4">
      <div className="flex items-center justify-between mb-4">
    <div className="flex items-center space-x-2">
     <Link href={'/'}>
     <div className="text-muted-foreground">Dashboard / Product List</div>

     </Link>
    </div>
    <div className="flex items-center space-x-2">
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
  </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <section>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Domain Preview</CardTitle>
              <CardDescription>
                View how your e-commerce site appears to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white border rounded-lg p-4 shadow-inner">
                <div className="flex items-center space-x-2 mb-4">
                  <Globe className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">www.yourstore.com</span>
                </div>
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-500">Site preview would be displayed here</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Open Live Site
              </Button>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Quick Actions</CardTitle>
              <CardDescription>
                Manage your store efficiently with these quick actions
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {getStartedItems.map((item, index) => (
              <Link key={index} href={item.href} >
              <Button  variant="outline" className="h-auto flex flex-col items-start space-y-2 p-4 shadow-sm hover:shadow-md transition-shadow">
                  <item.icon className="h-6 w-6 text-blue-500" />
                  <div className="text-sm font-semibold text-gray-700">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                  
                </Button>
              </Link>  
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Product Gallery Preview</CardTitle>
              <CardDescription>
                A snapshot of your current product offerings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {previewProducts.map((product) => (
                  <Card key={product.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-2">
                      <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-md mb-2" />
                      <h3 className="text-sm font-semibold text-gray-700 truncate">{product.name}</h3>
                      <p className="text-xs text-gray-500">{product.price}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
            <Link href={'/'}>

              <Button variant="outline" className="w-full">
                View All Products
              </Button>
              </Link>
            </CardFooter>
            
          </Card>
        </section>

        <section>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Documentation</CardTitle>
              <CardDescription>
                Comprehensive guides to help you make the most of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                {documentationSections.map((section, index) => (
                  <div key={index} className="mb-8">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">{section.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{section.content}</p>
                    <Button variant="outline" size="sm">
                      <Book className="mr-2 h-4 w-4" />
                      Read Full Guide
                    </Button>
                    {index < documentationSections.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t mt-8">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between text-sm text-gray-500">
          <div>© 2024 Your Company. All rights reserved.</div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}