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
import React, { useCallback, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client'; 


import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GET_PRODUCT, SAVE_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS, UPDATE_SEGMENT } from '@/app/(shell)/(main)/queries';
import { DELETE_SEGMENT } from './mutations';
import axios from 'axios';

 

const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';
const SEGMENT_ID = 'unique-segment-id';

const ImageUploader  = () => {
  

  const [previewFile, setPreviewFile] = useState(null);
  const [primaryPhoto, setPrimaryPhoto] = useState(null);
  const [ogImage, setOgImage] = useState(null);
  const [downloadPrimaryPhotoLink, setDownloadPrimaryPhotoLink] = useState(null);
  const [downloadOgLink, setDownloadOgLink] = useState(null);

  const upload = async (file, setLink) => {
    const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1);
    const uuid = uuidv4(); // Generate a UUID
    const fileName = `${uuid}-file.${fileExt}`; // Append UUID to the image name

    try {
      const { data } = await axios.post(`/api/uploader`, file, {
        headers: {
          'content-type': file.type,
          'x-filename': fileName,
        },
      });

      // Construct the download link
      const downloadLink = `${data.url}`;
      setLink(downloadLink);
    } catch (err) {
      console.error(err);
    }

    setPreviewFile(null);
  };

  const handleImageUpload = (event, type) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === 'primary') {
        upload(file, setDownloadPrimaryPhotoLink);
        setPrimaryPhoto(imageUrl);
      } else if (type === 'og') {
        upload(file, setDownloadOgLink);
        setOgImage(imageUrl);
      }
    }
  };

  return (
    <>
      {/* Primary Photo Section */}
      <AccordionItem value="primary-photo">
        <AccordionTrigger className="text-sm font-semibold">
          Primary Photo
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center space-x-2">
            {primaryPhoto ? (
              <div className="relative w-16 h-16">
                <img
                  src={primaryPhoto}
                  alt="Primary"
                  className="w-full h-full object-cover rounded"
                />
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
        </AccordionContent>
      </AccordionItem>

      {/* OG Image Section */}
      <AccordionItem value="og-image">
        <AccordionTrigger className="text-sm font-semibold">
          OG Image
        </AccordionTrigger>
        <AccordionContent>
          <Card>
            <CardContent className="p-2 space-y-2">
              <div className="flex items-center space-x-2">
                {ogImage ? (
                  <div className="w-16 h-16 relative">
                    <img
                      src={ogImage}
                      alt="OG"
                      className="w-full h-full object-cover rounded"
                    />
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
                <span className="text-xs text-muted-foreground">
                  Set Open Graph image for social sharing
                </span>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </>
  );
}; 
export default ImageUploader;
