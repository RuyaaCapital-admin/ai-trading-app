'use client';

import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';

interface TradingChartProps {
  symbol: string;
}

interface MarketData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default function TradingChart({ symbol }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1f2937' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#485563',
      },
      timeScale: {
        borderColor: '#485563',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    chartRef.current = chart;

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#10b981',
      wickDownColor: '#ef4444',
      wickUpColor: '#10b981',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!candlestickSeriesRef.current) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/market-data?symbol=${symbol}&type=eod`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }

        const data: MarketData[] = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('No data available for this symbol');
        }

        // Transform data for TradingView
        const chartData: CandlestickData[] = data
          .slice(-100) // Show last 100 days
          .map((item) => ({
            time: item.date,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          }))
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

        candlestickSeriesRef.current.setData(chartData);

        // Fit chart to data
        if (chartRef.current) {
          chartRef.current.timeScale().fitContent();
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (error) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-800 rounded-lg">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error loading chart</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="flex items-center gap-2 text-blue-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            Loading chart data...
          </div>
        </div>
      )}
      <div 
        ref={chartContainerRef} 
        className="w-full h-[400px] rounded-lg overflow-hidden"
      />
    </div>
  );
}
