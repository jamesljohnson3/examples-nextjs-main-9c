
"use client"
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon } from "lucide-react";
import Uppy from '@uppy/core';
import Transloadit from '@uppy/transloadit';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useQuery } from '@apollo/client';
import { GET_PRODUCT, GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN } from '@/app/(shell)/(main)/queries';
import React, { useState, useEffect } from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';

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

const ImageUploader = () => {
  const [imageGallery, setImageGallery] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: productDataQuery, loading: loadingProduct } = useQuery(GET_PRODUCT, {
    variables: { productId: PRODUCT_ID }
  });
  const { data: segmentsData, loading: loadingSegments } = useQuery(GET_SEGMENTS_BY_PRODUCT_AND_DOMAIN, {
    variables: { productId: PRODUCT_ID, domainId: DOMAIN_ID }
  });

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('imageGallery')) || [];
    setImageGallery(storedImages);
  }, []);

  useEffect(() => {
    if (productDataQuery) {
      console.log("Product Data:", JSON.stringify(productDataQuery, null, 2));
    }
    if (segmentsData) {
      console.log("Segments Data:", JSON.stringify(segmentsData, null, 2));
    }
  }, [productDataQuery, segmentsData]);

  const handleFileInput = (event) => {
    const selectedFiles = Array.from(event.target.files);
    for (const file of selectedFiles) {
      uppyInstance.addFile({ name: file.name, type: file.type, data: file });
    }
  };

  const saveImage = async (file) => {
    const uploadedUrl = file.uploadURL; // Get URL from Transloadit
    setImageGallery((prev) => [...prev, { id: file.id, url: uploadedUrl }]);
  };

  useEffect(() => {
    uppyInstance.on('complete', async (result) => {
      const uploadedImages = result.successful;
      for (const file of uploadedImages) {
        await saveImage(file);
      }
    });

    return () => {
      uppyInstance.close();
    };
  }, []);

  const handleRemoveImage = (id) => {
    setImageGallery((prev) => prev.filter((image) => image.id !== id));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedImages = Array.from(imageGallery);
    const [movedImage] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, movedImage);
    setImageGallery(reorderedImages);
  };

  const handleSaveOrder = () => {
    localStorage.setItem('imageGallery', JSON.stringify(imageGallery));
    alert('Image order saved!');
  };

  if (loadingProduct || loadingSegments) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        {isUploading && <div>Uploading...</div>}
        <input type="file" multiple onChange={handleFileInput} accept="image/*" />
        <Button onClick={handleSaveOrder}>Save Order</Button>
      </div>

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
