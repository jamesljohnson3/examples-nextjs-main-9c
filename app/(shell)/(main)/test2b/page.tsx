// src/App.js
"use client"

import React from 'react';
import withFileHandling from './file';
import FileInput from './input';

const EnhancedFileInput = withFileHandling(FileInput);

const App = () => {
  return (
    <div className="App">
      <h1>File Input Form with HOC</h1>
      <EnhancedFileInput />
    </div>
  );
};

export default App;
