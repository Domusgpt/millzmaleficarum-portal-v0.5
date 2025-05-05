#!/bin/bash

# Setup Fly.io environment
export FLYCTL_INSTALL='/root/.fly'
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Navigate to project directory (already in correct directory)
cd "$(dirname "$0")"

# Create a progress function to display progress
progress() {
  echo "---------------------------------------------------------"
  echo "⚡️ $1"
  echo "---------------------------------------------------------"
}

# Check if we're authenticated
progress "Checking Fly.io authentication..."
if ! fly auth whoami &>/dev/null; then
  progress "Not authenticated. Please run 'fly auth signup' or 'fly auth login' first."
  exit 1
fi

# Deploy the application with non-interactive mode
progress "Deploying application to Fly.io..."
fly deploy --now --remote-only --strategy immediate --verbose

# Check if the deployment was successful
if [ $? -eq 0 ]; then
  progress "Deployment successful! Getting application details..."
  fly status
  
  progress "Application URL:"
  echo "https://millzmaleficarum-codex.fly.dev/"
  echo "Dashboard URL: https://millzmaleficarum-codex.fly.dev/dashboard"
  
  progress "Checking application logs:"
  fly logs --instance all --quiet
else
  progress "Deployment failed. Check errors above."
  exit 1
fi