# Deploying MillzMaleficarum_Codex to Replit

Follow these steps to deploy the full version of MillzMaleficarum_Codex with content upload functionality to Replit.

## 1. Create a Replit Account
If you don't already have one, sign up at [replit.com](https://replit.com/).

## 2. Create a New Repl
1. Click the "+ Create Repl" button.
2. Select "Node.js" as the template.
3. Name your project "millzmaleficarum-codex".
4. Click "Create Repl".

## 3. Import Your Project Files
You have two options:

### Option A: Import from GitHub
1. In your new Repl, click on the version control tab (looks like a branch icon).
2. Click "Connect to GitHub".
3. Select your repository: `Domusgpt/millzmaleficarum-codex`.
4. Click "Import from GitHub".

### Option B: Manual Upload
1. In the Replit Files panel, click on the three dots (...) and select "Upload folder".
2. Select all files from your local MillzMaleficarum_Codex_v0.1 project.
3. Wait for the upload to complete.

## 4. Add Required Configuration Files

Make sure the `.replit` file exists with the following content:

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

## 5. Create the Data Directory
Run this command in the Replit Shell:
```bash
mkdir -p data
```

## 6. Run Your Application
1. Click the "Run" button at the top of the Replit interface.
2. Wait for npm to install dependencies and start the server.
3. You should see output like: `MillzMaleficarum Codex server running on port 3000`.

## 7. Access Your Application
- Your main magazine view will be available at the Webview URL.
- The dashboard will be at `/dashboard` (e.g., `https://millzmaleficarum-codex.yourusername.repl.co/dashboard`).

## 8. Test Content Upload
1. Visit the dashboard URL.
2. Use the JSON template provided on the dashboard.
3. Create a JSON file with your custom content.
4. Upload the file through the dashboard interface.
5. Verify that your magazine content updates.

## 9. Make Your Repl Public
1. Click the project name at the top left.
2. Go to the "Settings" tab.
3. Scroll to "Visibility" and make sure it's set to "Public".
4. Use the provided URL to share your application with others.

## Troubleshooting
- If you encounter a "Module not found" error, run `npm install` in the Shell.
- If your application crashes, check the Console tab for error messages.
- If uploads fail, check that the data directory exists and has the correct permissions.