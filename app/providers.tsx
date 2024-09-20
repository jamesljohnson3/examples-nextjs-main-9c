'use client'
import React from 'react';
import { PropsWithChildren } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
 
// Define the Providers component
export const Providers = ({ children }: PropsWithChildren) => {

  
  return (     
    
 
  <TooltipProvider>{children}</TooltipProvider> 
    
  );
}