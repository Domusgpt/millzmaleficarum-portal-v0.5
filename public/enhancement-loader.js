/**
 * MillzMaleficarum Codex v0.4
 * Enhancement Loader
 * Dynamically loads and initializes enhanced features
 */

class EnhancementLoader {
  constructor(options = {}) {
    // Default configuration
    this.config = {
      reactiveAnimations: options.reactiveAnimations !== false,
      infiniteScroll: options.infiniteScroll !== false,
      audioReactivity: options.audioReactivity !== false,
      enhancedDepth: options.enhancedDepth !== false,
      realityDistortion: options.realityDistortion !== false,
      debugMode: options.debugMode || false,
      performanceMode: options.performanceMode || 'auto', // 'auto', 'high', 'medium', 'low'
      loadAllOnInit: options.loadAllOnInit !== false
    };

    // State
    this.state = {
      loadedModules: {},
      deferredModules: [],
      isInitialized: false,
      performanceLevel: 0, // 0-1 value set based on device capabilities
      isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      initPromise: null
    };

    // Module registry
    this.modules = {
      reactiveAnimations: {
        src: '/reactive-animations.js',
        dependencies: [],
        initFunction: 'window.reactiveAnimations = new ReactiveAnimations({performanceMode: "' + this.config.performanceMode + '"})',
        minPerformance: 0.4,
        priority: 1
      },
      infiniteScroll: {
        src: '/infinite-scroll.js',
        dependencies: [],
        initFunction: 'window.infiniteScroll = new InfiniteScroll({contentContainer: "#magazine-content", enableGlitchEffects: true})',
        minPerformance: 0.5,
        priority: 2
      },
      hyperavAudio: {
        src: '/hyperav-audio.js',
        dependencies: ['hyperAV'],
        initFunction: 'window.hyperAVAudio = new HyperAVAudio({hyperAVInstance: window.hyperAV, autoplayOnInteraction: true})',
        minPerformance: 0.6,
        priority: 3
      }
    };

    // Initialize if requested
    if (this.config.loadAllOnInit) {
      this.init();
    }
  }

  /**
   * Initialize the enhancement loader
   */
  init() {
    if (this.state.isInitialized) return Promise.resolve();
    
    // Create promise for initialization
    this.state.initPromise = new Promise((resolve, reject) => {
      try {
        // Detect performance capabilities
        this._detectPerformance();
        
        // Determine which modules to load based on performance
        this._determineLoadableModules();
        
        // Load modules
        this._loadEnabledModules()
          .then(() => {
            this.state.isInitialized = true;
            console.log('Enhancement Loader: Initialization complete');
            resolve();
          })
          .catch(error => {
            console.error('Enhancement Loader: Initialization failed', error);
            reject(error);
          });
      } catch (error) {
        console.error('Enhancement Loader: Initialization failed', error);
        reject(error);
      }
    });
    
    return this.state.initPromise;
  }

  /**
   * Detect performance capabilities of the device
   */
  _detectPerformance() {
    if (this.config.performanceMode !== 'auto') {
      // Manual performance setting
      switch (this.config.performanceMode) {
        case 'high': this.state.performanceLevel = 1; break;
        case 'medium': this.state.performanceLevel = 0.6; break;
        case 'low': this.state.performanceLevel = 0.3; break;
        default: this.state.performanceLevel = 0.6;
      }
      return;
    }
    
    // Auto-detect based on device capabilities
    const browserInfo = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(browserInfo);
    const isOldBrowser = /MSIE|Trident|Edge\/1[0-5]/i.test(browserInfo);
    const memory = navigator.deviceMemory || 4; // Default to 4GB if not available
    
    // Performance score components
    let score = 0.7; // Default baseline score
    
    // Adjust based on device type
    if (isMobile) {
      score -= 0.3;
    }
    
    // Adjust based on browser
    if (isOldBrowser) {
      score -= 0.2;
    }
    
    // Adjust based on memory
    score += (memory / 16) * 0.2; // Max boost of 0.2 for 16GB+ devices
    
    // Adjust based on reduced motion preference
    if (this.state.isReducedMotion) {
      score -= 0.1;
    }
    
    // Clamp score between 0.2 and 1
    this.state.performanceLevel = Math.max(0.2, Math.min(1, score));
    
    if (this.config.debugMode) {
      console.log(`Enhancement Loader: Performance level set to ${this.state.performanceLevel.toFixed(2)}`);
    }
  }

