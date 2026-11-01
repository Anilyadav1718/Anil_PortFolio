import { NextResponse } from 'next/server';
import { getPortfolioData } from '@/lib/db';

export const revalidate = 0; // Dynamic on request
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to load content' }, { status: 500 });
  }
}

