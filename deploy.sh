#!/bin/bash
# deploy.sh - Deploy script for MillzMaleficarum Codex

echo "Deploying MillzMaleficarum Codex to Fly.io..."

# Ensure flyctl is in PATH
export FLYCTL_INSTALL='/root/.fly'
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Check if flyctl is available
if ! command -v flyctl &> /dev/null; then
  echo "Error: flyctl not found. Installing..."
  curl -L https://fly.io/install.sh | sh
  
  export FLYCTL_INSTALL='/root/.fly'
  export PATH="$FLYCTL_INSTALL/bin:$PATH"
fi

# Deploy to Fly.io
echo "Starting deployment..."
flyctl deploy

echo "Deployment complete!"
echo "Visit your app at: https://millzmaleficarum-codex.fly.dev"
echo "Dashboard: https://millzmaleficarum-codex.fly.dev/dashboard"