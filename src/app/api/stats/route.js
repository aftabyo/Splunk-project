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
      body: JSON.stringify({ apl: `['${dataset}'] | limit 10` }),
    });

    const data = await res.json();
    
    // CHECK VERCEL LOGS FOR THIS:
    console.log("FULL_AXIOM_RESPONSE:", JSON.stringify(data));

    if (data.error || data.message === "Forbidden") {
      console.error("AXIOM_PERMISSION_DENIED: Your token cannot query data.");
    }

    return NextResponse.json({
      stats: (data.matches || []).map(m => ({ name: m.details, value: 1 })),
      audit: data.matches || []
    });
  } catch (err) {
    return NextResponse.json({ stats: [], audit: [] });
  }
}