  /**
   * Determine which modules to load based on performance level
   */
  _determineLoadableModules() {
    const performanceLevel = this.state.performanceLevel;
    
    // Check each module against config and performance level
    Object.keys(this.modules).forEach(moduleName => {
      const module = this.modules[moduleName];
      const configKey = module.configKey || moduleName;
      
      if (this.config[configKey] && performanceLevel >= module.minPerformance) {
        // Module is enabled and performance is sufficient
        if (this.config.debugMode) {
          console.log(`Enhancement Loader: Module '${moduleName}' will be loaded (performance: ${performanceLevel} >= ${module.minPerformance})`);
        }
      } else {
        // Module is disabled or performance is insufficient
        this.state.deferredModules.push(moduleName);
        
        if (this.config.debugMode) {
          const reason = !this.config[configKey] ? 'disabled in config' : 'insufficient performance';
          console.log(`Enhancement Loader: Module '${moduleName}' deferred (${reason})`);
        }
      }
    });
  }

  /**
   * Load all enabled modules
   */
  _loadEnabledModules() {
    const modulePromises = [];
    
    // Sort modules by priority
    const sortedModules = Object.keys(this.modules)
      .filter(name => !this.state.deferredModules.includes(name))
      .sort((a, b) => this.modules[a].priority - this.modules[b].priority);
    
    // Load each enabled module
    for (const moduleName of sortedModules) {
      modulePromises.push(this._loadModule(moduleName));
    }
    
    return Promise.all(modulePromises);
  }

