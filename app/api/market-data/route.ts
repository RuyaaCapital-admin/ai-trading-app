import { NextRequest, NextResponse } from 'next/server';

const EODHD_API_KEY = process.env.EODHD_API_KEY;
const BASE_URL = 'https://eodhd.com/api';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const symbol = searchParams.get('symbol') || 'AAPL.US';
  const type = searchParams.get('type') || 'eod'; // eod, intraday, real-time

  if (!EODHD_API_KEY) {
    return NextResponse.json({ error: 'EODHD API key not configured' }, { status: 500 });
  }

  try {
    let url = '';
    
    switch (type) {
      case 'eod':
        // End of day data
        url = `${BASE_URL}/eod/${symbol}?api_token=${EODHD_API_KEY}&fmt=json&period=d&from=2024-01-01`;
        break;
      case 'intraday':
        // Intraday data (1 minute intervals)
        url = `${BASE_URL}/intraday/${symbol}?api_token=${EODHD_API_KEY}&fmt=json&interval=1m`;
        break;
      case 'real-time':
        // Real-time data
        url = `${BASE_URL}/real-time/${symbol}?api_token=${EODHD_API_KEY}&fmt=json`;
        break;
      case 'fundamentals':
        // Fundamental data
        url = `${BASE_URL}/fundamentals/${symbol}?api_token=${EODHD_API_KEY}&fmt=json`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`EODHD API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching market data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market data' }, 
      { status: 500 }
    );
  }
}
