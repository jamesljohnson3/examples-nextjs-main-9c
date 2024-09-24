import { getSegmentData } from '@/actions/home';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Extract userId from the query string
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validate that userId exists
    if (!userId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    // Fetch segment data using the provided userId
    const data = await getSegmentData({ userId });

    // Return the fetched data as JSON response
    return new NextResponse(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error handling GET request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
