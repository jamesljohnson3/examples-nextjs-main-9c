'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Bell, Search, Sun, Moon, User, Settings, LogOut, Menu, BarChart2, Users, Box, Layers, Zap, Cpu, Globe, Database, Shield, ChevronDown } from 'lucide-react'

export default function ProductManagementHeader() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // In a real application, you would apply the theme change here
  }

  const MegaMenu = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2">
      {[
        { icon: Layers, title: "Products", description: "Manage listings" },
        { icon: Zap, title: "Analytics", description: "Track performance" },
        { icon: Users, title: "Customers", description: "Manage relations" },
        { icon: Cpu, title: "Inventory", description: "Control stock" },
        { icon: Globe, title: "Channels", description: "Multi-platform sales" },
        { icon: Database, title: "Orders", description: "Process efficiently" },
      ].map((item, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-2">
            <div className="flex items-center space-x-2">
              <item.icon className="h-4 w-4 text-primary" />
              <div>
                <h3 className="text-xs font-semibold">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-2 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold">Product Management</h1>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Features
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <MegaMenu />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-7 h-7 w-[150px] lg:w-[200px] text-xs"
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 relative">
                        <Bell className="h-3 w-3" />
                        <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-red-500 rounded-full"></span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-2">
                      <h4 className="text-xs font-medium mb-2">Notifications</h4>
                      <div className="space-y-1">
                        <p className="text-xs">New product added: Ergonomic Keyboard</p>
                        <p className="text-xs">Sales target reached for Q2</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="hidden md:flex items-center space-x-1">
              <Sun className="h-3 w-3" />
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
                className="h-4 w-7"
              />
              <Moon className="h-3 w-3" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 rounded-full p-0">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/placeholder.svg?height=28&width=28" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-xs">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@example.com</p>
                  </div>
                </div>
                <DropdownMenuItem className="text-xs">
                  <User className="mr-2 h-3 w-3" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs">
                  <Settings className="mr-2 h-3 w-3" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs text-red-600">
                  <LogOut className="mr-2 h-3 w-3" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="grid gap-2 py-2">
                  <div className="grid gap-1">
                    <Label htmlFor="mobile-search" className="text-xs">Search</Label>
                    <Input id="mobile-search" placeholder="Search..." className="h-7 text-xs" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-sm font-semibold">Features</h3>
                    <MegaMenu />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-2 py-2">
        <div className="grid grid-cols-3 gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card>
                  <CardContent className="flex items-center justify-between p-2">
                    <div className="flex items-center space-x-2">
                      <BarChart2 className="h-3 w-3 text-blue-500" />
                      <div>
                        <p className="text-xs font-medium">Sales</p>
                        <p className="text-sm font-bold">$24,502</p>
                      </div>
                    </div>
                    <span className="text-green-500 text-xs">+12%</span>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Total sales for the current period</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card>
                  <CardContent className="flex items-center justify-between p-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-3 w-3 text-green-500" />
                      <div>
                        <p className="text-xs font-medium">Users</p>
                        <p className="text-sm font-bold">1,429</p>
                      </div>
                    </div>
                    <span className="text-green-500 text-xs">+5%</span>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Active users in the last 30 days</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card>
                  <CardContent className="flex items-center justify-between p-2">
                    <div className="flex items-center space-x-2">
                      <Box className="h-3 w-3 text-purple-500" />
                      <div>
                        <p className="text-xs font-medium">Products</p>
                        <p className="text-sm font-bold">89</p>
                      </div>
                    </div>
                    <span className="text-red-500 text-xs">-2%</span>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Total active products in catalog</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  )
}