import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const endpoint = process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT;
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    // AXIOM REQUIRES AN ARRAY OF OBJECTS
    const axiomPayload = [{ 
      ...body, 
      _time: new Date().toISOString(),
      source: "nextjs-vercel" 
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
      const errorText = await response.text();
      console.error("AXIOM_REJECTED:", errorText);
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("VERCEL_RUNTIME_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Alive", message: "Log route is active." });
}