"use client"
import * as React from 'react'

import ThemeToggle from "./theme-toggle";


import Link from "next/link"

import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

async function UserOrLogin( ) {


  
 
  return (
    <>
    <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>  

Space

</React.Suspense>

    </>
  )
}
export default function Header() {
 
  const pathname = usePathname();

  return (
    <>
    <header className="flex sticky top-0 z-10 shrink-0 h-8 items-center border-b  dark:bg-black/65 bg-white/50  bg-gradient-to-b from-background/20 via-background/50 to-background/80 backdrop-blur-xl justify-end">
 
      <div className="px-4 flex items-center">
        <UserOrLogin />
   
        <div className="w-full hidden md:block">
          <div className="" role="group">
   
   
          <Tabs defaultValue={pathname} className="absolute top-0 left-12 ml-6 ">
          <TabsList>
            <TabsTrigger value={"/me"} asChild>
              <Link href={"/me"}>Home</Link>
            </TabsTrigger>
            <TabsTrigger value={"/"} asChild>
              <Link href={"/"}>Chat</Link>
            </TabsTrigger>
            <TabsTrigger value={"/workflows"} asChild>
              <Link href={"/workflows"}>Flows</Link>
            </TabsTrigger>
            <TabsTrigger value={"/search"} asChild>
              <Link href={"/search"}>Content</Link>
            </TabsTrigger>
            <TabsTrigger value={"/overview"} asChild>
              <Link href={"/overview"}>Spaces</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
          
          </div>
        </div>   Space
      </div>     <div className="hidden md:block">    <ThemeToggle />

</div>
  <div className={cn("p-5 block sm:!hidden")}>
  Space      </div>
    </header>
  </>
  );
} 
