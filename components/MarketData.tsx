'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface MarketDataProps {
  selectedSymbol: string;
  onSymbolChange: (symbol: string) => void;
}

interface RealTimeData {
  code: string;
  timestamp: number;
  gmtoffset: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  previousClose: number;
  change: number;
  change_p: number;
}

const popularSymbols = [
  'AAPL.US', 'GOOGL.US', 'MSFT.US', 'TSLA.US', 'AMZN.US',
  'NVDA.US', 'META.US', 'NFLX.US', 'AMD.US', 'INTC.US'
];

export default function MarketData({ selectedSymbol, onSymbolChange }: MarketDataProps) {
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRealTimeData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/market-data?symbol=${selectedSymbol}&type=real-time`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch real-time data');
        }

        const data = await response.json();
        setRealTimeData(data);
      } catch (err) {
        console.error('Error fetching real-time data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load market data');
      } finally {
        setLoading(false);
      }
    };

    fetchRealTimeData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000);
    
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
    return volume.toString();
  };

  return (
    <div className="space-y-6">
      {/* Symbol Selector */}
      <div className="trading-card">
        <h3 className="text-lg font-semibold mb-4">Select Symbol</h3>
        
        <select
          value={selectedSymbol}
          onChange={(e) => onSymbolChange(e.target.value)}
          className="trading-input w-full mb-4"
        >
          {popularSymbols.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>

        <div className="text-sm text-gray-400">
          Popular US stocks. More symbols coming soon.
        </div>
      </div>

      {/* Real-time Data */}
      <div className="trading-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Market Data</h3>
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          )}
        </div>

        {error ? (
          <div className="text-red-400 text-sm">{error}</div>
        ) : realTimeData ? (
          <div className="space-y-4">
            {/* Current Price */}
            <div>
              <div className="text-2xl font-bold text-white">
                {formatPrice(realTimeData.close)}
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                realTimeData.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {realTimeData.change >= 0 ? 
                  <TrendingUp className="w-4 h-4" /> : 
                  <TrendingDown className="w-4 h-4" />
                }
                <span>{formatPrice(Math.abs(realTimeData.change))}</span>
                <span>({realTimeData.change_p?.toFixed(2)}%)</span>
              </div>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <DollarSign className="w-4 h-4" />
                  Open
                </div>
                <div className="text-white font-semibold">
                  {formatPrice(realTimeData.open)}
                </div>
              </div>

              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  High
                </div>
                <div className="text-white font-semibold">
                  {formatPrice(realTimeData.high)}
                </div>
              </div>

              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <TrendingDown className="w-4 h-4" />
                  Low
                </div>
                <div className="text-white font-semibold">
                  {formatPrice(realTimeData.low)}
                </div>
              </div>

              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                  <Activity className="w-4 h-4" />
                  Volume
                </div>
                <div className="text-white font-semibold">
                  {formatVolume(realTimeData.volume)}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-2 border-t border-gray-700">
              <div className="text-xs text-gray-400">
                Previous Close: {formatPrice(realTimeData.previousClose)}
              </div>
              <div className="text-xs text-gray-400">
                Last Updated: {new Date(realTimeData.timestamp * 1000).toLocaleString()}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            Select a symbol to view market data
          </div>
        )}
      </div>
    </div>
  );
}
