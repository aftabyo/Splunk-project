import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataset = process.env.NEXT_PUBLIC_AXIOM_DATASET;
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    // Pull the latest 50 events using APL
    const query = `['${dataset}'] | order by _time desc | limit 50`;

    const res = await fetch(`https://api.axiom.co/v1/datasets/_apl?format=tabular`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apl: query }),
    });

    const data = await res.json();

    // MAP AXIOM DATA TO YOUR TABLE FIELDS
    const events = (data.matches || []).map(m => ({
      _time: m._time || new Date().toISOString(),
      action: m.action || "hover",
      details: m.details || "item_interacted"
    }));

    // Generate stats for your heatmap
    const statsMap = {};
    events.forEach(e => {
      statsMap[e.details] = (statsMap[e.details] || 0) + 1;
    });

    const statsArray = Object.keys(statsMap).map(name => ({
      name,
      value: statsMap[name]
    }));

    return NextResponse.json({
      stats: statsArray,
      audit: events
    });
  } catch (err) {
    return NextResponse.json({ stats: [], audit: [] });
  }
}