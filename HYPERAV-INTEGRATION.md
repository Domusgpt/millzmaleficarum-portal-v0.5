# HyperAV Integration

This document outlines the integration plan for incorporating the HyperAV 4D Audio-Reactive Visualizer into the MillzMaleficarum Codex project to achieve the desired hyperdimensional holographic depth and glitchy micro-animation effects.

## HyperAV Overview

HyperAV is a powerful 4D geometry visualizer that:
- Renders hypercubes, hyperspheres, and other 4D shapes
- Reacts to audio input with real-time parameter mapping
- Uses WebGL for high-performance rendering
- Supports multiple projection methods (perspective, orthographic, stereographic)
- Includes modern visual effects like neon glow and glassmorphism

Located at: `/storage/emulated/0/MillzMaleficarum_Codex_v0.1/HyperAV/`

## Integration Approach

### 1. Background Visualization Layer

Create a randomized background layer using HyperAV's visualization capabilities:

```javascript
// In static-demo/index.html, add:
<div id="hyperav-container" class="background-layer"></div>

// In static-demo/style.css, add:
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -10;
  pointer-events: none;
  opacity: 0.6;
}
```

### 2. Core HyperAV Integration

Copy and adapt key components from HyperAV:

1. **Required Files**:
   - `core/HypercubeCore.js` → `static-demo/hyperav/hypercube-core.js`
   - `js/visualizer-main.js` → `static-demo/hyperav/visualizer-minimal.js`
   - Associated shader files (simplified)

2. **Simplified Initialization**:
   ```javascript
   // Add to static-demo/script.js
   function initHyperAV() {
     const container = document.getElementById('hyperav-container');
     const hyperAV = new HyperAVVisualizer(container, {
       autoRotate: true,
       audioReactive: false,
       randomizeParams: true,
       lowDetail: true,
       opacity: 0.6
     });
     
     // Randomize settings every 30-60 seconds
     setInterval(() => {
       hyperAV.randomizeProjection();
     }, Math.random() * 30000 + 30000);
   }
   ```

### 3. Micro-Animations & Glitchy Effects

Add specific effects to magazine content elements:

```css
/* Add to static-demo/style.css */
@keyframes microShift {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(-2px, 1px); }
  75% { transform: translate(2px, -1px); }
}

@keyframes depthPulse {
  0%, 100% { text-shadow: 0 0 8px var(--accent2); }
  50% { text-shadow: 0 0 18px var(--accent2), 0 0 30px var(--accent1); }
}

.section-title {
  animation: depthPulse 8s infinite;
}

.cover-title::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255,0,255,0.2) 50%, transparent 100%);
  animation: scanline 4s linear infinite;
}

/* Random glitch effect for content elements */
.section-content p:nth-child(3n) {
  animation: microShift 2s infinite;
  position: relative;
}
```

### 4. Randomized HyperAV Backgrounds

Create a module to generate random 4D scenes:

```javascript
// In static-demo/hyperav/scene-generator.js
class SceneGenerator {
  constructor() {
    this.presets = [
      { name: 'hypercube', dimension: 4.0, rotation: [0.01, 0.02, 0.005, 0.015] },
      { name: 'hypersphere', dimension: 3.5, rotation: [0.005, 0.01, 0.02, 0.005] },
      { name: 'hypertetrahedra', dimension: 4.2, rotation: [0.015, 0.005, 0.01, 0.02] }
    ];
  }
  
  getRandomScene() {
    const preset = this.presets[Math.floor(Math.random() * this.presets.length)];
    return {
      ...preset,
      color1: this.getRandomColor(),
      color2: this.getRandomColor(),
      speed: Math.random() * 0.01 + 0.005,
      opacity: Math.random() * 0.3 + 0.3
    };
  }
  
  getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 80%, 60%)`;
  }
}
```

## Implementation Plan

1. **Phase 1**: Create simplified HyperAV modules for visual effects
2. **Phase 2**: Add background visualization layer
3. **Phase 3**: Implement micro-animations and glitchy effects for content
4. **Phase 4**: Add randomized generation capabilities
5. **Phase 5**: Fine-tune performance for mobile devices

## Technical Considerations

- Simplify shaders for better mobile performance
- Use `requestAnimationFrame` with throttling for efficient rendering
- Implement progressive enhancement for devices with limited WebGL support
- Consider fallback static effects for older browsers
- Minimize DOM reflows by using CSS transforms and opacity changes

## Final Integration

The final integration will feature:
- Randomized hyperdimensional visuals serving as background
- Content elements with micro-animations and glitchy effects
- A "false sense of depth" through layered shadow effects
- Occasional "reality distortions" with randomized timing
- WebGL-based visual effects that respond to user interaction

All while maintaining readable text and usable interface elements.