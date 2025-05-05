/**
 * MillzMaleficarum Codex v0.5
 * Portal Transitions Module
 * Creates hyperdimensional portal effects when navigating between sections
 */

class PortalTransitions {
  constructor(options = {}) {
    // Default configuration
    this.config = {
      transitionDuration: options.transitionDuration || 1500,
      useHyperAV: options.useHyperAV !== false,
      portalIntensity: options.portalIntensity || 0.8,
      sectionSelector: options.sectionSelector || '.cover-section, .editorial-section, .culture-section, .tech-section, .interview-section, .ads-section, .lore-section',
      containerSelector: options.containerSelector || '#magazine-content',
      enableAudio: options.enableAudio !== false,
      debugMode: options.debugMode || false
    };

    // State
    this.state = {
      currentSection: null,
      previousSection: null,
      isTransitioning: false,
      observer: null,
      portalCanvas: null,
      portalContext: null,
      portalOverlay: null,
      portalAnimation: null,
      hyperAVInstance: window.hyperAV || null,
      sections: [],
      sectionColors: {
        'cover': { primary: '#ff00aa', secondary: '#00eeff' },
        'editorial': { primary: '#00eeff', secondary: '#ff00aa' },
        'culture': { primary: '#cc00ff', secondary: '#ffcc00' },
        'tech': { primary: '#00ffcc', secondary: '#ff00aa' },
        'interview': { primary: '#ffcc00', secondary: '#cc00ff' },
        'ads': { primary: '#ff33cc', secondary: '#ccff00' },
        'lore': { primary: '#8a2be2', secondary: '#00eeff' }
      },
      audioContext: null,
      portalSounds: {}
    };

    // Initialize
    this._initialize();
  }

  /**
   * Initialize the portal transitions system
   */
  _initialize() {
    // Create portal overlay and canvas
    this._createPortalElements();
    
    // Set up audio if enabled
    if (this.config.enableAudio) {
      this._initAudio();
    }
    
    // Set up intersection observer for section transitions
    this._setupIntersectionObserver();
    
    // Connect to HyperAV if available
    if (this.config.useHyperAV && window.hyperAV) {
      this.state.hyperAVInstance = window.hyperAV;
      console.log('Portal Transitions: Connected to HyperAV instance');
    }
    
    // Add portal style classes to sections
    this._applySectionStyles();
    
    console.log('Portal Transitions: Initialized');
  }

  /**
   * Create portal overlay elements
   */
  _createPortalElements() {
    // Create main portal overlay
    const overlay = document.createElement('div');
    overlay.className = 'portal-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '1000';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    
    // Create portal canvas for WebGL effects
    const canvas = document.createElement('canvas');
    canvas.className = 'portal-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    // Add canvas to overlay
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);
    
    // Store references
    this.state.portalOverlay = overlay;
    this.state.portalCanvas = canvas;
    this.state.portalContext = canvas.getContext('2d');
    
    // Handle window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  /**
   * Set up audio for portal transitions
   */
  _initAudio() {
    try {
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.state.audioContext = new AudioContext();
      
      // Generate portal sound effects
      this._generatePortalSounds();
      
      if (this.config.debugMode) {
        console.log('Portal Transitions: Audio initialized');
      }
    } catch (error) {
      console.error('Portal Transitions: Failed to initialize audio', error);
    }
  }

  /**
   * Generate various portal sound effects
   */
  _generatePortalSounds() {
    // Only generate if we have an audio context
    if (!this.state.audioContext) return;
    
    const ctx = this.state.audioContext;
    const sounds = {};
    
    // Portal enter sound (whoosh with rising pitch)
    sounds.enter = this._createAudioBuffer(ctx, 2, (t) => {
      // Whoosh sound with rising pitch
      const freq = 100 + t * 900;
      const amp = Math.exp(-2 * t) * 0.5;
      // Add some noise
      const noise = Math.random() * 0.1;
      return Math.sin(2 * Math.PI * freq * t) * amp + noise * amp;
    });
    
    // Portal exit sound (reverse whoosh)
    sounds.exit = this._createAudioBuffer(ctx, 2, (t) => {
      // Reverse whoosh with falling pitch
      const freq = 1000 - t * 800;
      const amp = Math.exp(-(2 - t*2) * (2 - t*2)) * 0.5;
      // Add some noise
      const noise = Math.random() * 0.1;
      return Math.sin(2 * Math.PI * freq * t) * amp + noise * amp;
    });
    
    // Transition complete sound (arrival ping)
    sounds.complete = this._createAudioBuffer(ctx, 1, (t) => {
      // High-pitched ping sound
      const freq1 = 1200;
      const freq2 = 1800;
      const amp = Math.exp(-10 * t) * 0.3;
      return (Math.sin(2 * Math.PI * freq1 * t) + Math.sin(2 * Math.PI * freq2 * t)) * amp;
    });
    
    this.state.portalSounds = sounds;
  }

