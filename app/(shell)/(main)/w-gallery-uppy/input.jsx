// src/components/FileInput.js

import React from 'react';

const FileInput = ({ handleFileChange, handleSubmit, fileData }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <label>File:</label>
      <input
        type="file"
        name="file"
        onChange={handleFileChange}
      />
    </div>
    {fileData && (
      <div>
        <p>Selected File: {fileData.name}</p>
      </div>
    )}
    <button type="submit">Submit</button>
  </form>
);

export default FileInput;
