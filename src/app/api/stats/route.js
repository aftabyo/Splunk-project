import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataset = process.env.NEXT_PUBLIC_AXIOM_DATASET;
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    // This APL query pulls the latest events from Axiom
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

    // Mapping Axiom's internal data to your table's columns
    const events = (data.matches || []).map(m => ({
      _time: m._time,
      action: m.action || "interaction",
      details: m.details || "portfolio_item"
    }));

    // Grouping for the Heatmap / Stats tab
    const statsMap = {};
    events.forEach(e => {
      const key = e.details;
      statsMap[key] = (statsMap[key] || 0) + 1;
    });

    const statsArray = Object.keys(statsMap).map(name => ({
      name: name,
      value: statsMap[name]
    }));

    return NextResponse.json({
      stats: statsArray,
      audit: events
    });
  } catch (err) {
    console.error("STATS_FETCH_ERROR:", err.message);
    return NextResponse.json({ stats: [], audit: [] });
  }
}