import { NextResponse } from 'next/server';

// ADD THIS LINE HERE:
// This tells Node.js to trust the self-signed certificate from your local machine/ngrok.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; 

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

    // Use your new ngrok URL here if you haven't updated your Vercel .env yet
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