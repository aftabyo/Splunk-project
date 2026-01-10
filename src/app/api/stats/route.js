import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataset = process.env.NEXT_PUBLIC_AXIOM_DATASET;
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    // Direct APL query to Axiom
    const res = await fetch(`https://api.axiom.co/v1/datasets/_apl?format=tabular`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apl: `['${dataset}'] | order by _time desc | limit 50` }),
    });

    const data = await res.json();
    
    // Axiom returns results in 'matches'
    const logs = (data.matches || []).map(m => ({
      _time: m._time,
      action: m.action || 'hover',
      details: m.details || 'interaction'
    }));

    return NextResponse.json({
      stats: logs.map(l => ({ name: l.details, value: 1 })),
      audit: logs
    });
  } catch (err) {
    return NextResponse.json({ stats: [], audit: [] });
  }
}