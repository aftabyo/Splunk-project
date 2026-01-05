import { NextResponse } from 'next/server';

export async function GET() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; 
  const auth = Buffer.from(`${process.env.SPLUNK_USERNAME}:${process.env.SPLUNK_PASSWORD}`).toString('base64');
  
  const chartQuery = 'search index="main" | stats count by details';
  const rawQuery = 'search index="main" | head 10 | table _time, action, details';

  try {
    // We must use POST for the export endpoint
    const [chartRes, rawRes] = await Promise.all([
      fetch(`${process.env.SPLUNK_MANAGEMENT_URL}/services/search/jobs/export?output_mode=json`, {
        method: 'POST',
        headers: { 
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          search: chartQuery,
          earliest_time: '0'
        })
      }),
      fetch(`${process.env.SPLUNK_MANAGEMENT_URL}/services/search/jobs/export?output_mode=json`, {
        method: 'POST',
        headers: { 
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          search: rawQuery,
          earliest_time: '0'
        })
      })
    ]);

    const chartText = await chartRes.text();
    const rawText = await rawRes.text();

    const parseSplunkData = (text) => {
      if (!text || text.trim() === "") return [];
      return text.trim().split('\n')
        .filter(line => line.startsWith('{'))
        .map(line => JSON.parse(line).result)
        .filter(r => r !== undefined);
    };

    const chartResults = parseSplunkData(chartText);
    const rawResults = parseSplunkData(rawText);

    return NextResponse.json({
      stats: chartResults.map(r => ({
        name: r.details || "Unknown_Event",
        value: parseInt(r.count) || 0
      })),
      audit: rawResults
    });

  } catch (error) {
    console.error("API_FETCH_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}