  /**
   * Load a specific module
   */
  _loadModule(moduleName) {
    if (this.state.loadedModules[moduleName]) {
      return Promise.resolve(this.state.loadedModules[moduleName]);
    }
    
    const module = this.modules[moduleName];
    
    // Check dependencies
    const dependencyPromises = [];
    for (const dependency of module.dependencies) {
      if (typeof window[dependency] === 'undefined') {
        if (this.config.debugMode) {
          console.warn(`Enhancement Loader: Module '${moduleName}' depends on '${dependency}' which is not available`);
        }
        return Promise.reject(new Error(`Dependency '${dependency}' not available for module '${moduleName}'`));
      }
    }
    
    // Load the script
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = module.src;
      script.async = true;
      
      script.onload = () => {
        try {
          // Initialize the module if an init function is provided
          if (module.initFunction) {
            eval(module.initFunction);
          }
          
          this.state.loadedModules[moduleName] = true;
          
          if (this.config.debugMode) {
            console.log(`Enhancement Loader: Module '${moduleName}' loaded successfully`);
          }
          
          resolve(true);
        } catch (error) {
          console.error(`Enhancement Loader: Failed to initialize module '${moduleName}'`, error);
          reject(error);
        }
      };
      
      script.onerror = () => {
        const error = new Error(`Failed to load script for module '${moduleName}'`);
        console.error(`Enhancement Loader: ${error.message}`);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  }

  /**
   * Load a deferred module on demand
   */
  loadDeferredModule(moduleName) {
    if (!this.modules[moduleName]) {
      return Promise.reject(new Error(`Module '${moduleName}' not found`));
    }
    
    if (this.state.loadedModules[moduleName]) {
      return Promise.resolve(true);
    }
    
    // Check if module was deferred
    if (!this.state.deferredModules.includes(moduleName)) {
      return Promise.reject(new Error(`Module '${moduleName}' was not deferred`));
    }
    
    // Try to load the module
    return this._loadModule(moduleName)
      .then(() => {
        // Remove from deferred list if loaded successfully
        const index = this.state.deferredModules.indexOf(moduleName);
        if (index > -1) {
          this.state.deferredModules.splice(index, 1);
        }
        return true;
      });
  }

  /**
   * Create DOM trigger for manual loading
   */
  createManualTriggers() {
    if (this.state.deferredModules.length === 0) return;
    
    // Create container for triggers
    const container = document.createElement('div');
    container.className = 'enhancement-triggers';
    container.innerHTML = `
      <div class="triggers-title">Reality Depth Controls</div>
      <div class="triggers-content"></div>
    `;
    
    const content = container.querySelector('.triggers-content');
    
    // Create a button for each deferred module
    this.state.deferredModules.forEach(moduleName => {
      const module = this.modules[moduleName];
      if (!module) return;
      
      const trigger = document.createElement('button');
      trigger.className = 'enhancement-trigger';
      trigger.textContent = this._getDisplayName(moduleName);
      trigger.addEventListener('click', () => {
        trigger.classList.add('loading');
        this.loadDeferredModule(moduleName)
          .then(() => {
            trigger.classList.remove('loading');
            trigger.classList.add('active');
            trigger.disabled = true;
          })
          .catch(() => {
            trigger.classList.remove('loading');
            trigger.classList.add('error');
          });
      });
      
      content.appendChild(trigger);
    });
    
    // Add trigger for performance mode
    const performanceTrigger = document.createElement('button');
    performanceTrigger.className = 'enhancement-trigger performance-trigger';
    performanceTrigger.textContent = 'Maximize Performance';
    performanceTrigger.addEventListener('click', () => {
      this.config.performanceMode = 'high';
      this.state.performanceLevel = 1;
      
      // Try to load all deferred modules
      Promise.all(
        this.state.deferredModules.map(module => this.loadDeferredModule(module))
      ).then(() => {
        performanceTrigger.classList.add('active');
        performanceTrigger.disabled = true;
      });
    });
    content.appendChild(performanceTrigger);
    
    // Add styles
    this._addTriggerStyles();
    
    // Add to document
    document.body.appendChild(container);
  }

  /**
   * Get display name for module
   */
  _getDisplayName(moduleName) {
    switch (moduleName) {
      case 'reactiveAnimations': return 'Reactive Text';
      case 'infiniteScroll': return 'Infinite Scroll';
      case 'hyperavAudio': return 'Audio Reactive';
      default: return moduleName;
    }
  }

  /**
   * Add styles for manual triggers
   */
  _addTriggerStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .enhancement-triggers {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background-color: rgba(0, 0, 0, 0.7);
        border: 1px solid var(--accent-color, #00ffcc);
        border-radius: 5px;
        padding: 10px;
        color: var(--text-color, #ffffff);
        font-family: var(--mono-font, monospace);
        z-index: 1000;
        transform: translateY(calc(100% - 40px));
        transition: transform 0.3s ease;
        box-shadow: 0 0 10px rgba(0, 255, 204, 0.3);
        backdrop-filter: blur(5px);
      }
      
      .enhancement-triggers:hover {
        transform: translateY(0);
      }
      
      .triggers-title {
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 12px;
        margin-bottom: 10px;
        text-align: center;
        cursor: pointer;
      }
      
      .triggers-content {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .enhancement-trigger {
        background-color: rgba(0, 0, 0, 0.5);
        border: 1px solid var(--accent-color, #00ffcc);
        color: var(--accent-color, #00ffcc);
        padding: 8px 15px;
        border-radius: 3px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: var(--mono-font, monospace);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-size: 11px;
      }
      
      .enhancement-trigger:hover {
        background-color: rgba(0, 255, 204, 0.2);
      }
      
      .enhancement-trigger.loading {
        opacity: 0.7;
        background-image: linear-gradient(to right, transparent 0%, rgba(0, 255, 204, 0.2) 50%, transparent 100%);
        background-size: 200% 100%;
        animation: loading-animation 1s infinite;
      }
      
      .enhancement-trigger.active {
        background-color: rgba(0, 255, 204, 0.3);
        border-color: var(--accent-color, #00ffcc);
        color: white;
      }
      
      .enhancement-trigger.error {
        border-color: #ff3366;
        color: #ff3366;
      }
      
      .performance-trigger {
        margin-top: 10px;
        border-color: #ff33cc;
        color: #ff33cc;
      }
      
      .performance-trigger:hover {
        background-color: rgba(255, 51, 204, 0.2);
      }
      
      .performance-trigger.active {
        background-color: rgba(255, 51, 204, 0.3);
        border-color: #ff33cc;
        color: white;
      }
      
      @keyframes loading-animation {
        0% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create global instance with default settings
  window.enhancementLoader = new EnhancementLoader({
    reactiveAnimations: true,
    infiniteScroll: true,
    audioReactivity: true,
    enhancedDepth: true,
    realityDistortion: true,
    loadAllOnInit: true
  });
  
  // Create manual triggers for deferred modules
  setTimeout(() => {
    if (window.enhancementLoader) {
      window.enhancementLoader.createManualTriggers();
    }
  }, 2000);
  
  console.log('Enhancement Loader: Module loaded');
});

// Expose class for modular usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancementLoader;
}