# Deploying to GitHub Pages (Static Demo)

This guide will help you create a static demo of the MillzMaleficarum Codex application using GitHub Pages, which is completely free and very easy to set up.

## What This Demo Will Show

This approach creates a static version of the application that:
- Shows the magazine with the rich format design
- Demonstrates the UI and styling
- Shows the format toggle functionality

Note: Since GitHub Pages only hosts static sites, the dashboard upload functionality and data saving won't work. This is just for demonstration purposes.

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top-right corner and select "New repository"
3. Name your repository "millzmaleficarum-demo" (or any name you prefer)
4. Choose "Public" visibility
5. Click "Create repository"

## Step 2: Prepare Files for GitHub Pages

1. Download the "static-demo" folder from this project
2. This folder contains a simplified version of the application designed to work with GitHub Pages

## Step 3: Upload Files to GitHub

1. In your new repository, click "uploading an existing file" link
2. Upload all the files from the "static-demo" folder
3. Add a commit message like "Add static demo files"
4. Click "Commit changes"

## Step 4: Enable GitHub Pages

1. Go to your repository settings
2. Scroll down to the "GitHub Pages" section
3. Under "Source", select "main" branch
4. Click "Save"
5. Wait a few minutes for your site to be published
6. GitHub will provide a URL like `https://yourusername.github.io/millzmaleficarum-demo/`

## Step 5: Visit Your Demo

1. Go to the URL provided by GitHub Pages
2. You should see the MillzMaleficarum Codex with the GEN-R-L MiLLz Manifesto content
3. The toggle buttons at the bottom allow switching between rich and legacy format views

## Limitations of This Demo

- This is a static demo only - the dashboard upload functionality won't work
- Any changes made won't be saved
- This is purely for demonstration/preview purposes

## Creating a Full Dynamic Version

For a fully functional version with working dashboard and data storage:

1. Follow the Netlify deployment guide (see NETLIFY-DEPLOY.md)
2. Or deploy to a service like Heroku, Render, or DigitalOcean

## Troubleshooting

- If your site doesn't appear, check the GitHub Pages settings to make sure it's enabled
- If styles are missing, make sure all files were uploaded correctly
- GitHub Pages can take a few minutes to update after changes