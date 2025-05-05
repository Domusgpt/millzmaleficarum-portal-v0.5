#!/bin/bash
# Script to create a new feature branch for portal development

# Get the feature name from command line argument
if [ -z "$1" ]; then
  echo "Usage: $0 <feature-name>"
  echo "Example: $0 tesseract-animation"
  exit 1
fi

FEATURE_NAME=$1
BRANCH_NAME="portal-feature-${FEATURE_NAME}"

# Create the new branch from master
git checkout master
git pull portal-remote master
git checkout -b $BRANCH_NAME

echo "Created new branch: $BRANCH_NAME"
echo "Make your changes and commit them"
echo ""
echo "When ready to push:"
echo "git push portal-remote $BRANCH_NAME"
echo ""
echo "To create a PR, visit:"
echo "https://github.com/Domusgpt/millzmaleficarum-portal-v0.5/pull/new/$BRANCH_NAME"