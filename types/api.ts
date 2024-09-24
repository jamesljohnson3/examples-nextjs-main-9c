// types.ts

// Type for uploaded image in the gallery
export interface UploadedImage {
  id: string; // Unique identifier for the image
  url: string; // URL of the uploaded image
}

// Type for the expected response from the S3 upload
export interface UploadResponse {
  url: string; // The URL to access the uploaded file
}

// Type for the result of processing a Uppy file
export interface ProcessResult {
  success: boolean; // Indicates if the processing was successful
  message?: string; // Additional message or URL if successful
}

// Extend the UppyFile type from Uppy
import { UppyFile } from '@uppy/core';

// Make sure to include any custom properties you might be using
export interface CustomUppyFile extends UppyFile {
  uploadURL?: string; // Optional property to store the upload URL
  // Add other custom properties as needed
}





export interface Thumbnail {
    url: string
    width: number
    height: number
  }
  
  export interface Images {
    id: string
    width: number
    height: number
    url: string
    filename: string
    size: number
    type: string
    thumbnails: {
      small: Thumbnail
      large: Thumbnail
      full: Thumbnail
    }
  }
  
  export interface Fields {
    Name: string
    Images: Image[]
    Description: string
    Link: string
    Type: string
    Notes: string
    'In stock': boolean
    'Total units sold': number
    'Gross sales': number
    Created: string
  }
  
  export interface Record {
    id: string
    createdTime: string
    fields: Fields
  }
  
  export interface JsonData {
    records: Record[]
  }
  
  export interface Image {
    id: string;
    width: number;
    height: number;
    url: string;
    filename: string; 
    size: number;
    type: string;
    thumbnails: Thumbnails;  
  }
  
  export interface Thumbnails {
    small: SmallThumbnail;
    large: LargeThumbnail;
    full: FullThumbnail;
  }
  
  export interface SmallThumbnail {
    url: string;
    width: number; 
    height: number;
  }
  
  export interface LargeThumbnail {
    url: string;
    width: number;
    height: number; 
  }
  
  export interface FullThumbnail {
    url: string;
    width: number;
    height: number;   
  }
  
  export interface ProductFields {
    id: string | undefined; 
    name: string | undefined;
    images: Image[] | undefined;
    description: string | undefined;
    link: string | undefined;
    type: string | undefined;
    notes: string | undefined;
    inStock: boolean | undefined;
    totalUnitsSold: number | undefined;
    grossSales: number | undefined;
    created: string | undefined;
    exteriorColor: string | undefined; 
    price: number | undefined; // Added price property  
    url: string | undefined;
  }
  
  
  export interface Product {
    fields: ProductFields;   
  }
  
  export interface ArticleFields {
    id: string;
    thumbnail: string;
    banner: string;   
    author: string;
    subtitle: string;
    description: string;
    post: string;
    price: number;
    date: string;
    sections: Section[];  
  }
  
  
  export interface Record {
    id: string;
    thumbnail: string;
    banner: string;
    author: string;
    subtitle: string;
    description: string;
    post: string;
    price: number;
    date: string;
    sections: Section[];
  }
  
  export interface Section {
    title: string;
    content: string;
  }
  export interface Article {
    fields: ArticleFields;
  }
  
  
  export interface Props {
    product: ProductFields | null | undefined;
  }
  export interface Attachment {
    id: string;
    width: number;
    height: number;
    url: string;
    filename: string;
    size: number;
    type: string;
    thumbnails: {
      small: { url: string; width: number; height: number };
      large: { url: string; width: number; height: number };
      full: { url: string; width: number; height: number };
    };
  }
  export interface Attachment {
    id: string;
    width: number;
    height: number;
    url: string;
    filename: string;
    size: number;
    type: string;
    thumbnails: {
      small: { url: string; width: number; height: number };
      large: { url: string; width: number; height: number };
      full: { url: string; width: number; height: number };
    };
  }
  
  export interface VehicleRecord {
    preview: string
    name: string
    id: string;
    createdTime: string;
    fields: {
      Attachments: Attachment[];
      Drivetrain: string;
      Notes: string;
      "Body type": string;
      "Vehicle details 1": string;
      "Exterior Color": string;
      Name: string;
      Engine: string;
      "Vehicle details 2": string;
      Created: string;
      preview?: string; // Add preview property here
    };
  }
  
  export interface AirtableApiResponse {
    records: VehicleRecord[];
  }
  export interface Data {
    records: VehicleRecord[];
  }
  