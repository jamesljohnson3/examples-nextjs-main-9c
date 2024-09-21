
"use client"
/* eslint-disable react/display-name */
// hocs/withFileHandling.js

import React, { useState } from 'react';

const handleHEICFile = (file) => {
  console.log("Handling HEIC file:", file);
  // Add your HEIC file handling logic here
};

const handleLargeFile = (file) => {
  console.log("Handling large file (> 5MB):", file);
  // Add your large file handling logic here
};

const handleVideoFile = (file) => {
  console.log("Handling video file:", file);
  // Add your video file handling logic here
};

const withFileHandling = (WrappedComponent) => {
  return (props) => {
    const [fileData, setFileData] = useState(null);

    const handleFileChange = (event) => {
      const { files } = event.target;
      const file = files[0];
      setFileData(file);

      if (file) {
        const fileType = file.type;
        const fileSizeMB = file.size / (1024 * 1024);

        if (fileType === 'image/heic') {
          handleHEICFile(file);
        } else if (fileSizeMB > 5) {
          handleLargeFile(file);
        } else if (fileType.startsWith('video/')) {
          handleVideoFile(file);
        }
      }
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      if (fileData) {
        console.log('File Submitted:', fileData);
      }
    };

    return (
      <WrappedComponent
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        fileData={fileData}
        {...props}
      />
    );
  };
};

export default withFileHandling;

