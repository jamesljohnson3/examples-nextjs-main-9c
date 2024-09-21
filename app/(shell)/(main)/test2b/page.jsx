
"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  PlusIcon,
  MinusIcon,
  GripVertical,
  ImageIcon,
  EyeIcon,
  BarChart3Icon,
  Sliders,
  MessageSquare,
  ChevronLeft,
  Save,
  Upload,
  Image,
  FileImage,
  X,
} from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { GitBranch } from 'lucide-react';
import React, { useState, useEffect, memo, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client'; 
import { GET_PRODUCT, SAVE_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS, UPDATE_SEGMENT, GET_PRODUCT_VERSIONS } from '@/app/(shell)/(main)/queries';
import { v4 as uuidv4 } from 'uuid';
 import { DELETE_SEGMENT } from './mutations';
 import Uppy, { UploadedUppyFile, UppyFile } from '@uppy/core';
 import { DragDrop, StatusBar } from '@uppy/react';
 import Transloadit from '@uppy/transloadit';
 import '@uppy/core/dist/style.css';
 import '@uppy/status-bar/dist/style.css';
 import '@uppy/drag-drop/dist/style.css';

// Transloadit credentials
const TRANSLOADIT_KEY = '5fbf6af63e0e445abcc83a050048a887';
const TEMPLATE_ID = '9e9d24fbce8146369ce9faab869bfba1';
const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';
  // Initialize Uppy with Transloadit for uploads
  const uppyInstance = new Uppy({
    autoProceed: true,
    restrictions: { maxNumberOfFiles: 20, allowedFileTypes: ['image/*'] },
  }).use(Transloadit, {
    params: {
      auth: { key: TRANSLOADIT_KEY },
      template_id: TEMPLATE_ID,
    },
  });

const ImageUploader = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imageGallery, setImageGallery] = useState([]);
  const [primaryPhoto, setPrimaryPhoto] = useState<string | null>(null);
  const [ogImage, setOgImage] = useStat(null);
  const [metadata, setMetadata] = useState({ title: '', description: '', keywords: '' });

  // Apollo queries
  const { data: productDataQuery, loading: loadingProduct } = useQuery(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID }
  });
  const { data: segmentsData, loading: loadingSegments } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID }
  });


  // Handle adding files to Uppy
  const handleFileInput = (event) => {
    const selectedFiles = Array.from(event.target.files);
    for (const file of selectedFiles) {
      uppyInstance.addFile({ name: file.name, type: file.type, data: file });
    }
    setFiles(uppyInstance.getFiles());
  };

  // Trigger file upload
  const handleUpload = () => {
    setIsUploading(true);
    uppyInstance.upload().then((result) => {
      if (result.failed.length > 0) {
        console.error('Failed uploads:', result.failed);
      } else {
        console.log('Upload successful:', result.successful);
      }
      setIsUploading(false);
    });
  };

  // Cancel all uploads
  const handleCancel = () => {
    uppyInstance.cancelAll();
    setFiles([]);
  };

  // Save uploaded image to backend or state (simulating database save here)
  const saveImage = async (file) => {
    const uploadedUrl = file.uploadURL; // Get URL from Transloadit
    setImageGallery((prev) => [...prev, { id: uuidv4(), url: uploadedUrl }]); // Save to gallery
  };

  // Handle Uppy completion
  useEffect(() => {
    uppyInstance.on('complete', async (result) => {
      const uploadedImages = result.successful;
      for (const file of uploadedImages) {
        await saveImage(file); // Save each image
      }
    });

    return () => {
      uppyInstance.close(); // Cleanup Uppy instance on unmount
    };
  }, []);

  // Handle gallery image upload manually (when user selects files)
  const handleGalleryImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file),
      url: URL.createObjectURL(file),
    }));
    setImageGallery((prev) => [...prev, ...newImages]);
  };

  // Handle removing image from gallery
  const handleRemoveImage = (id) => {
    setImageGallery((prev) => prev.filter((image) => image.id !== id));
  };

  // Handle drag-and-drop reordering of images
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedImages = Array.from(imageGallery);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setImageGallery(reorderedImages);
  };

  if (loadingProduct || loadingSegments) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        {/* Upload progress */}
        {isUploading && <div>Uploading... {progress}%</div>}
        {/* Upload input */}
        <input type="file" multiple onChange={handleFileInput} accept="image/*" />
        <button onClick={handleUpload}>Upload</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>

      {/* Gallery Section */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-2">
              {imageGallery.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative w-16 h-16"
                    >
                      <img src={image.url} alt={`Gallery ${index}`} className="w-full h-full object-cover rounded" />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-0 right-0 h-4 w-4 p-0"
                        onClick={() => handleRemoveImage(image.id)}
                      >
                        <MinusIcon className="h-2 w-2" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {/* Add new image */}
              <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                <input type="file" className="hidden" onChange={handleFileInput} accept="image/*" multiple />
                <PlusIcon className="h-6 w-6 text-muted-foreground" />
              </label>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ImageUploader;
