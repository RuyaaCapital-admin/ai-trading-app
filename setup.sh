#!/bin/bash

echo "🚀 Setting up AI Trading App..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from example..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local and add your API keys!"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local and add your API keys:"
echo "   - Get OpenAI API key: https://platform.openai.com/api-keys"
echo "   - Get EODHD API key: https://eodhd.com/register"
echo "2. Run: pnpm dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "For deployment:"
echo "1. Push to GitHub"
echo "2. Import to Vercel"
echo "3. Add environment variables in Vercel dashboard"
