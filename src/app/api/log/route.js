import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // DEBUG: This will show up in your Vercel 'Logs' tab
    console.log("DEBUG: Attempting to send to dataset:", process.env.NEXT_PUBLIC_AXIOM_DATASET);
    console.log("DEBUG: Token exists:", !!process.env.NEXT_PUBLIC_AXIOM_TOKEN);

    const axiomPayload = [{ ...body, _time: new Date().toISOString() }];

    const response = await fetch(`https://api.axiom.co/v1/datasets/${process.env.NEXT_PUBLIC_AXIOM_DATASET}/ingest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AXIOM_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(axiomPayload),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error("AXIOM REJECTED DATA:", errorDetail);
      return NextResponse.json({ error: errorDetail }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CRITICAL_SERVER_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}