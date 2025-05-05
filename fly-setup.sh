#!/bin/bash

# Add Fly.io CLI to PATH
export FLYCTL_INSTALL="/root/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Verify installation
echo "Verifying Fly.io CLI installation..."
flyctl version

echo ""
echo "Fly.io CLI is now ready to use!"
echo "Run the following commands to start deployment:"
echo ""
echo "1. Sign up for Fly.io (first time only):"
echo "   fly auth signup"
echo ""
echo "2. Launch your app:"
echo "   cd /root/projects/MillzMaleficarum_Codex_v0.1"
echo "   fly launch"
echo ""
echo "3. Create persistent storage:"
echo "   fly volumes create millz_data --size 1"
echo ""
echo "4. Deploy your app:"
echo "   fly deploy"
echo ""
echo "Run 'flyctl --help' for more information."