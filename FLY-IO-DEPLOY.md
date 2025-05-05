# Deploying MillzMaleficarum Codex to Fly.io (Free Tier)

This guide will walk you through deploying your Node.js application to Fly.io, which offers a generous free tier with 3 shared-CPU VMs and 3GB persistent storage without requiring a credit card.

## Prerequisites

1. A GitHub account with your code pushed to it
2. Your MillzMaleficarum_Codex project code ready to deploy

## Step 1: Install Fly CLI

### On Linux/macOS:
```bash
curl -L https://fly.io/install.sh | sh
```

### On Windows (PowerShell):
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

After installation, add Fly to your PATH if prompted.

## Step 2: Sign Up and Log In

```bash
fly auth signup
```

This will open a browser window for you to create a Fly.io account. Follow the prompts to complete signup.

If you already have an account:
```bash
fly auth login
```

## Step 3: Initialize Your App

Navigate to your project directory and run:

```bash
cd /path/to/MillzMaleficarum_Codex_v0.1
fly launch
```

This interactive process will ask you several questions:
- **App name**: Choose a unique name (e.g., millzmaleficarum-codex)
- **Organization**: Select "personal"
- **Region**: Choose the closest region to you
- **Setup PostgreSQL/MySQL/Redis**: No (unless you need a database)
- **Deploy now**: No (we'll make some modifications first)

This will create a `fly.toml` file in your project.

## Step 4: Configure Your App

### 1. Update fly.toml

Edit the generated `fly.toml` file to make sure it includes:

```toml
[env]
  PORT = "8080"

[mounts]
  source = "millz_data"
  destination = "/app/data"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
```

### 2. Create a Dockerfile

Create a file named `Dockerfile` in your project root with the following content:

```Dockerfile
FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Create data directory for persistence
RUN mkdir -p data
RUN chmod 777 data

EXPOSE 8080

CMD ["npm", "start"]
```

### 3. Update server.js port

Make sure your server.js listens on the correct port:
- Look for `const PORT = process.env.PORT || 3000;`
- Ensure it's using the environment variable

## Step 5: Deploy Your App

Now you're ready to deploy:

```bash
fly deploy
```

This will:
1. Build a Docker image of your application
2. Deploy it to Fly.io
3. Allocate and configure the necessary resources

## Step 6: Access Your Application

After deployment completes, you can access your application:

```bash
fly open
```

This will open your browser to your deployed app's URL (typically `https://your-app-name.fly.dev`).

Your dashboard will be available at:
- `https://your-app-name.fly.dev/dashboard`

## Step 7: Configure Persistent Storage

To ensure your uploaded magazine data persists between deployments:

```bash
fly volumes create millz_data --size 1
```

This creates a 1GB volume. The free tier includes up to 3GB of storage.

## Useful Commands

```bash
# View application status
fly status

# View application logs
fly logs

# SSH into your application
fly ssh console

# Scale your application
fly scale count 1

# Update environment variables
fly secrets set KEY=VALUE
```

## Troubleshooting

1. **Application crashes**:
   - Check logs: `fly logs`

2. **Volume mounting issues**:
   - Verify your `fly.toml` mounts configuration
   - Check if the volume exists: `fly volumes list`

3. **Cannot connect to application**:
   - Check application status: `fly status`
   - Try redeploying: `fly deploy`

4. **Need to reset everything**:
   - Delete app: `fly apps destroy your-app-name`
   - Start over with: `fly launch`

5. **Content not updating after upload**:
   - Clear browser cache or use the included cache tools
   - Visit the cache utility page: `https://your-app-name.fly.dev/clear-cache.html`
   - Restart the server: `fly machine restart`

6. **Server returning old data**:
   - Use the Refresh button on the main page
   - Check server logs: `fly logs`
   - Inspect the data files using SSH: `fly ssh console -c "cat /app/data/current_magazine_data.json"`

## Updating Your Application

When you make changes to your code:

1. Commit changes to your repository
2. Use the provided deploy script:
   ```bash
   ./deploy.sh
   ```
   Or run `fly deploy` manually to deploy the updated code

The deployment process is fast and provides zero-downtime updates.

## Using the Included Deploy Script

For convenience, a deployment script is included:

```bash
# Make it executable first
chmod +x deploy.sh

# Run the deploy script
./deploy.sh
```

This script will:
1. Check if the Fly CLI is installed (installing if needed)
2. Deploy your application to Fly.io
3. Display the URL to access your application

## Next Steps

1. Set up a GitHub Action for automatic deployments
2. Add a custom domain (free on Fly.io)
3. Configure health checks for better reliability