import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataset = process.env.NEXT_PUBLIC_AXIOM_DATASET;
    const token = process.env.NEXT_PUBLIC_AXIOM_TOKEN;

    // Simplest possible query to just get raw rows
    const res = await fetch(`https://api.axiom.co/v1/datasets/_apl?format=tabular`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apl: `['${dataset}'] | take 50` }),
    });

    const data = await res.json();
    
    // If Axiom returns an error message instead of data, we catch it here
    if (data.message || data.error) {
       console.error("AXIOM_API_ERROR:", data.message || data.error);
    }

    const matches = data.matches || [];

    return NextResponse.json({
      stats: matches.map(m => ({ name: m.details || 'hover', value: 1 })),
      audit: matches
    });
  } catch (err) {
    return NextResponse.json({ stats: [], audit: [] });
  }
}