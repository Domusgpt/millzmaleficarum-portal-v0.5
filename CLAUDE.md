# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status
- **Current Version: 0.5-portal** (See DEV-TRACK.md for latest updates)
- Portal-based hyperdimensional magazine with enhanced snap-scroll transitions
- Implemented immersive portal transitions between sections with 4D visualization
- Added portal navigation system with audio-reactive dimensional sounds
- Deep integration of HyperAV engine with portal transition effects
- Deployed to separate Fly.io instance at https://millzmaleficarum-portal-v0.5.fly.dev
- Repository at https://github.com/Domusgpt/millzmaleficarum-portal-v0.5

## Commands
- **Run locally**: `npm start` or `./run-local.sh`
- **Deploy portal version**: `./deploy-portal-to-fly.sh`
- **GitHub workflow**: Auto-deploys on push to master branch 
- **Lint shell scripts**: `shellcheck filename.sh`
- **Test**: Run `npm test` (no tests specified yet)

## Code Style Guidelines
- **JavaScript**:
  - Use ES6+ features (arrow functions, template literals, destructuring)
  - Prefer functional programming patterns for data transformation
  - Add JSDoc comments for documentation (`@param`, `@returns`)
  - Handle errors with try/catch blocks and detailed error messages
  - Use camelCase for variables and functions, PascalCase for classes
  - Create clearly named component functions for UI elements

- **CSS**:
  - Use CSS variables for theming (defined in `:root`)
  - Follow mobile-first responsive design principles
  - Namespace classes by section (e.g., `editorial-section`, `tech-content`)
  - Organize 3D transformations and animations into logical groups

- **HTML/JSON**:
  - Use semantic HTML5 elements
  - Structure JSON with nested objects for better organization
  - Include metadata and configuration in JSON for rendering instructions
  - Maintain backward compatibility with legacy formats

## Error Handling
- Server: Use try/catch blocks with detailed error logging
- Client: Implement graceful degradation with user-friendly error messages
- JSON parsing: Validate content structure before rendering

## Imports
- Group imports by type (core modules, npm packages, local modules)
- Use destructuring for specific imports where applicable
- Avoid wildcard imports

## Important Files
- `server.js`: Express API server with magazine data endpoints
- `public/script.js`: Frontend rendering with layout and navigation
- `public/style.css`: CSS with advanced 3D effects and responsive design
- `public/hyperav.js`: 4D visualization engine integration
- `public/reactive-animations.js`: Micro-animation system with reactive elements
- `public/infinite-scroll.js`: Infinite scrolling with glitchy transitions
- `public/hyperav-audio.js`: Audio reactivity for visualization engine
- `public/enhancement-loader.js`: Performance-aware feature loading system