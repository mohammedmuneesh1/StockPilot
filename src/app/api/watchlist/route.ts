import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/better-auth/auth';
import {
  getWatchlistStatusByUserId,
  addToWatchlistByUserId,
  removeFromWatchlistByUserId,
  updateWatchlistAlertByUserId,
} from '@/lib/actions/watchlist.action';

async function getSessionUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

export async function GET(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const symbol = url.searchParams.get('symbol')?.toUpperCase().trim() || '';
  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  const isInWatchlist = await getWatchlistStatusByUserId(userId, symbol);
  return NextResponse.json({ isInWatchlist });
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const symbol = String(body.symbol || '').toUpperCase().trim();
    const company = String(body.company || '').trim();
    const alertThreshold = body.alertThreshold !== undefined ? Number(body.alertThreshold) : undefined;

    if (!symbol || !company) {
      return NextResponse.json({ error: 'Symbol and company are required' }, { status: 400 });
    }

    const success = await addToWatchlistByUserId(userId, symbol, company, alertThreshold);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('watchlist POST error', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const symbol = String(body.symbol || '').toUpperCase().trim();
    const rawThreshold = body.alertThreshold;
    const alertThreshold = rawThreshold === null || rawThreshold === '' ? null : Number(rawThreshold);

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    if (alertThreshold !== null && Number.isNaN(alertThreshold)) {
      return NextResponse.json({ error: 'Alert threshold must be a number' }, { status: 400 });
    }

    const success = await updateWatchlistAlertByUserId(userId, symbol, alertThreshold);
    return NextResponse.json({ success, alertThreshold });
  } catch (error) {
    console.error('watchlist PATCH error', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const symbol = url.searchParams.get('symbol')?.toUpperCase().trim() || '';
  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  const success = await removeFromWatchlistByUserId(userId, symbol);
  return NextResponse.json({ success });
}
