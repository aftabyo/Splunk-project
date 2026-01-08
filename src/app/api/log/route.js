import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: "Alive", 
    message: "The API route is correctly placed and accessible!",
    timestamp: new Date().toISOString()
  });
}

export async function POST(request) {
  console.log("!!! INCOMING LOG REQUEST RECEIVED !!!");
  try {
    const body = await request.json();
    const endpoint = process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT;
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    if (!endpoint || !token) {
      console.error("FAIL: Environment variables missing.");
      return NextResponse.json({ error: "Missing Config" }, { status: 500 });
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ ...body, _time: new Date().toISOString() }]),
    });

    console.log("Axiom Response Status:", res.status);
    return NextResponse.json({ success: res.ok });
  } catch (err) {
    console.error("ROUTE_ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}