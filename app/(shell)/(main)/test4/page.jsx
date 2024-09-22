"use client"

import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Image, FileImage, MinusIcon } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const ImageUploadComponent = () => {
  const [primaryPhoto, setPrimaryPhoto] = useState(null);
  const [ogImage, setOgImage] = useState(null);
  const [downloadPrimaryPhotoLink, setDownloadPrimaryPhotoLink] = useState(null);
  const [downloadOgLink, setDownloadOgLink] = useState(null);

  const upload = async (file) => {
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

  const handleImageUpload = async (event, type) => {
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
    <>          <Accordion type="single" collapsible className="w-full space-y-2">

      {/* Primary Photo Section */}
      <AccordionItem value="primary-photo">
        <AccordionTrigger className="text-sm font-semibold">Primary Photo</AccordionTrigger>
        <AccordionContent>
          <div className="flex items-center space-x-2">
            {downloadPrimaryPhotoLink ? (
              <div className="relative w-16 h-16">
                <img src={downloadPrimaryPhotoLink} alt="Primary" className="w-full h-full object-cover rounded" />
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
            {downloadOgLink ? (
              <div className="relative w-16 h-16">
                <img src={downloadOgLink} alt="OG" className="w-full h-full object-cover rounded" />
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
