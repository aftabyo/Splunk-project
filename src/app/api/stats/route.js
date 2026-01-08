import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Use the full endpoint you already defined in Vercel
    const endpoint = process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT;
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    if (!endpoint || !token) {
      console.error("CONFIG ERROR: Missing Ingest Endpoint or Token");
      return NextResponse.json({ error: "Configuration Missing" }, { status: 500 });
    }

    const axiomPayload = [{ 
      ...body, 
      _time: new Date().toISOString(),
      platform: "vercel-production" 
    }];

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(axiomPayload),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error("AXIOM_REJECTION:", errorDetail);
      return NextResponse.json({ error: errorDetail }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("RUNTIME_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}