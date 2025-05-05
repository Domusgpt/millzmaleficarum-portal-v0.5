# Enable GitHub Pages for MillzMaleficarum Codex

The repository has been successfully pushed to GitHub! To complete the deployment process, you need to enable GitHub Pages:

1. Visit your repository at: [https://github.com/Domusgpt/millzmaleficarum-codex](https://github.com/Domusgpt/millzmaleficarum-codex)

2. Click on the **Settings** tab at the top of the repository page

3. In the left sidebar, click on **Pages** (under "Code and automation" section)

4. Under **Build and deployment**:
   - For **Source**, select **GitHub Actions**
   - You should see a "Use a suggested workflow" option
   - If prompted to select a workflow, choose the one for "Static HTML" or "Pages"

5. Wait for the GitHub Actions workflow to complete:
   - Go back to the **Actions** tab
   - You should see a workflow running or completed
   - Once completed, your site will be published

Your site will be available at: [https://domusgpt.github.io/millzmaleficarum-codex/](https://domusgpt.github.io/millzmaleficarum-codex/)

## Alternative Method (If GitHub Actions doesn't show up)

If you don't see the GitHub Actions option, you can:

1. In the Pages settings:
   - For **Source**, select **Deploy from a branch**
   - For **Branch**, select **master** (or **main**) and folder **/static-demo**
   - Click **Save**

2. Then manually enable the workflow:
   - Go to the **Actions** tab
   - Click "I understand my workflows, go ahead and enable them"
   - Select the "Deploy to GitHub Pages" workflow
   - Click "Run workflow" and confirm

Your site should be deployed within a few minutes!