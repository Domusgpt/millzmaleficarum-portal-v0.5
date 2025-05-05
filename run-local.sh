#!/bin/bash
# Script to run the MillzMaleficarum Codex server locally

echo "Starting MillzMaleficarum Codex server locally..."

# Check if required packages are installed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Ensure data directory exists
mkdir -p data

# Check if data/current_magazine_data.json exists
if [ ! -f "data/current_magazine_data.json" ]; then
  echo "Creating default magazine data..."
  # Copy example data if available
  if [ -f "millz-magazine-issue125-quantum.json" ]; then
    cp millz-magazine-issue125-quantum.json data/current_magazine_data.json
    echo "Using quantum magazine data as default"
  fi
fi

# Run the server
echo "Starting server..."
echo "Server will be available at:"
echo "  - Main page: http://localhost:8080"
echo "  - Dashboard: http://localhost:8080/dashboard"
echo "  - Cache Tool: http://localhost:8080/clear-cache.html"
echo ""
echo "Press Ctrl+C to stop the server"

# Run with debugging enabled
NODE_ENV=development DEBUG=* node server.js