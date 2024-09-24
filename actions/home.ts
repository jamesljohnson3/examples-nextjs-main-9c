import 'server-only';
// File: actions/home.ts
export async function getSegmentData({ userId }: { userId: string }) {
  // Example of fetching user segment data from a database or external API
  const segments = [
    {
      userId: userId,
      segment: {
        id: "segment123",
        name: "Tech Enthusiasts",
        product: {
          name: "Smartphone X",
          description: "Latest model with AI features",
          price: 999.99,
          quantity: 10,
          category: "Electronics",
          createdById: "user123",
          organizationId: "org456",
          imageGallery: [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg"
          ],
          metadata: {
            title: "Smartphone X",
            description: "An advanced smartphone for tech lovers.",
            keywords: "smartphone, AI, tech"
          }
        }
      }
    },
    // Add more segments based on userId...
  ];

  return segments;
}

// Define the structure of a single Pornhub video
export interface PornhubVideo {
  link: string;
  id: string;
  title: string;
  image: string;
  duration: string;
  views: string;
  video: string;
}

// Pornhub API response structure
export interface PornhubResponse {
  success: boolean;
  data: PornhubVideo[];
}

export interface VideoData {
  title: string;
  id: string;
  image: string;
  duration: string;
  views: string;
  rating?: string;
  uploaded?: string;
  upvoted?: string;
  downvoted?: string;
  models?: string[];
  tags?: string[];
}


// XVideos API response structure
export interface XVideosResponse {
  success: boolean;
  data: VideoData;
  source: string;
  assets: string[];
}

// YouPorn API response structure
export interface YouPornResponse {
  success: boolean;
  data: VideoData;
  source: string;
  assets: string[];
}
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));



export async function getHome(): Promise<XVideosResponse | null> {
  await delay(2000); // 2-second delay
  try {
    const response = await fetch('https://lust.scathach.id/xvideos/random');
    if (!response.ok) {
      throw new Error(`Failed to fetch home data: ${response.statusText}`);
    }
    const data: XVideosResponse = await response.json();
    console.log('xvideosData:', data);
    return data || null;
  } catch (error) {
    console.error('Error fetching home data:', error);
    return null;
  }
}

export async function getImages(): Promise<YouPornResponse | null> {
  await delay(5000); // 2-second delay

  try {
    const response = await fetch('https://lust.scathach.id/youporn/random', { next: { revalidate: 60 } });
    if (!response.ok) {
      throw new Error(`Failed to fetch images data: ${response.statusText}`);
    }
    const data: YouPornResponse = await response.json();
    console.log('youpornData:', data);
    return data || null;
  } catch (error) {
    console.error('Error fetching images data:', error);
    return null;
  }
}
export async function getPornhubVideos(): Promise<PornhubResponse | null> {
  await delay(9000); // 2-second delay

  try {
    const response = await fetch('https://lust.scathach.id/pornhub/search?key=ebony');
    if (!response.ok) {
      throw new Error(`Failed to fetch Pornhub data: ${response.statusText}`);
    }
    const data: PornhubResponse = await response.json();
    console.log('pornhubData:', data);
    return data || null;
  } catch (error) {
    console.error('Error fetching Pornhub data:', error);
    return null;
  }
}
