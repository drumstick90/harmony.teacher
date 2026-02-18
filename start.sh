#!/bin/bash

echo "🎹 Starting Harmony Teacher..."
echo ""
echo "📦 Checking dependencies..."

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo ""
echo "🚀 Launching app in browser..."
echo ""
echo "   ✨ Opening: http://localhost:5173"
echo ""
echo "   📌 Connect your MIDI keyboard via USB"
echo "   📌 Use Chrome, Edge, or Opera (Web MIDI support)"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm start
