#!/bin/bash

echo "🚀 Setting up DeFiGuard AI..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Copy environment template
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# AI Model
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash-latest

# Blockchain
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key

# RPC Endpoints
NEXT_PUBLIC_BASE_SEPOLIA_RPC=https://sepolia.base.org
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC=https://rpc.sepolia.org

# Explorer API Keys
BASESCAN_API_KEY=your_basescan_api_key
ARBISCAN_API_KEY=your_arbiscan_api_key
ETHERSCAN_API_KEY=your_etherscan_api_key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF
    echo "⚠️  Please edit .env.local with your API keys"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Get Gemini API key: https://aistudio.google.com/app/apikey"
echo "3. Get Thirdweb client ID: https://thirdweb.com/dashboard"
echo "4. Run 'pnpm dev' to start development server"
echo ""
echo "🎯 For deployment instructions, see DEPLOYMENT.md"

