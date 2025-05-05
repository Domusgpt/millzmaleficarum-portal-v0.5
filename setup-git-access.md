# Setting Up Git Access for Claude

This guide will help you set up Git access so Claude can directly push to GitHub in future conversations.

## Step 1: Create a Personal Access Token (PAT) on GitHub

1. Go to [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token" > "Generate new token (classic)"
3. Give it a name like "Claude Git Access"
4. Set the expiration as needed (e.g., 90 days)
5. Select the following scopes:
   - `repo` (all repo permissions)
   - `workflow` (to enable GitHub Actions)
6. Click "Generate token"
7. **IMPORTANT**: Copy the token immediately and save it somewhere secure

## Step 2: Configure Git Credentials Helper

Run these commands in your terminal to store the credentials:

```bash
git config --global credential.helper store
echo "https://YOUR_USERNAME:YOUR_TOKEN@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials
```

Replace:
- `YOUR_USERNAME` with your GitHub username (DomusGPT)
- `YOUR_TOKEN` with the token you created in Step 1

## Step 3: Create a CLAUDE_GITHUB.md File

Create a file in your home directory with your GitHub info:

```bash
echo "# GitHub Access for Claude
- Username: DomusGPT
- Token path: ~/.git-credentials
- Default repository: millzmaleficarum-codex
- This file tells Claude that git is configured for direct access
" > ~/CLAUDE_GITHUB.md
```

## Step 4: Test the Configuration

Test that the credentials are working:

```bash
git ls-remote https://github.com/DomusGPT/millzmaleficarum-codex.git
```

If this command runs without asking for a password, the configuration is successful.

## Using in Future Claude Sessions

In future sessions with Claude, you can simply mention:

"I have git configured with GitHub access. The CLAUDE_GITHUB.md file in my home directory has the details."

Claude will then know it can directly create repositories and push code to GitHub for you.

## Security Notes

- The Personal Access Token grants access to your GitHub repositories
- Don't share the token with anyone else
- Consider using a token with an appropriate expiration date
- For highest security, create a token only for specific repositories