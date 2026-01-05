import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const splunkPayload = {
      event: { 
        ...body, 
        project: "aftabyo-portfolio",
        visitor_ip: request.headers.get('x-forwarded-for') || '127.0.0.1'
      },
      sourcetype: "portfolio_event",
      index: "main" 
    };

    await fetch(process.env.SPLUNK_HEC_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Splunk ${process.env.SPLUNK_HEC_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(splunkPayload),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("HEC Error:", error);
    return NextResponse.json({ error: 'Logging Failed' }, { status: 500 });
  }
}