  /**
   * Create audio buffer with custom waveform
   */
  _createAudioBuffer(context, duration, waveformFn) {
    const sampleRate = context.sampleRate;
    const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
    const channel = buffer.getChannelData(0);
    
    for (let i = 0; i < channel.length; i++) {
      const t = i / sampleRate;
      channel[i] = waveformFn(t);
    }
    
    return buffer;
  }

  /**
   * Play a portal sound effect
   */
  _playPortalSound(soundName) {
    if (!this.state.audioContext || !this.state.portalSounds[soundName]) return;
    
    // Create source node
    const source = this.state.audioContext.createBufferSource();
    source.buffer = this.state.portalSounds[soundName];
    
    // Create gain node for volume control
    const gainNode = this.state.audioContext.createGain();
    gainNode.gain.value = 0.5;
    
    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(this.state.audioContext.destination);
    
    // Start playback
    source.start();
    
    // Return cleanup function
    return () => {
      source.stop();
      source.disconnect();
      gainNode.disconnect();
    };
  }

  /**
   * Set up intersection observer to detect section changes
   */
  _setupIntersectionObserver() {
    // Get all sections
    const container = document.querySelector(this.config.containerSelector);
    if (!container) {
      console.error('Portal Transitions: Container not found');
      return;
    }
    
    // Wait for sections to be created
    const checkForSections = () => {
      const sections = container.querySelectorAll(this.config.sectionSelector);
      if (sections.length > 0) {
        this.state.sections = Array.from(sections);
        this._observeSections();
      } else {
        // Try again after a delay
        setTimeout(checkForSections, 500);
      }
    };
    
    checkForSections();
  }

