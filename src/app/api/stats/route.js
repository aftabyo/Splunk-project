import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Get Secrets from Vercel Environment
    const dataset = process.env.NEXT_PUBLIC_AXIOM_DATASET || 'portfolio-logs';
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    if (!token) {
      return NextResponse.json({ error: 'Token missing', stats: [], audit: [] });
    }

    // 2. The URL Fix: We MUST use '?format=legacy' just like the Python script
    const url = "https://api.axiom.co/v1/datasets/_apl?format=legacy";

    // 3. The Query: Fetch last 100 events
    const query = `['${dataset}'] | sort by _time desc | limit 100`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apl: query }),
    });

    const data = await res.json();

    // 4. Parse the 'matches' array (legacy format)
    const logs = (data.matches || []).map(m => ({
      _time: m._time,
      action: m.action || "interaction",
      details: m.details || "unknown_item",
      // We send raw JSON so you can inspect it if needed
      raw: JSON.stringify(m)
    }));

    // 5. Return to Frontend
    return NextResponse.json({
      stats: logs.map(l => ({ name: l.details, value: 1 })),
      audit: logs
    });

  } catch (err) {
    console.error("STATS API ERROR:", err);
    return NextResponse.json({ stats: [], audit: [] });
  }
}