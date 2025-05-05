#!/bin/bash
# Script to deploy MillzMaleficarum Portal v0.5 to Fly.io

# Step 1: Make sure we're in the right directory
cd "$(dirname "$0")"

# Step 2: Update fly.toml and git repository
echo "Preparing fly.toml and git repository..."
git add fly.toml package.json
git commit -m "Update configuration for portal-v0.5 deployment"
git push portal-remote master

# Step 3: Creating Fly app if it doesn't exist
echo "Creating Fly app 'millzmaleficarum-portal-v0.5'..."
fly apps create millzmaleficarum-portal-v0.5 || echo "App already exists, continuing..."

# Step 4: Create the volume for data persistence if it doesn't exist
echo "Creating persistent volume for data..."
fly volumes create millz_portal_data --size 1 --region sjc || echo "Volume already exists, continuing..."

# Step 5: Deploy the app to Fly.io
echo "Deploying app to Fly.io..."
fly deploy --remote-only

# Step 6: Show deployment info
echo "Deployment completed!"
echo "Your portal magazine is available at: https://millzmaleficarum-portal-v0.5.fly.dev"