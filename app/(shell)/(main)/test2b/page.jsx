
"use client"
import React, { useEffect, useState } from 'react';
import Uppy from '@uppy/core';
import { StatusBar, DragDrop } from '@uppy/react';
import Transloadit from '@uppy/transloadit';
import '@uppy/core/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import { Button } from '@/components/ui/button';

const CDNURL = "https://hjhncoqotxlxpvrljjgz.supabase.co/storage/v1/object/public/images/";
const TRANSLOADIT_KEY = '5fbf6af63e0e445abcc83a050048a887';
const TEMPLATE_ID = '9e9d24fbce8146369ce9faab869bfba1';

// Initialize Uppy outside the component
const uppyInstance = new Uppy({
  autoProceed: false, // Set to false so you can control when the upload starts
}).use(Transloadit, {
  params: {
    auth: { key: TRANSLOADIT_KEY },
    template_id: TEMPLATE_ID,
  },
});

// Custom Event Listener for Uppy
uppyInstance.on('file-added', (file) => {
  console.log('File added:', file);
});

uppyInstance.on('upload', (data) => {
  console.log('Upload started:', data);
});

uppyInstance.on('upload-success', (file, response) => {
  console.log('Upload success:', file, response);
});

uppyInstance.on('complete', (result) => {
  console.log('Upload complete! Files:', result.successful);
});

const CustomUploadUI = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Handle file upload event
  const handleFileInput = (event) => {
    const selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      uppyInstance.addFile({
        name: selectedFiles[i].name,
        type: selectedFiles[i].type,
        data: selectedFiles[i],
      });
    }
    setFiles(uppyInstance.getFiles());
  };

  // Start uploading files
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

  return (
    <div className="upload-container">
      {/* Custom File Input */}
      <div className="custom-file-input">
        <label htmlFor="file-input" className="upload-label">
          Choose files
        </label>
        <input
          id="file-input"
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Display Selected Files */}
      <div className="file-list">
        {files.map((file) => (
          <div key={file.id} className="file-item">
            <span>{file.name}</span>
          </div>
        ))}
      </div>

      {/* Custom Upload Buttons */}
      <div className="upload-actions">
        <button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Start Upload'}
        </button>
        <button onClick={handleCancel} disabled={files.length === 0}>
          Cancel Upload
        </button>
      </div>

      {/* Custom Progress Bar */}
      {isUploading && (
        <div className="upload-progress">
          <progress value={progress} max="100"></progress>
        </div>
      )}
    </div>
  );
};

export default CustomUploadUI;