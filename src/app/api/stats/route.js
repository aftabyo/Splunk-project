import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataset = process.env.NEXT_PUBLIC_AXIOM_DATASET;
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    // This APL query pulls the last 50 events from Axiom
    const aplQuery = `['${dataset}'] | order by _time desc | limit 50`;

    const res = await fetch(`https://api.axiom.co/v1/datasets/_apl?format=tabular`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apl: aplQuery }),
    });

    const data = await res.json();

    // Mapping Axiom's response to your website's table format
    const events = (data.matches || []).map(entry => ({
      _time: entry._time,
      action: entry.action || "hover",
      details: entry.details || "unknown"
    }));

    // Grouping for the Heatmap/Stats
    const stats = events.reduce((acc, curr) => {
      const found = acc.find(item => item.name === curr.details);
      if (found) { found.value++; } 
      else { acc.push({ name: curr.details, value: 1 }); }
      return acc;
    }, []);

    return NextResponse.json({
      stats: stats,
      audit: events
    });

  } catch (error) {
    console.error("Query Error:", error.message);
    return NextResponse.json({ stats: [], audit: [] });
  }
}