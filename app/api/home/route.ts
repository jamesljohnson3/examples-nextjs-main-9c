import { getHome, getImages, getPornhubVideos } from "@/actions/home";


import { NextRequest, NextResponse } from 'next/server';



export async function GET(request: NextRequest) {
  try {

    


    // Call locate only if rate limit check is successful
    const data = await getPornhubVideos();

    // Return the geolocation data as JSON response
    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error handling GET request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
