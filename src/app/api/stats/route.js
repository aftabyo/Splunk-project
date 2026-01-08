import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataset = process.env.NEXT_PUBLIC_AXIOM_DATASET;
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    if (!dataset || !token) {
      return NextResponse.json({ stats: [], audit: [] });
    }

    const chartQuery = `['${dataset}'] | summarize count() by details`;

    const res = await fetch(`https://api.axiom.co/v1/datasets/_apl?format=tabular`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apl: chartQuery }),
    });

    if (!res.ok) {
      // If Axiom fails, return empty arrays so the UI doesn't break
      return NextResponse.json({ stats: [], audit: [] });
    }

    const data = await res.json();
    return NextResponse.json({
      stats: (data.matches || []).map(r => ({
        name: r.details || "Unknown",
        value: r['count()'] || 0
      })),
      audit: data.matches || []
    });

  } catch (error) {
    console.error("STATS_ROUTE_ERROR:", error.message);
    return NextResponse.json({ stats: [], audit: [] });
  }
}