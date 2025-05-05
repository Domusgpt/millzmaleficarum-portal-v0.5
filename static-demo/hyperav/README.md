# HyperAV Integration for MillzMaleficarum Codex

This directory contains a simplified version of the HyperAV 4D visualization engine,
adapted specifically for integration with the MillzMaleficarum Codex project.

## Usage

1. Include the minimal integration script:
   ```html
   <script src="hyperav/hyperav-minimal.js"></script>
   ```

2. Add a container for the visualization:
   ```html
   <div id="hyperav-container" class="background-layer"></div>
   ```

3. Initialize the visualizer:
   ```javascript
   const hyperAV = new HyperAVMinimal('hyperav-container', {
     autoRotate: true,
     randomizeParams: true,
     lowDetail: true,
     opacity: 0.6
   });
   ```

## Features

- Simplified version of the full HyperAV engine
- Optimized for background visualization
- Automatic parameter randomization
- Mobile-friendly with performance adjustments

## Integration Notes

This is a minimal version intended for background effects only. For the full 
HyperAV experience with audio reactivity and interactive controls, see the 
complete project in `/storage/emulated/0/MillzMaleficarum_Codex_v0.1/HyperAV/`.
