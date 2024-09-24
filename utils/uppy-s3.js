import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Function to download a file from a given URL
export const downloadFileFromUrl = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'blob' });
    const fileName = url.split('/').pop(); // Extract file name from URL
    const file = new File([response.data], fileName, {
      type: response.headers['content-type'],
    });
    return { file, success: true };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, message: error.message || 'Unknown error' };
  }
};

// Function to upload a file to S3
export const uploadFileToS3 = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;

  try {
    const response = await axios.post('/api/uploader', file, {
      headers: {
        'Content-Type': file.type,
        'x-filename': fileName,
      },
    });
    return { url: response.data.url, success: true };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return { success: false, message: error.message || 'Unknown error' };
  }
};
