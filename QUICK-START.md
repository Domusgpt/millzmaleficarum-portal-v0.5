# MillzMaleficarum Codex - Quick Start Guide

This guide will help you quickly get the application running and view the GEN-R-L MiLLz Manifesto.

## Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. The application will be available at:
   - Magazine: http://localhost:3000/
   - Dashboard: http://localhost:3000/dashboard

## Viewing the GEN-R-L MiLLz Manifesto

1. Open the magazine at http://localhost:3000/
2. By default, the rich format view will be displayed
3. You can toggle between rich and legacy formats using the buttons at the bottom of the page:
   - "Rich Mode" - Shows the full GEN-R-L MiLLz Manifesto format
   - "Legacy Mode" - Shows the simplified legacy format

## Dashboard Usage

1. Open the dashboard at http://localhost:3000/dashboard
2. The current magazine data will be displayed, with a format indicator showing whether it's using the rich or legacy format
3. To update content:
   - Use the template guide as a reference for the rich format structure
   - Click "Copy Template" to copy the template to your clipboard
   - Modify the content as needed and save as a JSON file
   - Upload the file through the dashboard interface

## Rich Format Features

The rich format includes specialized sections:

1. **Cover** - The main introduction with title and blurb
2. **Editorial** - The main article content
3. **Culture** - Cultural commentary section
4. **Tech** - Technology-related content
5. **Interview** - Q&A format interview section
6. **Ads** - Fictional advertisements
7. **Lore Serial** - Serialized lore content
8. **Visual Prompts** - Prompts for image generation

## Special Formatting

The rich format supports special sigil markers for emphasis:
- `<sigil-Ξ>` - Displays the Ξ sigil with special styling
- `<sigil-Ω>` - Displays the Ω sigil with special styling

## Deployment Options

For a quick live demo, see the `deploy-to-replit.md` file for instructions on deploying to Replit.

Enjoy exploring The GEN-R-L MiLLz Manifesto!