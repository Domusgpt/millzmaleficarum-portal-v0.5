# GitHub Repository Setup Guide

This guide helps you set up this project on GitHub and deploy it using GitHub Pages.

## Step 1: Create a New Repository on GitHub

1. Login to your GitHub account (DomusGPT)
2. Go to [https://github.com/new](https://github.com/new)
3. Enter repository name: `millzmaleficarum-codex` 
4. Description: `A dynamic, JSON-driven digital magazine with a Vaporwave/Cryptic/Sacred Tech aesthetic`
5. Set to Public
6. Click "Create repository"

## Step 2: Push Code to GitHub

From your local terminal, run the following commands:

```bash
# Navigate to your project directory
cd /root/projects/MillzMaleficarum_Codex_v0.1

# Configure git (if not already configured)
git config --global user.name "DomusGPT"
git config --global user.email "phillips.paul.email@gmail.com"

# Initialize git repository (if not already initialized)
git init

# Add remote
git remote add origin https://github.com/DomusGPT/millzmaleficarum-codex.git

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Push to GitHub
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Click "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"
5. The workflow will automatically deploy your site

## Step 4: Configure GitHub Actions (Already Done)

The repository already includes a GitHub Actions workflow file at `.github/workflows/github-pages-deploy.yml` that will:

1. Build a static version of the application
2. Deploy it to GitHub Pages
3. Make it available at https://domusgpt.github.io/millzmaleficarum-codex/

## Step 5: View Your Deployed Site

After the GitHub Actions workflow completes (takes a few minutes after pushing):

1. Go to https://domusgpt.github.io/millzmaleficarum-codex/
2. You should see the landing page
3. Click "Enter the Manifesto" to see the full GEN-R-L MiLLz Manifesto

## Troubleshooting

If the deployment fails:

1. Go to the "Actions" tab in your repository
2. Click on the failed workflow run
3. Review the error messages
4. Make necessary adjustments and push again

## Additional Notes

- The GitHub Pages version is a static demo
- The dashboard upload functionality won't work in this version since GitHub Pages only hosts static content
- For a fully functional version, deploy to a service that supports Node.js backends (Azure, Heroku, Render, etc.)