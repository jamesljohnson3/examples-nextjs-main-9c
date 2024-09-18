'use client'

import React, { useState, useEffect, memo, useCallback } from 'react';

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
import { useQuery, useMutation } from '@apollo/client'; 
import { GET_PRODUCT, SAVE_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, UPDATE_PRODUCT_VERSION, PUBLISH_SEGMENTS, UPDATE_SEGMENT } from '@/app/(shell)/(main)/queries';
import { v4 as uuidv4 } from 'uuid';
 import { DELETE_SEGMENT } from './mutations';
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

 
 const ImageGalleryUploader = () => {
   // State to manage the main product image and the gallery images
   const [mainImage, setMainImage] = useState(null);
   const [galleryImages, setGalleryImages] = useState([]);
 
   // Handle uploading of the main product image
   const handleMainImageChange = (event) => {
     const file = event.target.files[0];
     if (file) {
       const imageURL = URL.createObjectURL(file);
       setMainImage(imageURL);
     }
   };
 
   // Handle uploading of gallery images
   const handleGalleryImageChange = (event) => {
     const files = Array.from(event.target.files);
     const newImages = files.map((file) => ({
       id: URL.createObjectURL(file), // Using URL as unique key for this example
       url: URL.createObjectURL(file),
     }));
     setGalleryImages((prev) => [...prev, ...newImages]);
   };
 
   // Handle removal of an image from the gallery
   const removeGalleryImage = (id) => {
     setGalleryImages((prev) => prev.filter((image) => image.id !== id));
   };
 
   // Handle drag-and-drop reordering of images in the gallery
   const handleDragEnd = (result) => {
     if (!result.destination) return;
 
     const reorderedImages = Array.from(galleryImages);
     const [movedImage] = reorderedImages.splice(result.source.index, 1);
     reorderedImages.splice(result.destination.index, 0, movedImage);
     setGalleryImages(reorderedImages);
   };
 
   return (
     <div style={{ padding: '20px' }}>
       <h2>Product Image Uploader</h2>
 
       {/* Upload Main Product Image */}
       <div style={{ marginBottom: '20px' }}>
         <label>Main Product Image: </label>
         <input type="file" accept="image/*" onChange={handleMainImageChange} />
         {mainImage && (
           <div style={{ marginTop: '10px' }}>
             <img src={mainImage} alt="Main Product" style={{ width: '200px', height: '200px' }} />
             <button onClick={() => setMainImage(null)} style={{ marginLeft: '10px' }}>
               Remove
             </button>
           </div>
         )}
       </div>
 
       {/* Upload Gallery Images */}
       <div style={{ marginBottom: '20px' }}>
         <label>Gallery Images: </label>
         <input type="file" accept="image/*" multiple onChange={handleGalleryImageChange} />
       </div>
 
       {/* Gallery Display with Drag and Drop */}
       <DragDropContext onDragEnd={handleDragEnd}>
         <Droppable droppableId="gallery">
           {(provided) => (
             <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'flex', gap: '10px' }}>
               {galleryImages.map((image, index) => (
                 <Draggable key={image.id} draggableId={image.id} index={index}>
                   {(provided) => (
                     <div
                       ref={provided.innerRef}
                       {...provided.draggableProps}
                       {...provided.dragHandleProps}
                       style={{
                         ...provided.draggableProps.style,
                         display: 'inline-block',
                         position: 'relative',
                       }}
                     >
                       <img src={image.url} alt={`Gallery ${index}`} style={{ width: '100px', height: '100px' }} />
                       <button
                         onClick={() => removeGalleryImage(image.id)}
                         style={{
                           position: 'absolute',
                           top: '0',
                           right: '0',
                           background: 'red',
                           color: 'white',
                           border: 'none',
                         }}
                       >
                         X
                       </button>
                     </div>
                   )}
                 </Draggable>
               ))}
               {provided.placeholder}
             </div>
           )}
         </Droppable>
       </DragDropContext>
     </div>
   );
 };
 
 export default ImageGalleryUploader;
 