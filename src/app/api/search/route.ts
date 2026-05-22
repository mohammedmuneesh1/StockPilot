import { NextResponse } from 'next/server'
import { searchStocks } from '@/lib/actions/finhub.actions'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const q = url.searchParams.get('q') ?? ''
    const results = await searchStocks(q)
    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ results: [] })
  }
}
