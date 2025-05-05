# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status
- **Current Version: 0.5-portal-enhanced** (See DEV-TRACK.md for latest updates)
- Portal-based hyperdimensional magazine with enhanced snap-scroll transitions
- Implements immersive portal transitions between sections with 4D visualization

## Commands
- **Run locally**: `npm start` or `./run-local.sh`
- **Deploy to Fly.io**: `flyctl deploy` or `./fly-deploy.sh`
- **Deploy to Netlify**: See NETLIFY-DEPLOY.md for instructions
- **Lint shell scripts**: `shellcheck filename.sh`
- **Test**: `npm test` (no tests specified yet)

## Code Style Guidelines
- **JavaScript**:
  - Use ES6+ features (arrow functions, template literals, destructuring)
  - Prefer functional programming for data transformations
  - Add JSDoc comments for all functions (`@param`, `@returns`)
  - Use camelCase for variables and functions, PascalCase for classes
  - Handle errors with try/catch and provide detailed error messages

- **CSS**:
  - Use CSS variables for theming (defined in `:root`)
  - Follow mobile-first responsive design principles
  - Namespace classes by section (e.g., `editorial-section`)
  - Group 3D transformations and animations logically

- **JSON**:
  - Structure with nested objects for organization
  - Include metadata and configuration for rendering
  - Maintain backward compatibility with legacy formats

## Important Files
- `server.js`: Express API server with magazine data endpoints
- `public/script.js`: Frontend rendering with layout and navigation
- `public/enhanced-portal-transitions.js`: Core portal transition system
- `public/portal-transitions.css`: Styling for portal effects
- `public/hyperav.js`: 4D visualization engine integration
- `public/enhancement-loader.js`: Performance-aware feature loading
- `data/current_magazine_data.json`: Current magazine content with portal config