# AI Trading App

A modern AI-powered trading application built with Next.js, featuring TradingView charts, real-time market data from EODHD, and AI-driven market analysis.

## Features

- 🤖 **AI Trading Assistant** - Get intelligent market analysis and trading insights
- 📈 **TradingView Charts** - Interactive candlestick charts with technical analysis
- 📊 **Real-time Market Data** - Live price updates from EODHD API
- 🎯 **Popular Stocks** - Quick access to major US stocks (AAPL, GOOGL, MSFT, etc.)
- 💬 **Smart Prompts** - Pre-built prompts for common trading questions
- 🌙 **Dark Theme** - Modern dark UI optimized for traders

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: OpenAI GPT-4, AI SDK, Model Context Protocol (MCP)
- **Charts**: Lightweight Charts (TradingView)
- **Market Data**: EODHD API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- OpenAI API key
- EODHD API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-trading-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
EODHD_API_KEY=your_eodhd_api_key_here
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Keys Setup

### OpenAI API Key
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env.local` file

### EODHD API Key
1. Sign up at [EODHD](https://eodhd.com/register)
2. Get your free API key from the dashboard
3. Add it to your `.env.local` file

## Deployment on Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `EODHD_API_KEY`
4. Deploy!

## Usage

1. **Select a Stock**: Choose from popular US stocks in the sidebar
2. **View Charts**: Interactive TradingView charts with real-time data
3. **AI Analysis**: Ask questions about market trends, technical analysis, or trading strategies
4. **Quick Prompts**: Use pre-built prompts for common analysis needs

## API Endpoints

- `POST /api/completion` - AI completion for trading analysis
- `GET /api/market-data` - Market data from EODHD
  - `?symbol=AAPL.US&type=eod` - End of day data
  - `?symbol=AAPL.US&type=real-time` - Real-time data
  - `?symbol=AAPL.US&type=intraday` - Intraday data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Disclaimer

This application is for educational and informational purposes only. It is not financial advice. Always consult with a qualified financial advisor before making investment decisions.
