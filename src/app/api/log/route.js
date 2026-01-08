import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const endpoint = process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT;
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    const axiomPayload = [{ 
      ...body, 
      _time: new Date().toISOString() 
    }];

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(axiomPayload),
    });

    return NextResponse.json({ success: response.ok });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}