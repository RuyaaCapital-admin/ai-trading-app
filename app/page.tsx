'use client';

import { useCompletion } from '@ai-sdk/react';
import { useState } from 'react';
import TradingChart from '@/components/TradingChart';
import MarketData from '@/components/MarketData';
import { Send, TrendingUp } from 'lucide-react';

export default function Page() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL.US');
  
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/completion',
  });

  const [userInput, setUserInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    const prompt = `Analyze the market data for ${selectedSymbol} and ${userInput}. 
    Please provide trading insights and recommendations based on current market conditions.`;
    
    await complete(prompt);
    setUserInput('');
  };

  const quickPrompts = [
    "Analyze current market trends",
    "What's the technical analysis for this stock?",
    "Should I buy or sell this stock?",
    "What are the key support and resistance levels?",
    "Provide a risk assessment for this position"
  ];

  return (
    <div className="space-y-6">
      {/* Market Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <MarketData 
            selectedSymbol={selectedSymbol} 
            onSymbolChange={setSelectedSymbol}
          />
        </div>
        
        {/* Trading Chart */}
        <div className="lg:col-span-3">
          <div className="trading-card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold">Chart Analysis - {selectedSymbol}</h2>
            </div>
            <TradingChart symbol={selectedSymbol} />
          </div>
        </div>
      </div>

      {/* AI Assistant Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="trading-card">
          <h3 className="text-lg font-semibold mb-4">AI Trading Assistant</h3>
          
          {/* Quick Action Buttons */}
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setUserInput(prompt)}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-blue-300 px-3 py-1 rounded-full border border-gray-700 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask me about market analysis, trading strategies, or specific stocks..."
                className="trading-input w-full h-24 resize-none"
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !userInput.trim()}
              className="trading-button w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Get AI Analysis
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Response Section */}
        <div className="trading-card">
          <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
          <div className="bg-gray-800 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
            {completion ? (
              <div className="whitespace-pre-wrap text-gray-200">
                {completion}
              </div>
            ) : (
              <div className="text-gray-500 italic">
                Ask me anything about trading, market analysis, or specific stocks. I'll analyze the data and provide insights.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
