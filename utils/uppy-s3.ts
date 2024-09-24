import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { UploadedImage, UploadResponse, ProcessResult } from '@/types/api'; // Import the necessary types
import { UppyFile } from '@uppy/core';
// Utility function to process uploaded files
export const processUppyFile = async (file: UppyFile): Promise<ProcessResult> => {
  const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1); // Extract file extension
  const uuid = uuidv4(); // Generate a unique ID
  const fileName = `${uuid}-file.${fileExt}`; // Create a new filename with UUID and extension

  try {
    // Make a POST request to the uploader endpoint
    const { data }: { data: UploadResponse } = await axios.post(`/api/uploader`, file, {
      headers: {
        'content-type': file.type || '', // Set content type based on file type, ensuring it defaults to an empty string if undefined
        'x-filename': fileName, // Set custom filename in headers
      },
    });

    return { success: true, message: data.url }; // Return success and URL
  } catch (error: unknown) {
    // Using type guard to narrow down the error type
    if (axios.isAxiosError(error)) {
      // This is an Axios error
      console.error('Axios error:', error.message);
      return { success: false, message: error.message }; // Return the error message from Axios
    } else if (error instanceof Error) {
      // This is a generic JavaScript error
      console.error('Error:', error.message);
      return { success: false, message: error.message }; // Return the error message
    } else {
      console.error('Unexpected error:', error);
      return { success: false, message: 'Unknown error occurred' }; // Fallback for unknown errors
    }
  }
};
