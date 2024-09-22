
"use client"
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import Uppy, { UploadedUppyFile, UppyFile } from '@uppy/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN } from '@/app/(shell)/(main)/queries';
import React, { useState, useEffect } from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import Transloadit from '@uppy/transloadit';

const TRANSLOADIT_KEY = '5fbf6af63e0e445abcc83a050048a887';
const TEMPLATE_ID = '9e9d24fbce8146369ce9faab869bfba1';
const PRODUCT_ID = "cm14mvs2o000fue6yh6hb13yn";
const DOMAIN_ID = 'cm14mvs4l000jue6y5eo3ngku';

const uppyInstance = new Uppy({
  autoProceed: true,
  restrictions: { maxNumberOfFiles: 20, allowedFileTypes: ['image/*'] },
}).use(Transloadit, {
  params: {
    auth: { key: TRANSLOADIT_KEY },
    template_id: TEMPLATE_ID,
  },
});

interface Image {
  id: string;
  url: string;
}

const ImageUploader: React.FC = () => {
  const [imageGallery, setImageGallery] = useState<Image[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<UppyFile<Record<string, unknown>, Record<string, unknown>>[]>([]);
  const [hasUnsavedImageGalleryChanges, setHasUnsavedImageGalleryChanges] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: productDataQuery, loading: loadingProduct } = useQuery(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID }
  });

  const { data: segmentsData, loading: loadingSegments } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID }
  });

  // Load product and segments data into state
  useEffect(() => {
    if (productDataQuery) {
      console.log("Product Data:", JSON.stringify(productDataQuery, null, 2));
    }
    if (segmentsData) {
      console.log("Segments Data:", JSON.stringify(segmentsData, null, 2));
    }
  }, [productDataQuery, segmentsData]);

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('imageGallery') || '[]') as Image[];
    setImageGallery(storedImages);
  }, []);

  // Handle adding files to Uppy
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        uppyInstance.addFile({
          name: selectedFiles[i].name,
          type: selectedFiles[i].type,
          data: selectedFiles[i],
        });
      }
      setFiles(uppyInstance.getFiles());
      setHasUnsavedImageGalleryChanges(true);
    }
  };

  // Remove duplicates utility function
  const removeDuplicates = (gallery: Image[]) => {
    const seen = new Set();
    return gallery.filter(image => {
      if (!image.url || seen.has(image.url)) {  // Ensure valid URL and no duplicates
        return false;
      }
      seen.add(image.url);
      return true;
    });
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
  const saveImage = async (file: UploadedUppyFile<Record<string, unknown>, Record<string, unknown>>) => {
    const uploadedUrl = file.uploadURL;
    
    if (uploadedUrl) { // Ensure valid upload URL
      setImageGallery((prev) => {
        const newGallery = [...prev, { id: uuidv4(), url: uploadedUrl }];
        return removeDuplicates(newGallery); // Remove duplicates after adding
      });
      setHasUnsavedImageGalleryChanges(true);
    }
  };

  // Handle Uppy events and completion
  useEffect(() => {
    uppyInstance.on('upload', () => {
      setIsUploading(true);
    });

    uppyInstance.on('upload-progress', (file, progress) => {
      setUploadProgress(progress.percentage);
    });

    uppyInstance.on('upload-success', (file, response) => {
      if (file) { // Ensure 'file' is not undefined
        const uploadedUrl = response.body.url; // Ensure URL exists
        if (uploadedUrl) {
          setImageGallery((prev) => {
            const newGallery = [...prev, { id: file.id, url: uploadedUrl }];
            return removeDuplicates(newGallery); // Ensure no duplicates are added
          });
          setUploadProgress(0);
        }
      }
    });
    
    uppyInstance.on('complete', async (result) => {
      const uploadedImages = result.successful;
      
      // Filter out any empty or invalid image objects
      const validImages = uploadedImages.filter(file => file.uploadURL);
      
      for (const file of validImages) {
        await saveImage(file); // Save each image and ensure no duplicates
      }
      setIsUploading(false);
    });

    return () => {
      uppyInstance.close(); // Cleanup Uppy instance on unmount
    };
  }, []);

  // Handle removing image from gallery
  const handleRemoveImage = (id: string) => {
    setImageGallery((prev) => prev.filter((image) => image.id !== id));
    setHasUnsavedImageGalleryChanges(true);
  };

  // Handle drag-and-drop reordering of images
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedImages = Array.from(imageGallery);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setImageGallery(reorderedImages);
    setHasUnsavedImageGalleryChanges(true);
  };

  // Save image order to localStorage
  const handleSaveOrder = () => {
    localStorage.setItem('imageGallery', JSON.stringify(imageGallery));
    setHasUnsavedImageGalleryChanges(false);
    alert('Image order saved!');
  };

  // Handle additional gallery image upload
  const handleGalleryImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileInput(event);
  };

  if (loadingProduct || loadingSegments) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        {isUploading && <div>Uploading...</div>}
        {isUploading && (
          <div className="progress-bar">
            <div className="progress" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}

        <Button onClick={handleSaveOrder}>Save Order</Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="gallery">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-2">
              {imageGallery
                .filter(image => image.url) // Only show images with a valid URL
                .map((image, index) => (
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
                          onClick={() => handleRemoveImage(image.id)}
                          className="absolute top-0 right-0"
                        >
                          <MinusIcon />
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
              <label className="w-16 h-16 flex items-center justify-center bg-muted rounded cursor-pointer">
                <input type="file" className="hidden" onChange={handleGalleryImageUpload} accept="image/*" multiple />
                <PlusIcon className="h-6 w-6 text-muted-foreground" />
              </label>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button onClick={handleUpload} disabled={isUploading}>Upload Files</Button>
      <Button onClick={handleCancel} disabled={!isUploading}>Cancel Upload</Button>
    </div>
  );
};

export default ImageUploader;
