import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataset = process.env.NEXT_PUBLIC_AXIOM_DATASET;
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    const res = await fetch(`https://api.axiom.co/v1/datasets/_apl?format=tabular`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apl: `['${dataset}'] | order by _time desc | limit 50` }),
    });

    const data = await res.json();
    
    // Check Vercel Logs for this if it's still empty!
    if (data.message) console.log("AXIOM_API_MESSAGE:", data.message);

    const events = (data.matches || []).map(m => ({
      _time: m._time,
      action: m.action || "hover",
      details: m.details || "item"
    }));

    return NextResponse.json({
      stats: events.map(e => ({ name: e.details, value: 1 })),
      audit: events
    });
  } catch (err) {
    return NextResponse.json({ stats: [], audit: [] });
  }
}