#!/bin/bash
# Script to push MillzMaleficarum Codex to GitHub

# Step 1: Make sure git is configured
git config --global user.name "DomusGPT"
git config --global user.email "phillips.paul.email@gmail.com"

# Step 2: Make sure we're in the right directory
cd "$(dirname "$0")"

# Step 3: Create the GitHub repository (if it doesn't exist)
echo "Creating GitHub repository (millzmaleficarum-codex)..."
gh repo create millzmaleficarum-codex --public --description "A dynamic, JSON-driven digital magazine with a Vaporwave/Cryptic/Sacred Tech aesthetic" --confirm

# Step 4: Add the remote (if not already added)
git remote -v | grep -q 'origin' || git remote add origin https://github.com/DomusGPT/millzmaleficarum-codex.git

# Step 5: Add all files and commit if there are changes
git add .
git diff-index --quiet HEAD || git commit -m "Update files for GitHub Pages deployment"

# Step 6: Push to GitHub
echo "Pushing to GitHub..."
git push -u origin master

# Step 7: Enable GitHub Pages via API
echo "To enable GitHub Pages deployment, go to:"
echo "https://github.com/DomusGPT/millzmaleficarum-codex/settings/pages"
echo "Under 'Source', select 'GitHub Actions'"

echo "Done! Your site will be deployed to:"
echo "https://domusgpt.github.io/millzmaleficarum-codex/"