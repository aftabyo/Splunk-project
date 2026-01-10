import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // HARDCODED FOR DIAGNOSTIC TEST
    // We are bypassing process.env to eliminate Vercel sync issues
    const dataset = 'portfolio-logs';
    const token = 'xaat-bd9de253-4f75-428e-a743-2859ccb0019f'; 

    console.log("DIAGNOSTIC: Using Hardcoded Token...");

    const res = await fetch(`https://api.axiom.co/v1/datasets/_apl?format=tabular`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      // Simple query to get the last 100 events
      body: JSON.stringify({ apl: `['${dataset}'] | sort by _time desc | limit 100` }),
    });

    const data = await res.json();

    // IF AXIOM RETURNS AN ERROR, WE WILL SEE IT NOW
    if (data.message) {
      console.error("AXIOM_ERROR:", data.message);
      return NextResponse.json({ error: data.message, stats: [], audit: [] });
    }

    const matches = data.matches || [];

    // Map Axiom data to your UI format
    const events = matches.map(m => ({
      _time: m._time,
      action: m.action || "interaction",
      details: m.details || "portfolio_event",
      _raw: JSON.stringify(m)
    }));

    return NextResponse.json({
      stats: events.map(e => ({ name: e.details, value: 1 })),
      audit: events
    });

  } catch (err) {
    console.error("CRASH:", err.message);
    return NextResponse.json({ stats: [], audit: [] });
  }
}