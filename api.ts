import type { AirtableApiResponse, VehicleRecord } from '@/types/api';

const apiBaseUrl = process.env.AIRTABLE_API_BASE_URL || 'https://api.airtable.com/v0/appWP7hhHaQEEsFgt/website';
const apiKey = process.env.AIRTABLE_API_KEY || 'pattFc8Nai9AFjhyr.ee7053e223767b630e24d52ba0829d2fdb896fc40778c5f3a0f63bdc1771e2c9';

const api = {
  list: async (): Promise<VehicleRecord[]> => {
    const response = await fetch(`${apiBaseUrl}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    const data: AirtableApiResponse = await response.json();
    return data.records;
  },
  fetch: async (id: string): Promise<VehicleRecord | undefined> => {
    try {
      const response = await fetch(`${apiBaseUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch vehicle with id ${id}`);
      }
  
      const data: { fields: Partial<VehicleRecord['fields']> } = await response.json();
      const { Attachments, Notes, Name } = data.fields;
  
      // Extracting preview from Attachments and other fields
      const preview = Attachments && Attachments.length > 0 ? Attachments[0].url : '';
      // Assuming Name is the name field you want
      const name = Name || '';
  
      // Constructing the fields object with all properties
      const fields: VehicleRecord['fields'] = {
        Attachments: Attachments || [],
        Drivetrain: '', // Add your logic to populate this field
        Notes: Notes || '',
        "Body type": '', // Add your logic to populate this field
        "Vehicle details 1": '', // Add your logic to populate this field
        "Exterior Color": '', // Add your logic to populate this field
        Name: name,
        Engine: '', // Add your logic to populate this field
        "Vehicle details 2": '', // Add your logic to populate this field
        Created: '', // Add your logic to populate this field
        preview: preview || undefined,
      };
  
      return { id, createdTime: '', preview: '', name: '', fields };
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      return undefined;
    }
  },
  
  
  
  cache: {
    get: async (id: string): Promise<VehicleRecord | null> => {
      // Implement caching logic using the API if needed
      return null;
    },
    set: async (products: VehicleRecord[]): Promise<void> => {
      // Implement caching logic using the API if needed
    },
  },
};

export default api;
