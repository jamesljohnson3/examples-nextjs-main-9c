
"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { BarChart3Icon, ChevronLeft, Globe, MessageSquare, Search, User } from 'lucide-react';
import api from "@/api";
import type { VehicleRecord } from '@/types/api';
import { deleteVehiclebyId } from '@/actions/dashboard';
import Link from 'next/link';





const AdvancedOptions: React.FC = () => {
 
  

  return (

<div className="gap-4">

<Card>
            <CardHeader>
              <CardTitle className="text-xs">Segments / Home</CardTitle>
            </CardHeader>
            <CardContent>
          
            </CardContent>

          </Card>
       
       <Card>
       <CardHeader>
         <CardTitle className="text-xs">Segments / Contact Us</CardTitle>
       </CardHeader>
       <CardContent>
     
       </CardContent>

     </Card>
</div>
       
       
       
  );
};

export default AdvancedOptions;
