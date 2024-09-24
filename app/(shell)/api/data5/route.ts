
export const dynamic = 'force-dynamic'; // defaults to auto
// File: app/api/data5/segments/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // Sample dynamic data based on userId (Replace with your actual logic to fetch data)
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
      // You can add more segments based on userId
  ];

  return new Response(JSON.stringify(segments), {
      headers: { 'Content-Type': 'application/json' }
  });
}
