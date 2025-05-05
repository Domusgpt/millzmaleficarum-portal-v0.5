#!/bin/bash
# Script to push MillzMaleficarum Codex to GitHub

# Step 1: Make sure git is configured
git config --global user.name "DomusGPT"
git config --global user.email "phillips.paul.email@gmail.com"

# Step 2: Make sure we're in the right directory
cd "$(dirname "$0")"

# Step 3: Check if the GitHub repository exists
if ! gh repo view DomusGPT/millzmaleficarum-codex-v0.4 &>/dev/null; then
  echo "Creating GitHub repository (millzmaleficarum-codex-v0.4)..."
  gh repo create millzmaleficarum-codex-v0.4 --public --description "An immersive, hyperdimensional digital magazine with portal transitions, 4D visualization, and dimensional audio effects" --confirm
else
  echo "Repository DomusGPT/millzmaleficarum-codex-v0.4 already exists, skipping creation."
fi

# Step 4: Add the remote (if not already added)
git remote -v | grep -q 'origin' || git remote add origin https://github.com/DomusGPT/millzmaleficarum-codex-v0.4.git

# Step 5: Add all files and commit if there are changes
git add .
git diff-index --quiet HEAD || git commit -m "Update files for GitHub Pages deployment"

# Step 6: Push to GitHub
echo "Pushing to GitHub..."
git push -u origin master

# Step 7: Enable GitHub Pages via API
echo "To enable GitHub Pages deployment, go to:"
echo "https://github.com/DomusGPT/millzmaleficarum-codex-v0.4/settings/pages"
echo "Under 'Source', select 'GitHub Actions'"

echo "Done! Your site will be deployed to:"
echo "https://domusgpt.github.io/millzmaleficarum-codex-v0.4/"