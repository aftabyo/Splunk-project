import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataset = process.env.NEXT_PUBLIC_AXIOM_DATASET;
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    if (!dataset || !token) {
      console.error("STATS_ERROR: Missing Env Variables");
      return NextResponse.json({ stats: [], audit: [] });
    }

    // APL query to get the raw events
    const query = `['${dataset}'] | order by _time desc | limit 100`;

    const res = await fetch(`https://api.axiom.co/v1/datasets/_apl?format=tabular`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apl: query }),
    });

    const result = await res.json();
    
    // Axiom returns data in the 'matches' array
    const rawMatches = result.matches || [];

    // 1. Format the 'Audit' table logs
    const auditLogs = rawMatches.map(m => ({
      _time: m._time || new Date().toISOString(),
      action: m.action || "interaction",
      details: m.details || "portfolio_event"
    }));

    // 2. Format the 'Stats' heatmap
    const counts = {};
    auditLogs.forEach(log => {
      counts[log.details] = (counts[log.details] || 0) + 1;
    });
    const statsData = Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));

    return NextResponse.json({
      stats: statsData,
      audit: auditLogs
    });

  } catch (error) {
    console.error("API_STATS_CRASH:", error.message);
    return NextResponse.json({ stats: [], audit: [] });
  }
}