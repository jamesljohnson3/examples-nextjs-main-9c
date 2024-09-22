/* eslint-disable @next/next/no-img-element */
'use client'


import {Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GET_PRODUCT_VERSIONS,} from '@/app/(shell)/(main)/queries';


import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Save } from 'lucide-react';

import { Button } from "@/components/ui/button";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



import {
  PlusIcon,
  MinusIcon,
  GripVertical,
  

  Image,
  FileImage,
} from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useCallback, useState, useEffect, ChangeEvent } from 'react';
import { useQuery, useMutation } from '@apollo/client'; 


import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GET_PRODUCT, SAVE_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS, UPDATE_SEGMENT } from '@/app/(shell)/(main)/queries';
import { DELETE_SEGMENT } from './mutations';
import axios from 'axios';


const RESERVED_FIELDS = new Set([
  'id', 'name', 'description', 'price', 'quantity', 'category', 'organizationId', 'createdById',
  'primaryPhoto', 'imageGallery', 'ogImage', 'metadata', 'createdAt', 'updatedAt', 'designConcepts',
  'aiSuggestions', 'Segment'
]);

interface FormField {
  id: string;
  type: string;
  label: string;
  options?: string[];
  value?: string | number;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  quantity: number;
  category: string;
  price?: number;
  primaryPhoto?: string;
  imageGallery?: string[];
  ogImage?: string;
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string;
  };

  [key: string]: any;
}
interface Segment {
  id: string;
  name: string;
  slug: string;
  post: { [key: string]: FormField };
}


const initialAvailableFields: FormField[] = [
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'description', type: 'textarea', label: 'Description' },
  { id: 'price', type: 'number', label: 'Price' },
  { id: 'quantity', type: 'number', label: 'Quantity' },
  { id: 'category', type: 'select', label: 'Category', options: ['Electronics', 'Clothing', 'Food'] },
];


interface Version {
  id: string;
  versionNumber: number;
  changes: string;
  data: any;
  createdAt: string;
}


const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';
const SEGMENT_ID = 'unique-segment-id';


const ImageUploadComponent: React.FC = () => {
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [downloadPrimaryPhotoLink, setDownloadPrimaryPhotoLink] = useState<string | null>(null);
  const [downloadOgLink, setDownloadOgLink] = useState<string | null>(null);

  const upload = async (file: File): Promise<string | null> => {
    const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1);
    const uuid = uuidv4();
    const fileName = `${uuid}-file.${fileExt}`;

    try {
      const { data } = await axios.post(`/api/uploader`, file, {
        headers: {
          'content-type': file.type,
          'x-filename': fileName,
        },
      });

      return data.url; // Return the download link
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>, type: 'primary' | 'og') => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const downloadLink = await upload(file);

      if (type === 'primary') {
        setPrimaryPhoto(imageUrl);
        setDownloadPrimaryPhotoLink(downloadLink);
      } else if (type === 'og') {
        setOgImage(imageUrl);
        setDownloadOgLink(downloadLink);
      }
    }
  };

  return (
    <>
      {/* Primary Photo Section */}
      <Accordion type="single" collapsible className="w-full space-y-2">
      <AccordionItem value="primary-photo">
        <AccordionTrigger className="text-sm font-semibold">Primary Photo</AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center space-x-2">
            {primaryPhoto ? (
              <div className="relative w-16 h-16">
                <img src={primaryPhoto} alt="Primary" className="w-full h-full object-cover rounded" />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-0 right-0 h-4 w-4 p-0"
                  onClick={() => {
                    setPrimaryPhoto(null);
                    setDownloadPrimaryPhotoLink(null);
                  }}
                >
                  <MinusIcon className="h-2 w-2" />
                </Button>
              </div>
            ) : (
              <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'primary')}
                  accept="image/*"
                />
                <Image className="h-6 w-6 text-muted-foreground" />
              </label>
            )}
          </div>
          {downloadPrimaryPhotoLink && (
            <a href={downloadPrimaryPhotoLink} target="_blank" rel="noopener noreferrer">
              Download Primary Photo
            </a>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* OG Image Section */}
      <AccordionItem value="og-image">
        <AccordionTrigger className="text-sm font-semibold">OG Image</AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center space-x-2">
            {ogImage ? (
              <div className="relative w-16 h-16">
                <img src={ogImage} alt="OG" className="w-full h-full object-cover rounded" />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-0 right-0 h-4 w-4 p-0"
                  onClick={() => {
                    setOgImage(null);
                    setDownloadOgLink(null);
                  }}
                >
                  <MinusIcon className="h-2 w-2" />
                </Button>
              </div>
            ) : (
              <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'og')}
                  accept="image/*"
                />
                <FileImage className="h-6 w-6 text-muted-foreground" />
              </label>
            )}
          </div>
          {downloadOgLink && (
            <a href={downloadOgLink} target="_blank" rel="noopener noreferrer">
              Download OG Image
            </a>
          )}
        </AccordionContent>
      </AccordionItem>
      </Accordion>
    </>
  );
};

export default ImageUploadComponent;