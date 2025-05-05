# Deploying to Replit

Follow these steps to deploy MillzMaleficarum Codex to Replit for a live demo:

## Step 1: Create a Replit Account
If you don't already have one, sign up for a free Replit account at https://replit.com/signup

## Step 2: Create a New Repl
1. Once logged in, click the "+ Create Repl" button
2. Select "Node.js" as the template
3. Give your project a name (e.g., "millzmaleficarum-codex")
4. Click "Create Repl"

## Step 3: Set Up the Project
You have two options for importing the code:

### Option 1: Import from GitHub (if your repository is on GitHub)
1. In your new Repl, click the three dots (...) in the files panel
2. Select "Pull from GitHub"
3. Enter your repository URL and follow the prompts

### Option 2: Manual Upload
1. In the Replit files panel, right-click and select "Upload folder"
2. Select all the files from your local MillzMaleficarum Codex project
3. Wait for the upload to complete

## Step 4: Configure the Project
1. The included `.replit` and `replit.nix` files should handle configuration automatically
2. If they didn't get uploaded, click the "Show hidden files" button in the files panel (eye icon) and create them manually:

**`.replit` file:**
```
run = "npm start"
entrypoint = "server.js"

[env]
PORT = "3000"

[nix]
channel = "stable-22_11"

[languages]
[languages.javascript]
pattern = "**/*.js"
syntax = "javascript"

[languages.css]
pattern = "**/*.css"
syntax = "css"

[languages.html]
pattern = "**/*.html"
syntax = "html"

[deployment]
run = ["sh", "-c", "npm start"]
deploymentTarget = "cloudrun"
```

**`replit.nix` file:**
```
{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
  ];
}
```

## Step 5: Run the Project
1. Click the "Run" button at the top of the window
2. Wait for the packages to install and the server to start
3. You should see output indicating the server is running

## Step 6: Access Your Application
1. In the top-right corner, you should see a browser window showing your application
2. If not, click on the "Webview" tab
3. Your application will be available at a URL like: https://millzmaleficarum-codex.yourusername.repl.co

## Step 7: Share Your Application
1. Copy the URL from the webview tab
2. Share it with anyone to let them access your MillzMaleficarum Codex application
3. The magazine will be at the root URL, and the dashboard at /dashboard

## Troubleshooting
- If you see an error, check the console output for details
- Make sure all dependencies are correctly installed
- Verify that the server.js file is in the root directory
- Check that the data directory exists and is writable

Your application should now be running live on Replit! 🎉