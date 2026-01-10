import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataset = process.env.NEXT_PUBLIC_AXIOM_DATASET;
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    // Simplest possible query: "Give me everything"
    const aplQuery = `['${dataset}'] | limit 100`;

    const res = await fetch(`https://api.axiom.co/v1/datasets/_apl?format=tabular`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apl: aplQuery }),
    });

    const data = await res.json();
    
    // Check your Vercel logs for this output!
    console.log("AXIOM_RAW_DATA:", JSON.stringify(data));

    const events = (data.matches || []).map(m => ({
      _time: m._time || new Date().toISOString(),
      action: m.action || "interaction",
      details: m.details || "portfolio_item"
    }));

    return NextResponse.json({
      stats: events.map(e => ({ name: e.details, value: 1 })),
      audit: events
    });
  } catch (err) {
    console.error("STATS_API_CRASH:", err.message);
    return NextResponse.json({ stats: [], audit: [] });
  }
}