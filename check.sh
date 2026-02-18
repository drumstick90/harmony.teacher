#!/bin/bash

echo "🔍 Harmony Teacher - System Check"
echo "=================================="
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✅ Node.js installed: $NODE_VERSION"
else
    echo "   ❌ Node.js not found! Install from https://nodejs.org"
    exit 1
fi

# Check npm
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "   ✅ npm installed: $NPM_VERSION"
else
    echo "   ❌ npm not found!"
    exit 1
fi

# Check node_modules
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "   ✅ Dependencies installed"
else
    echo "   ⚠️  Dependencies not installed"
    echo "   → Run: npm install"
fi

# Check src files
echo "📁 Checking source files..."
if [ -f "src/App.jsx" ]; then
    echo "   ✅ Source files present"
else
    echo "   ❌ Source files missing!"
    exit 1
fi

# Check for Chrome/Edge/Opera
echo "🌐 Checking browsers..."
BROWSER_FOUND=false

if command -v "google-chrome" &> /dev/null || command -v "chromium" &> /dev/null; then
    echo "   ✅ Chrome found"
    BROWSER_FOUND=true
elif [ -d "/Applications/Google Chrome.app" ]; then
    echo "   ✅ Chrome found"
    BROWSER_FOUND=true
fi

if command -v "msedge" &> /dev/null || [ -d "/Applications/Microsoft Edge.app" ]; then
    echo "   ✅ Edge found"
    BROWSER_FOUND=true
fi

if ! $BROWSER_FOUND; then
    echo "   ⚠️  Chrome/Edge not found (but may still be installed)"
    echo "   → Use Chrome, Edge, or Opera for Web MIDI support"
fi

echo ""
echo "=================================="
echo "✨ System check complete!"
echo ""
echo "Ready to start? Run:"
echo "   npm start"
echo ""
