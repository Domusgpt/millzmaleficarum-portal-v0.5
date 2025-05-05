# Fly.io Quick Deployment Guide

This is a condensed version of the full deployment guide. Follow these steps to quickly deploy MillzMaleficarum Codex to Fly.io.

## Installation & Setup

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign up & Login**
   ```bash
   fly auth signup
   # Or if you already have an account:
   # fly auth login
   ```

## Deployment

1. **Push your code to GitHub if you haven't already**
   ```bash
   cd /root/projects/MillzMaleficarum_Codex_v0.1
   git add .
   git commit -m "Add Fly.io deployment files"
   git push origin master
   ```

2. **Deploy to Fly.io**
   ```bash
   cd /root/projects/MillzMaleficarum_Codex_v0.1
   fly launch
   ```
   
   - Choose a unique app name
   - Select your organization
   - Choose a region close to you
   - Skip database setup
   - Answer "no" to deploying now

3. **Create persistent volume**
   ```bash
   fly volumes create millz_data --size 1
   ```

4. **Deploy your app**
   ```bash
   fly deploy
   ```

5. **Open your app in browser**
   ```bash
   fly open
   ```

## Your URLs

- Main magazine: `https://your-app-name.fly.dev/`
- Admin dashboard: `https://your-app-name.fly.dev/dashboard`

## Common Commands

```bash
# View app status
fly status

# View logs
fly logs

# SSH into your app
fly ssh console

# Restart your app
fly apps restart
```

For detailed instructions, see the full documentation in FLY-IO-DEPLOY.md