
"use client"
/* eslint-disable react/display-name */
import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Toaster, toast } from 'sonner';

import Uppy from '@uppy/core';
import { useUppy } from '@uppy/react';
import Transloadit from '@uppy/transloadit';

import '@uppy/core/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import '@uppy/drag-drop/dist/style.css';

const TRANSLOADIT_KEY = '5fbf6af63e0e445abcc83a050048a887';
const TEMPLATE_ID = '9e9d24fbce8146369ce9faab869bfba1';

// Define the interface for files with URLs
interface FileWithUrl {
  file: File | Blob; // Updated the type to accept both File and Blob
  url: string;
}

// Constant for burst size
const BURST_SIZE = 50 * 1024; // 50KB

// Function to handle HEIC files
const handleHEICFile = async (file: File | Blob, setProgress: React.Dispatch<React.SetStateAction<number>>) => {
  const fileChunks: Blob[] = [];

  // Split file into chunks
  for (let start = 0; start < file.size; start += BURST_SIZE) {
    const end = Math.min(start + BURST_SIZE, file.size);
    const chunk = file.slice(start, end);
    fileChunks.push(chunk);
  }

  // Upload chunks sequentially
  for (let i = 0; i < fileChunks.length; i++) {
    const chunk = fileChunks[i];

    const formData = new FormData();
    formData.append('file', chunk);

    try {
      const response = await axios.post(
        'https://v1api-unlimitednow.koyeb.app/convert-heic-to-jpeg',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percentCompleted);
            }
          },
        }
      );

      // Once the conversion is done, return the converted image URL
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error handling file chunk:', error);
      throw new Error('Failed to handle file chunk');
    }
  }

  throw new Error('No image URL obtained');
};

// Function to handle large files
const handleLargeFile = async (uppyInstance: Uppy, getImages: () => void, file: File | Blob) => {
  try {



    
    uppyInstance.on('complete', (result: any) => {
      console.log(result);
      getImages();

    });

    uppyInstance.use(Transloadit, {
      params: {
        auth: { key: TRANSLOADIT_KEY },
        template_id: TEMPLATE_ID,
      },
    });

    uppyInstance.on('transloadit:complete', (assembly: { results: { [x: string]: any; }; }) => {
      const files = assembly.results[':original'];
      console.log('Transloadit complete:', files);
      getImages();
    });

    uppyInstance.on('transloadit:error', (error: any) => {
      console.error(error);
    });

    await uppyInstance.upload();
    
  } catch (error) {
    console.error('Error handling large file:', error);
    toast.error('Error handling large file');
  }
  // Add your large file handling logic here
};

// Function to handle video files
const handleVideoFile = async (file: File | Blob) => {
  console.log("Handling video file:", file);

  
    
  // Add your video file handling logic here
};

// Function to upload file to backend
const uploadToBackend = async (file: File | Blob, originalFileName: string) => {
  const uploadFileName = `${uuidv4()}-${originalFileName}`;
  await axios.post('/api/uploader', file, {
    headers: {
      'content-type': file.type,
      'x-filename': uploadFileName,
    },
  });
  console.log(`File ${uploadFileName} uploaded successfully`);
};

// Higher-order function for file handling
const withFileHandling = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const [fileData, setFileData] = useState<File | Blob | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const uppyInstance = useUppy(() => new Uppy({ autoProceed: true }));

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      const file = files ? files[0] : null;
      setFileData(file);

      if (file) {
        const fileType = file.type;
        const fileSizeMB = file.size / (1024 * 1024);

        setLoading(true);
        try {
          let imageUrl = null;
        
          if (fileType === 'image/heic') {
            imageUrl = await handleHEICFile(file, setProgress);
          } else  if (fileSizeMB < 5) { // Check if file size is less than 5 MB

            await handleVideoFile(file);
          } else {
            await handleLargeFile(uppyInstance, () => {}, file);
          }
        
          // Upload to backend
          await uploadToBackend(file, file.name || `file-${uuidv4()}`);
        
          // Log converted image URL if available
          if (imageUrl) {
            console.log('Converted Image URL:', imageUrl);
          }
        } catch (error) {
          // Handle errors
          console.error('Error handling file:', error);
          toast.error('Error handling file');
        } finally {
          // Always set loading state to false after processing
          setLoading(false);
        }
        
      }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (fileData) {
        console.log('File Submitted:', fileData);
      }
    };

    return (
      <>
        <Toaster />
        <WrappedComponent
          handleFileChange={handleFileChange}
          handleSubmit={handleSubmit}
          fileData={fileData}
          loading={loading}
          progress={progress}
          {...props}
        />
      </>
    );
  };
};

export default withFileHandling;