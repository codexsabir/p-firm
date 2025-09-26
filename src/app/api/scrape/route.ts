import { NextRequest, NextResponse } from 'next/server';

// Proxy route to avoid CORS from client -> webhook.
// POST /api/scrape { city: string }
export async function POST(req: NextRequest) {
  try {
    const { city } = await req.json();
    if (!city) {
      return NextResponse.json({ error:'City is required' }, { status:400 });
    }

    // Call your external webhook
    const webhookUrl = process.env.SCRAPE_WEBHOOK_URL || 'http://localhost:5678/webhook-test/scrap-firms';

    const res = await fetch(webhookUrl, {
      method:'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ city })
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error:'Webhook failed', details:text }, { status:res.status });
    }

    const data = await res.json();
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('Error in /api/scrape:', err);
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status:500 });
  }
}