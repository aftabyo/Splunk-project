import { NextResponse } from 'next/server';

export async function GET() {
  // APL Query equivalents for your SPL searches
  const dataset = process.env.NEXT_PUBLIC_AXIOM_DATASET;
  const chartQuery = `['${dataset}'] | summarize count() by details`;
  const rawQuery = `['${dataset}'] | order by _time desc | take 10 | project _time, action, details`;

  try {
    const fetchAxiom = async (apl) => {
      const res = await fetch(`https://api.axiom.co/v1/datasets/_apl?format=tabular`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AXIOM_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apl })
      });
      return res.json();
    };

    const [chartData, rawData] = await Promise.all([
      fetchAxiom(chartQuery),
      fetchAxiom(rawQuery)
    ]);

    return NextResponse.json({
      stats: (chartData.matches || []).map(r => ({
        name: r.details || "Unknown_Event",
        value: r['count()'] || 0
      })),
      audit: rawData.matches || []
    });

  } catch (error) {
    console.error("AXIOM_STATS_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}