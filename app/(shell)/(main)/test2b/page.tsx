
"use client"
import React, { useState, useEffect } from 'react';
import Uppy, { UppyFile } from '@uppy/core';
import Transloadit from '@uppy/transloadit';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from "@/components/ui/button";
import { PlusIcon, MinusIcon } from "lucide-react";

// Define a type for media files
interface MediaFile {
  id: string;
  url: string;
}

// Simulated query for media files
const useSimulatedQuery = () => {
  const [data, setData] = useState<MediaFile[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setData([
        { id: '1', url: 'https://via.placeholder.com/150' },
        { id: '2', url: 'https://via.placeholder.com/150' },
      ]);
    }, 1000);
  }, []);

  const refetch = () => {
    setData([]);
    setTimeout(() => {
      setData([
        { id: '1', url: 'https://via.placeholder.com/150' },
        { id: '2', url: 'https://via.placeholder.com/150' },
        { id: '3', url: 'https://via.placeholder.com/150' }, // Simulated new file after upload
      ]);
    }, 1000);
  };

  return { data, refetch };
};

const TRANSLOADIT_KEY = '5fbf6af63e0e445abcc83a050048a887';
const TEMPLATE_ID = '9e9d24fbce8146369ce9faab869bfba1';

// Initialize Uppy instance
const uppyInstance = new Uppy({
  autoProceed: false,
  restrictions: {
    maxNumberOfFiles: 20,
    allowedFileTypes: ['image/*'],
  },
}).use(Transloadit, {
  params: {
    auth: { key: TRANSLOADIT_KEY },
    template_id: TEMPLATE_ID,
  },
});

// Main component
const MediaUpload: React.FC = () => {
  const [files, setFiles] = useState<UppyFile[]>([]);
  const { data, refetch } = useSimulatedQuery();

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
    }
  };

  const handleDeleteFile = (fileId: string) => {
    uppyInstance.removeFile(fileId);
    setFiles(uppyInstance.getFiles());
  };

  const handleReorderFiles = (result: any) => {
    if (!result.destination) return;

    const reorderedFiles = Array.from(files);
    const [movedFile] = reorderedFiles.splice(result.source.index, 1);
    reorderedFiles.splice(result.destination.index, 0, movedFile);
    setFiles(reorderedFiles);
  };

  const handleUpload = async () => {
    const result = await uppyInstance.upload();
    if (result.failed.length > 0) {
      console.error('Upload failed:', result.failed);
    } else {
      console.log('Upload successful:', result.successful);
      refetch(); // Refresh the simulated data after upload
    }
  };

  return (
    <div className="upload-container">
      {/* File input button */}
      <Button onClick={() => document.getElementById('file-input')?.click()}>
        Select Files
      </Button>
      <input
        type="file"
        id="file-input"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />

      <DragDropContext onDragEnd={handleReorderFiles}>
        <Droppable droppableId="fileList">
          {(provided) => (
            <div
              className="file-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {files.map((file, index) => (
                <Draggable key={file.id} draggableId={file.id} index={index}>
                  {(provided) => (
                    <div
                      className="file-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <img src={file.preview} alt={file.name} className="thumbnail" />
                      <span>{file.name}</span>
                      <Button onClick={() => handleDeleteFile(file.id)}>
                        <MinusIcon />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {/* Display simulated data as draggable items */}
              {data.map((media) => (
                <Draggable key={media.id} draggableId={media.id} index={files.length + data.indexOf(media)}>
                  {(provided) => (
                    <div
                      className="file-item"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <img src={media.url} alt={`Media ${media.id}`} className="thumbnail" />
                      <span>Media {media.id}</span>
                      <Button onClick={() => console.log(`Delete media ${media.id}`)}>
                        <MinusIcon />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button onClick={handleUpload}>Upload Files</Button>
    </div>
  );
};

export default MediaUpload;