  /**
   * Observe sections for visibility changes
   */
  _observeSections() {
    // Only create observer if we have sections
    if (this.state.sections.length === 0) return;
    
    // Create observer
    this.state.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const section = entry.target;
          
          // Skip if we're already on this section or transitioning
          if (this.state.currentSection === section || this.state.isTransitioning) return;
          
          // Store previous section
          this.state.previousSection = this.state.currentSection;
          this.state.currentSection = section;
          
          // Trigger portal transition
          if (this.state.previousSection) {
            this._triggerPortalTransition(this.state.previousSection, section);
          }
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px'
    });
    
    // Observe all sections
    this.state.sections.forEach(section => {
      this.state.observer.observe(section);
      
      // Make sure sections have proper snap properties
      section.style.scrollSnapAlign = 'start';
      section.style.height = '100vh';
      section.style.width = '100%';
      section.style.position = 'relative';
      section.style.overflow = 'hidden';
      
      // Set initial section if none is set
      if (!this.state.currentSection) {
        this.state.currentSection = section;
      }
    });
    
    if (this.config.debugMode) {
      console.log(`Portal Transitions: Observing ${this.state.sections.length} sections`);
    }
  }

  /**
   * Apply portal styling to sections
   */
  _applySectionStyles() {
    // Wait for sections to be available
    const waitForSections = setInterval(() => {
      const sections = document.querySelectorAll(this.config.sectionSelector);
      if (sections.length > 0) {
        clearInterval(waitForSections);
        
        // Apply styles to each section
        sections.forEach(section => {
          // Get section ID
          const sectionId = section.id;
          
          // Skip if no ID
          if (!sectionId) return;
          
          // Get section colors
          const colors = this.state.sectionColors[sectionId] || {
            primary: '#ff00ff',
            secondary: '#00ffff'
          };
          
          // Apply theme colors as data attributes
          section.dataset.primaryColor = colors.primary;
          section.dataset.secondaryColor = colors.secondary;
          
          // Add portal style class
          section.classList.add('portal-section');
          
          // Add custom portal border
          const portalBorder = document.createElement('div');
          portalBorder.className = 'portal-border';
          portalBorder.style.position = 'absolute';
          portalBorder.style.top = '0';
          portalBorder.style.left = '0';
          portalBorder.style.right = '0';
          portalBorder.style.bottom = '0';
          portalBorder.style.pointerEvents = 'none';
          portalBorder.style.boxShadow = `inset 0 0 30px ${colors.primary}80`;
          portalBorder.style.border = `1px solid ${colors.primary}`;
          
          // Insert as first child to keep it behind content
          if (section.firstChild) {
            section.insertBefore(portalBorder, section.firstChild);
          } else {
            section.appendChild(portalBorder);
          }
        });
      }
    }, 100);
  }

  /**
   * Trigger portal transition between sections
   */
  _triggerPortalTransition(fromSection, toSection) {
    // Prevent concurrent transitions
    if (this.state.isTransitioning) return;
    this.state.isTransitioning = true;
    
    // Get section IDs
    const fromId = fromSection.id;
    const toId = toSection.id;
    
    // Get section colors
    const fromColors = this.state.sectionColors[fromId] || { primary: '#ff00ff', secondary: '#00ffff' };
    const toColors = this.state.sectionColors[toId] || { primary: '#ff00ff', secondary: '#00ffff' };
    
    // Show the portal overlay
    const overlay = this.state.portalOverlay;
    overlay.style.opacity = '1';
    
    // Play portal enter sound
    if (this.config.enableAudio) {
      this._playPortalSound('enter');
    }
    
    // If HyperAV is available, integrate with the transition
    if (this.state.hyperAVInstance && this.config.useHyperAV) {
      // Update HyperAV parameters to match the transition
      this.state.hyperAVInstance.updateOptions({
        pattern: 'tesseract_fold',
        color1: fromColors.primary,
        color2: toColors.primary,
        speed: 0.1,
        opacity: 0.8
      });
    }
    
    // Start portal animation
    this._animatePortalTransition(fromColors, toColors, () => {
      // Transition complete
      this.state.isTransitioning = false;
      
      // Hide the portal overlay
      overlay.style.opacity = '0';
      
      // Play complete sound
      if (this.config.enableAudio) {
        this._playPortalSound('complete');
      }
      
      // Reset HyperAV if used
      if (this.state.hyperAVInstance && this.config.useHyperAV) {
        this.state.hyperAVInstance.updateOptions({
          pattern: 'tesseract',
          speed: 0.03,
          opacity: 0.4
        });
      }
      
      if (this.config.debugMode) {
        console.log(`Portal transition complete: ${fromId} → ${toId}`);
      }
    });
    
    if (this.config.debugMode) {
      console.log(`Portal transition started: ${fromId} → ${toId}`);
    }
  }

  /**
   * Animate the portal transition effect
   */
  _animatePortalTransition(fromColors, toColors, onComplete) {
    const canvas = this.state.portalCanvas;
    const ctx = this.state.portalContext;
    const startTime = performance.now();
    const duration = this.config.transitionDuration;
    const intensity = this.config.portalIntensity;
    
    // Create portal animation effect
    const animate = (timestamp) => {
      // Calculate progress (0 to 1)
      const progress = Math.min(1, (timestamp - startTime) / duration);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw portal effect based on progress
      this._drawPortalEffect(ctx, canvas.width, canvas.height, fromColors, toColors, progress, intensity);
      
      // Continue animation if not complete
      if (progress < 1) {
        this.state.portalAnimation = requestAnimationFrame(animate);
      } else {
        // Animation complete
        cancelAnimationFrame(this.state.portalAnimation);
        this.state.portalAnimation = null;
        
        // Run completion callback
        if (onComplete) onComplete();
      }
    };
    
    // Start animation
    this.state.portalAnimation = requestAnimationFrame(animate);
  }

  /**
   * Draw portal effect on canvas
   */
  _drawPortalEffect(ctx, width, height, fromColors, toColors, progress, intensity) {
    // Center of portal
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Portal size based on progress (grows then shrinks)
    let portalSize;
    if (progress < 0.5) {
      // Growing phase (0 to 1)
      portalSize = progress * 2;
    } else {
      // Shrinking phase (1 to 0)
      portalSize = 1 - ((progress - 0.5) * 2);
    }
    
    // Scale portal size by intensity and screen dimensions
    const maxSize = Math.max(width, height) * 1.2;
    const size = portalSize * maxSize * intensity;
    
    // Calculate warp factor (increases in middle of transition)
    const warpFactor = Math.sin(progress * Math.PI) * intensity;
    
    // Create gradient for portal ring
    const ringGradient = ctx.createRadialGradient(
      centerX, centerY, size * 0.8,
      centerX, centerY, size
    );
    
    // Interpolate colors based on progress
    const primaryColor = this._interpolateColor(fromColors.primary, toColors.primary, progress);
    const secondaryColor = this._interpolateColor(fromColors.secondary, toColors.secondary, progress);
    
    // Build gradient stops
    ringGradient.addColorStop(0, `${primaryColor}00`); // Transparent inner
    ringGradient.addColorStop(0.7, `${primaryColor}80`); // Semi-transparent middle
    ringGradient.addColorStop(0.9, `${secondaryColor}A0`); // Colored outer
    ringGradient.addColorStop(1, `${primaryColor}00`); // Transparent edge
    
    // Draw portal ring
    ctx.beginPath();
    ctx.fillStyle = ringGradient;
    ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw radial lines emanating from center
    const numLines = 24;
    const lineLength = size * 0.9;
    
    ctx.save();
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const distortion = Math.sin((progress * 5) + i) * warpFactor * 20;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      
      // Calculate end point with distortion
      const endX = centerX + Math.cos(angle) * (lineLength + distortion);
      const endY = centerY + Math.sin(angle) * (lineLength + distortion);
      
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    ctx.restore();
    
    // Draw swirl effect in center
    ctx.save();
    const swirlGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, size * 0.7
    );
    
    swirlGradient.addColorStop(0, `${secondaryColor}80`);
    swirlGradient.addColorStop(0.5, `${primaryColor}40`);
    swirlGradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = swirlGradient;
    ctx.globalAlpha = 0.8;
    
    ctx.beginPath();
    for (let radius = 0; radius < size * 0.7; radius += 5) {
      const innerProgress = radius / (size * 0.7);
      const spinFactor = (1 - innerProgress) * 20 * warpFactor;
      const points = 12;
      
      for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2 + (progress * spinFactor);
        const ptX = centerX + Math.cos(angle) * radius;
        const ptY = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(ptX, ptY);
        } else {
          ctx.lineTo(ptX, ptY);
        }
      }
    }
    ctx.fill();
    ctx.restore();
    
    // Add subtle glow around entire canvas at peak transition
    const glowIntensity = Math.sin(progress * Math.PI) * 0.7;
    if (glowIntensity > 0.2) {
      ctx.save();
      ctx.fillStyle = `${primaryColor}${Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')}`;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  /**
   * Interpolate between two colors based on progress
   */
  _interpolateColor(color1, color2, progress) {
    // Convert hex colors to RGB
    const r1 = parseInt(color1.slice(1, 3), 16);
    const g1 = parseInt(color1.slice(3, 5), 16);
    const b1 = parseInt(color1.slice(5, 7), 16);
    
    const r2 = parseInt(color2.slice(1, 3), 16);
    const g2 = parseInt(color2.slice(3, 5), 16);
    const b2 = parseInt(color2.slice(5, 7), 16);
    
    // Interpolate RGB values
    const r = Math.round(r1 + (r2 - r1) * progress);
    const g = Math.round(g1 + (g2 - g1) * progress);
    const b = Math.round(b1 + (b2 - b1) * progress);
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Manually trigger a transition to a specific section
   */
  transitionToSection(sectionId) {
    // Find section by ID
    const section = document.getElementById(sectionId);
    if (!section) {
      console.error(`Portal Transitions: Section "${sectionId}" not found`);
      return false;
    }
    
    // Skip if we're already on this section or transitioning
    if (this.state.currentSection === section || this.state.isTransitioning) {
      return false;
    }
    
    // Store previous section
    this.state.previousSection = this.state.currentSection;
    this.state.currentSection = section;
    
    // Trigger portal transition
    if (this.state.previousSection) {
      this._triggerPortalTransition(this.state.previousSection, section);
    }
    
    // Scroll to the section (will be smooth due to CSS)
    section.scrollIntoView();
    
    return true;
  }

  /**
   * Clean up resources
   */
  destroy() {
    // Cancel any active animations
    if (this.state.portalAnimation) {
      cancelAnimationFrame(this.state.portalAnimation);
      this.state.portalAnimation = null;
    }
    
    // Disconnect observer
    if (this.state.observer) {
      this.state.observer.disconnect();
      this.state.observer = null;
    }
    
    // Remove portal overlay
    if (this.state.portalOverlay) {
      this.state.portalOverlay.remove();
      this.state.portalOverlay = null;
    }
    
    // Close audio context
    if (this.state.audioContext) {
      this.state.audioContext.close();
      this.state.audioContext = null;
    }
    
    console.log('Portal Transitions: Destroyed');
  }
}

// Add CSS for portal sections
const addPortalStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    /* Portal section styles */
    .portal-section {
      scroll-snap-align: start;
      min-height: 100vh;
      width: 100%;
      position: relative;
      overflow: hidden;
      transition: transform 0.5s ease;
      padding: 4rem 2rem 2rem 2rem;
      box-sizing: border-box;
      background-color: rgba(0, 0, 60, 0.4);
    }
    
    /* Ensure each section has proper spacing */
    .portal-section > * {
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
    }
    
    /* General content container style */
    #magazine-content {
      width: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      scroll-snap-type: y mandatory;
      height: 100vh;
    }
    
    /* Portal transition animation */
    @keyframes portalWarp {
      0% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(2deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
    
    /* Section hover effects */
    .portal-section:hover .portal-border {
      box-shadow: inset 0 0 50px var(--accent2);
      animation: portalWarp 3s infinite ease-in-out;
    }
  `;
  document.head.appendChild(style);
};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add portal styles
  addPortalStyles();
  
  // Create global instance
  window.portalTransitions = new PortalTransitions({
    useHyperAV: true,
    enableAudio: true
  });
  
  console.log('Portal Transitions: Module loaded');
});

// Expose class for modular usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortalTransitions;
}