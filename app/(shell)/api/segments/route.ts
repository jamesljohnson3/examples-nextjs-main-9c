import { getSegmentData } from "@/actions/home";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const segmentId = searchParams.get("segmentId");

    // Validate userId and segmentId
    if (!userId || !segmentId) {
      return new Response('Missing userId or segmentId', { status: 400 });
    }

    // Fetch user segment data
    const data = await getSegmentData({ userId, segmentId });

    // Return the segment data as JSON response
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
