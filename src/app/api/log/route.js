import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Axiom expects an array of objects for ingestion
    const axiomPayload = [{
      ...body,
      project: "aftabyo-portfolio",
      visitor_ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
      _time: new Date().toISOString()
    }];

    // Axiom Ingest URL format: https://api.axiom.co/v1/datasets/{dataset_name}/ingest
    const response = await fetch(`https://api.axiom.co/v1/datasets/${process.env.NEXT_PUBLIC_AXIOM_DATASET}/ingest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AXIOM_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(axiomPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Axiom Ingest Failed: ${errorText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Axiom Ingest Error:", error);
    return NextResponse.json({ error: 'Logging Failed' }, { status: 500 });
  }
}