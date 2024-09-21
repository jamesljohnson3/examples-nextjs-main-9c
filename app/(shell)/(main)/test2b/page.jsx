
"use client"
import React, { useEffect, useState } from 'react';
import Uppy from '@uppy/core';
import { StatusBar, DragDrop } from '@uppy/react';
import Transloadit from '@uppy/transloadit';
import '@uppy/core/dist/style.css';
import '@uppy/status-bar/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import { RadioGroup } from '@headlessui/react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';

const CDNURL = "https://hjhncoqotxlxpvrljjgz.supabase.co/storage/v1/object/public/images/";
const TRANSLOADIT_KEY = '5fbf6af63e0e445abcc83a050048a887';
const TEMPLATE_ID = '9e9d24fbce8146369ce9faab869bfba1';

const deliveryMethods = [
  { id: 1, title: 'Standard', turnaround: '4–10 business days', price: '$5.00' },
  { id: 2, title: 'Express', turnaround: '2–5 business days', price: '$16.00' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Initialize Uppy instance outside the component
const uppyInstance = new Uppy({
  autoProceed: true,
}).use(Transloadit, {
  params: {
    auth: { key: TRANSLOADIT_KEY },
    template_id: TEMPLATE_ID,
  },
});

// Event listener for Uppy complete event
uppyInstance.on('complete', (result) => {
  console.log(result);
});

uppyInstance.on('transloadit:complete', (assembly) => {
  const files = assembly.results[':original'];
  // Handle the uploaded files (in state or otherwise)
  console.log('Uploaded Files:', files);
});

uppyInstance.on('transloadit:error', (error) => {
  console.error(error);
});

const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState();
  const [images, setImages] = useState([]);

  // Extract URL params
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role');
  const project = urlParams.get('projects');
  const campaign = urlParams.get('campaign');
  const assetId = urlParams.get('assetId');

  console.log('Role:', role);
  console.log('Project:', project);
  console.log('Campaign:', campaign);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update uploadedFiles state with the files
      const files = uppyInstance.getFiles();
      setUploadedFiles(files);

      const response = await fetch('api/my-api-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          result: files,
          assetId,
          name: nameOnCard,
          role,
          project,
          campaign,
          deliverymethod: selectedDeliveryMethod,
          event_type: 'update',
          userId: 'teestig',
          type: 'collections',
        }),
      });

      if (response.ok) {
        console.log('Data posted to API successfully');
        // Reload after 2.5 seconds to avoid premature reload
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      } else {
        throw new Error('Error posting data to API');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="p-10">
        <DragDrop uppy={uppyInstance} />
        <form className="needs-validation" onSubmit={handleFormSubmit}>
          <div className="transloadit-drop-area">
            <div id="upload-progress-bar"></div>
          </div>

          <div className="mt-10 border-t border-gray-200 pt-10">
            <div className="col-span-4">
              <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">
                Enter new title
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name"
                  onChange={(e) => setNameOnCard(e.currentTarget.value)}
                  name="name-on-card"
                  className="mt-2 block w-full rounded-xl border-2 border-muted-3 bg-transparent px-4 py-2.5 font-semibold text-heading placeholder:text-text/50 focus:border-primary focus:outline-none focus:ring-0 sm:text-sm"
                />
              </div>
            </div>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <Button type="submit">Add Collection</Button>

              <button
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                type="submit"
              >
                Distribute
              </button>

              <a
                href="https://spaces.unlimitpotential.com/edit"
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </a>
            </div>
          </div>
        </form>
        <StatusBar uppy={uppyInstance} />
      </div>
    </>
  );
};

export default Upload;
