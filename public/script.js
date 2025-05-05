/**
 * MillzMaleficarum Codex v0.2
 * Main frontend script for the dynamic magazine
 * Enhanced with HyperAV integration, navigation, and advanced layouts
 */

// Track current display mode
let currentMode = 'rich'; // 'rich' or 'legacy'

document.addEventListener('DOMContentLoaded', function() {
  // Set up navigation
  setupNavigation();
  
  // Set up mode toggle buttons
  setupModeToggle();
  
  // Set up refresh button
  setupRefreshButton();
  
  // Fetch magazine data from server
  fetchMagazineData(currentMode);
  
  // Set up scroll reveal effect
  setupScrollReveal();
});

/**
 * Sets up the navigation functionality
 */
function setupNavigation() {
  const navToggle = document.getElementById('navToggle');
  const magazineNav = document.getElementById('magazine-nav');
  
  // Toggle navigation when button is clicked
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      magazineNav.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }
  
  // Close navigation when clicking outside
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#magazine-nav') && 
        !event.target.closest('#navToggle') && 
        magazineNav.classList.contains('active')) {
      magazineNav.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });
}

/**
 * Sets up scroll reveal animation for content
 */
function setupScrollReveal() {
  // Set up intersection observer for reveal animations
  const revealItems = document.querySelectorAll('.reveal-item');
  
  if (revealItems.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealItems.forEach(item => {
      revealObserver.observe(item);
    });
  }
}

/**
 * Sets up the refresh button functionality
 */
function setupRefreshButton() {
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      console.log('Manual refresh triggered');
      // Force clear browser cache for this page
      if (window.caches) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      // Reload with cache bypass
      fetchMagazineData(currentMode);
    });
  }
}

/**
 * Sets up the display mode toggle buttons
 */
function setupModeToggle() {
  const richModeBtn = document.getElementById('richModeBtn');
  const legacyModeBtn = document.getElementById('legacyModeBtn');
  
  richModeBtn.addEventListener('click', () => {
    if (currentMode !== 'rich') {
      currentMode = 'rich';
      updateActiveButton(richModeBtn, legacyModeBtn);
      fetchMagazineData('rich');
    }
  });
  
  legacyModeBtn.addEventListener('click', () => {
    if (currentMode !== 'legacy') {
      currentMode = 'legacy';
      updateActiveButton(legacyModeBtn, richModeBtn);
      fetchMagazineData('legacy');
    }
  });
}

/**
 * Updates the active state of toggle buttons
 */
function updateActiveButton(activeBtn, inactiveBtn) {
  activeBtn.classList.add('active');
  inactiveBtn.classList.remove('active');
}

/**
 * Fetches magazine data from the server API
 * @param {String} mode - The display mode ('rich' or 'legacy')
 */
async function fetchMagazineData(mode) {
  try {
    // Show loading state
    const contentContainer = document.getElementById('magazine-content');
    contentContainer.innerHTML = `
      <div class="loading">
        <div class="cybr-spinner">
          <div class="loader"></div>
          <span class="loading-text">Manifesting Codex...</span>
        </div>
      </div>
    `;
    
    // Hide visual prompts section during loading
    document.getElementById('visual-prompts').classList.add('hidden');
    
    // Add timestamp query parameter to prevent caching
    const timestamp = new Date().getTime();
    
    // Use query parameter for rich format if needed
    const url = mode === 'rich' 
      ? `/api/magazine-data?format=rich&t=${timestamp}` 
      : `/api/magazine-data?t=${timestamp}`;
      
    console.log(`Fetching data from ${url}`);
    
    // Add cache control headers to prevent caching
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      cache: 'no-store'
    };
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch magazine data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Received magazine data, issue #${data.issue_number || 'unknown'}`);
    
    // Render based on mode
    if (mode === 'rich') {
      renderRichMagazine(data);
    } else {
      renderLegacyMagazine(data);
    }
    
    // Update HyperAV background if available
    if (data.effects && data.effects.hyperav_background && window.hyperAV) {
      updateHyperAVBackground(data.effects.hyperav_background);
    }
    
    // Initialize portal transitions if available
    if (data.effects && data.effects.portal_transitions && data.effects.portal_transitions.enabled) {
      initializePortalTransitions(data.effects.portal_transitions);
    }
  } catch (error) {
    console.error('Error fetching magazine data:', error);
    displayErrorMessage(`Failed to load magazine content: ${error.message}`);
  }
}

/**
 * Updates the HyperAV background visualization
 * @param {Object} config - Background configuration
 */
function updateHyperAVBackground(config) {
  if (!config.enabled || !window.hyperAV) return;
  
  window.hyperAV.updateOptions({
    pattern: config.pattern || 'tesseract',
    color1: config.color1 || '#00ffcc',
    color2: config.color2 || '#ff33cc',
    speed: config.animation_speed || 0.03,
    opacity: 0.4
  });
  
  // Show the container
  document.getElementById('hyperav-background').style.opacity = '1';
}

/**
 * Initializes the enhanced portal transitions system
 * @param {Object} config - Portal transitions configuration
 */
function initializePortalTransitions(config) {
  // Check if portal transitions are already initialized
  if (window.portalTransitions) {
    console.log('Portal transitions already initialized, updating configuration');
    
    // Update configuration options
    const options = {
      transitionDuration: 1500,
      useHyperAV: config.hyperav_enabled !== false,
      portalIntensity: config.intensity || 0.8,
      enableAudio: config.audio_enabled !== false,
      enable4DEffects: config['4d_effects'] !== false
    };
    
    // Pass color configuration if available
    if (config.colors) {
      // Convert colors from the JSON structure to the format expected by PortalTransitions
      const sectionColors = {};
      Object.keys(config.colors).forEach(sectionId => {
        sectionColors[sectionId] = {
          primary: config.colors[sectionId].primary,
          secondary: config.colors[sectionId].secondary,
          accent: config.colors[sectionId].accent
        };
      });
      
      options.sectionColors = sectionColors;
    }
    
    // Apply configuration to existing instance
    window.portalTransitions.updateOptions(options);
  } else {
    console.log('Initializing portal transitions with configuration', config);
    
    // Use the enhanced portal transitions if available,
    // otherwise fall back to the basic version
    if (typeof PortalTransitions !== 'undefined') {
      window.portalTransitions = new PortalTransitions({
        transitionDuration: 1500,
        useHyperAV: config.hyperav_enabled !== false,
        portalIntensity: config.intensity || 0.8,
        enableAudio: config.audio_enabled !== false,
        enable4DEffects: config['4d_effects'] !== false
      });
      
      // Add portal colors if available
      if (config.colors) {
        window.portalTransitions.updateSectionColors(config.colors);
      }
    }
  }
  
  // Create portal navigation controls if specified
  if (config.portal_nav || (window.magazineData && window.magazineData.navigation && window.magazineData.navigation.portal_nav)) {
    createPortalNavControls();
  }
}

/**
 * Renders the magazine in rich format
 * @param {Object} data - The rich format magazine data
 */
function renderRichMagazine(data) {
  // Update header information
  document.querySelector('.title').textContent = data.title || 'The GEN-R-L MiLLz Manifesto';
  document.querySelector('.issue').textContent = '';
  document.querySelector('.issue-number').textContent = `Issue #${data.issue_number}`;
  document.querySelector('.issue-date').textContent = data.date;
  
  // Clear loading indicator
  const contentContainer = document.getElementById('magazine-content');
  contentContainer.innerHTML = '';
  
  // Create navigation items if available
  if (data.navigation && data.navigation.items) {
    createNavigationItems(data.navigation.items);
  } else {
    // Create default navigation items
    createDefaultNavigationItems(data);
  }
  
  // Create sections with layouts if specified
  const sections = [
    { id: 'cover', data: data.sections.cover, createFn: createCoverSection },
    { id: 'editorial', data: data.sections.editorial, createFn: createEditorialSection },
    { id: 'culture', data: data.sections.culture, createFn: createCultureSection },
    { id: 'tech', data: data.sections.tech, createFn: createTechSection },
    { id: 'interview', data: data.sections.interview, createFn: createInterviewSection },
    { id: 'ads', data: data.sections.ads, createFn: createAdsSection },
    { id: 'lore', data: data.sections.lore_serial, createFn: createLoreSection }
  ];
  
  // Create each section with layout if specified
  sections.forEach(section => {
    if (section.data) {
      const sectionElement = section.createFn(section.data);
      
      // Apply layout if specified
      if (data.layout && data.layout[section.id]) {
        applyLayout(sectionElement, data.layout[section.id]);
      }
      
      // Add section ID for navigation
      sectionElement.id = section.id;
      
      contentContainer.appendChild(sectionElement);
    }
  });
  
  // Add visual prompts if available
  if (data.sections.visual_prompts && data.sections.visual_prompts.length > 0) {
    createVisualPrompts(data.sections.visual_prompts);
    
    // Apply layout if specified
    if (data.layout && data.layout.visuals) {
      const visualsSection = document.getElementById('visual-prompts');
      applyLayout(visualsSection, data.layout.visuals);
    }
  }
  
  // Add animation for sections to appear sequentially
  animateSections();
  
  // Add micro-animations to text elements
  addMicroAnimations();
  
  // Add scanline effect if requested
  if (data.effects && data.effects.scanlines) {
    document.body.classList.add('scanlines');
  }
  
  // Store magazine data globally for other functions
  window.magazineData = data;
  
  // Apply global layout settings if available
  if (data.layout && data.layout.global) {
    applyGlobalLayout(data.layout.global);
  }
}

/**
 * Creates navigation items based on the provided data
 * @param {Array} navItems - The navigation items data
 */
function createNavigationItems(navItems) {
  const navList = document.getElementById('nav-items');
  if (!navList) return;
  
  // Clear existing items
  navList.innerHTML = '';
  
  // Create each navigation item
  navItems.forEach(item => {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.setAttribute('data-target', item.id);
    
    // Create icon if specified
    let iconHtml = '';
    if (item.icon) {
      iconHtml = `<div class="nav-item-icon">${getIconForNav(item.icon)}</div>`;
    }
    
    li.innerHTML = `
      ${iconHtml}
      <div class="nav-item-label">${item.label}</div>
    `;
    
    // Add click event to scroll to section
    li.addEventListener('click', () => {
      const targetSection = document.getElementById(item.id);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Update active navigation item
        document.querySelectorAll('.nav-item').forEach(navItem => {
          navItem.classList.remove('active');
        });
        li.classList.add('active');
        
        // Close navigation on mobile
        document.getElementById('magazine-nav').classList.remove('active');
      }
    });
    
    navList.appendChild(li);
  });
}

/**
 * Creates default navigation items based on the magazine sections
 * @param {Object} data - The magazine data
 */
function createDefaultNavigationItems(data) {
  const defaultItems = [
    { id: 'cover', label: 'Cover', icon: 'cube' },
    { id: 'editorial', label: 'Editorial', icon: 'book' },
    { id: 'culture', label: 'Culture', icon: 'eye' },
    { id: 'tech', label: 'Tech', icon: 'circuit' },
    { id: 'interview', label: 'Interview', icon: 'chat' },
    { id: 'ads', label: 'Products', icon: 'cart' },
    { id: 'lore', label: 'Lore', icon: 'scroll' },
    { id: 'visual-prompts', label: 'Visuals', icon: 'image' }
  ];
  
  createNavigationItems(defaultItems);
}

/**
 * Returns HTML for icons in navigation
 * @param {String} icon - The icon name
 * @returns {String} HTML for the icon
 */
function getIconForNav(icon) {
  const icons = {
    'cube': '◨',
    'brain': '≋',
    'eye': '◉',
    'circuit': '⌘',
    'spiral': '๑',
    'cart': '☍',
    'book': '⌖',
    'image': '⌅',
    'scroll': '≡',
    'chat': '◎'
  };
  
  return icons[icon] || '◆';
}

/**
 * Applies layout to a section based on configuration
 * @param {HTMLElement} element - The section element
 * @param {Object} layout - The layout configuration
 */
function applyLayout(element, layout) {
  if (!element || !layout) return;
  
  // Apply layout type
  if (layout.type) {
    element.classList.add(layout.type);
  }
  
  // Apply depth effect
  if (layout.depth_effect) {
    element.classList.add('depth-effect');
    
    // Add portal effect if specified
    if (layout.portal_intensity) {
      element.setAttribute('data-portal-intensity', layout.portal_intensity);
    }
    
    // Add depth layers to children
    const children = element.children;
    if (children.length > 0) {
      children[0].classList.add('depth-layer-front'); // Title/header
      if (children.length > 1) {
        children[1].classList.add('depth-layer-mid'); // Content
      }
    }
  }
  
  // Apply column count for text
  if (layout.column_count && element.querySelector('.lore-content, .editorial-content')) {
    const content = element.querySelector('.lore-content, .editorial-content');
    if (content) {
      content.style.columnCount = layout.column_count;
    }
  }
  
  // Apply width ratio for layouts like two-column and sidebar-main
  if (layout.width_ratio && layout.type && (layout.type === 'two-column' || layout.type === 'sidebar-main')) {
    element.style.gridTemplateColumns = layout.width_ratio.map(ratio => `${ratio}fr`).join(' ');
  }
  
  // Apply columns for grid layouts
  if (layout.columns && layout.type && layout.type === 'masonry-grid') {
    element.style.columnCount = layout.columns;
  }
  
  // Apply animation if specified
  if (layout.animation) {
    element.setAttribute('data-animation', layout.animation);
    
    if (layout.animation === 'glitch_reveal') {
      element.querySelectorAll('h1, h2, h3').forEach(heading => {
        heading.classList.add('glitched');
      });
    }
  }
}

/**
 * Adds micro-animations to various text elements
 */
function addMicroAnimations() {
  // Add subtle animation to section titles
  document.querySelectorAll('.section-title, .culture-title, .tech-title, .interview-title').forEach(title => {
    title.classList.add('micro-animate');
  });
  
  // Add pulse effect to sigils
  document.querySelectorAll('.sigil').forEach(sigil => {
    sigil.classList.add('micro-pulse');
  });
  
  // Add glitch effect to certain texts
  document.querySelectorAll('.ad-product').forEach(element => {
    element.classList.add('micro-glitch');
    element.setAttribute('data-text', element.textContent);
  });
}

/**
 * Creates the cover section element
 * @param {Object} coverData - The cover section data
 * @returns {HTMLElement} The cover section element
 */
function createCoverSection(coverData) {
  const section = document.createElement('div');
  section.className = 'cover-section';
  
  const title = document.createElement('h2');
  title.className = 'cover-title';
  title.textContent = coverData.title;
  
  const content = document.createElement('div');
  content.className = 'cover-content';
  content.textContent = coverData.blurb;
  
  // Process sigils
  content.innerHTML = processSigils(content.innerHTML);
  
  section.appendChild(title);
  section.appendChild(content);
  
  return section;
}

/**
 * Creates the editorial section element
 * @param {Object} editorialData - The editorial section data
 * @returns {HTMLElement} The editorial section element
 */
function createEditorialSection(editorialData) {
  const section = document.createElement('div');
  section.className = 'editorial-section';
  
  const title = document.createElement('h2');
  title.className = 'editorial-title';
  title.textContent = editorialData.title;
  
  const content = document.createElement('div');
  content.className = 'editorial-content';
  content.textContent = editorialData.article;
  
  // Process sigils
  content.innerHTML = processSigils(content.innerHTML);
  
  section.appendChild(title);
  section.appendChild(content);
  
  return section;
}

/**
 * Creates the culture section element
 * @param {Object} cultureData - The culture section data
 * @returns {HTMLElement} The culture section element
 */
function createCultureSection(cultureData) {
  const section = document.createElement('div');
  section.className = 'culture-section';
  
  const title = document.createElement('h2');
  title.className = 'culture-title';
  title.textContent = cultureData.headline;
  
  const content = document.createElement('div');
  content.className = 'culture-content';
  content.textContent = cultureData.body;
  
  // Process sigils
  content.innerHTML = processSigils(content.innerHTML);
  
  section.appendChild(title);
  section.appendChild(content);
  
  return section;
}

/**
 * Creates the tech section element
 * @param {Object} techData - The tech section data
 * @returns {HTMLElement} The tech section element
 */
function createTechSection(techData) {
  const section = document.createElement('div');
  section.className = 'tech-section';
  
  const title = document.createElement('h2');
  title.className = 'tech-title';
  title.textContent = techData.headline;
  
  const content = document.createElement('div');
  content.className = 'tech-content';
  content.textContent = techData.body;
  
  // Process sigils
  content.innerHTML = processSigils(content.innerHTML);
  
  section.appendChild(title);
  section.appendChild(content);
  
  return section;
}

/**
 * Creates the interview section element
 * @param {Object} interviewData - The interview section data
 * @returns {HTMLElement} The interview section element
 */
function createInterviewSection(interviewData) {
  const section = document.createElement('div');
  section.className = 'interview-section';
  
  const title = document.createElement('h2');
  title.className = 'interview-title';
  title.textContent = `Interview with ${interviewData.subject}`;
  
  section.appendChild(title);
  
  // Create Q&A items
  interviewData.q_and_a.forEach(qa => {
    const item = document.createElement('div');
    item.className = 'interview-item';
    
    const question = document.createElement('div');
    question.className = 'interview-question';
    question.textContent = `Q: ${qa.Q}`;
    
    const answer = document.createElement('div');
    answer.className = 'interview-answer';
    answer.textContent = qa.A;
    
    item.appendChild(question);
    item.appendChild(answer);
    section.appendChild(item);
  });
  
  return section;
}

/**
 * Creates the ads section element
 * @param {Array} adsData - The ads section data
 * @returns {HTMLElement} The ads section element
 */
function createAdsSection(adsData) {
  const section = document.createElement('div');
  section.className = 'ads-section';
  
  // Create ad items
  adsData.forEach(ad => {
    const item = document.createElement('div');
    item.className = 'ad-item';
    
    const product = document.createElement('h3');
    product.className = 'ad-product';
    product.textContent = ad.product;
    
    const copy = document.createElement('p');
    copy.className = 'ad-copy';
    copy.textContent = ad.copy;
    
    item.appendChild(product);
    item.appendChild(copy);
    section.appendChild(item);
  });
  
  return section;
}

/**
 * Creates the lore section element
 * @param {Object} loreData - The lore section data
 * @returns {HTMLElement} The lore section element
 */
function createLoreSection(loreData) {
  const section = document.createElement('div');
  section.className = 'lore-section';
  
  const title = document.createElement('h2');
  title.className = 'lore-title';
  title.textContent = loreData.chapter;
  
  // Process sigils in title
  title.innerHTML = processSigils(title.innerHTML);
  
  const content = document.createElement('div');
  content.className = 'lore-content';
  content.textContent = loreData.text;
  
  // Process sigils in content
  content.innerHTML = processSigils(content.innerHTML);
  
  section.appendChild(title);
  section.appendChild(content);
  
  return section;
}

/**
 * Creates and displays the visual prompts section
 * @param {Array} promptsData - The visual prompts data
 */
function createVisualPrompts(promptsData) {
  const promptsSection = document.getElementById('visual-prompts');
  const promptsGrid = promptsSection.querySelector('.prompt-grid');
  
  // Clear any existing prompts
  promptsGrid.innerHTML = '';
  
  // Create prompt items
  promptsData.forEach(prompt => {
    const item = document.createElement('div');
    item.className = 'prompt-item';
    item.textContent = prompt;
    promptsGrid.appendChild(item);
  });
  
  // Show the prompts section
  promptsSection.classList.remove('hidden');
}

/**
 * Renders the magazine content in legacy format
 * @param {Object} data - The magazine data in legacy format
 */
function renderLegacyMagazine(data) {
  // Update header information
  document.querySelector('.title').textContent = data.title || 'MillzMaleficarum Codex';
  document.querySelector('.issue').textContent = data.issue || 'v0.1';
  document.querySelector('.issue-number').textContent = '';
  document.querySelector('.issue-date').textContent = '';
  
  // Apply theme if specified
  if (data.theme) {
    document.body.setAttribute('data-theme', data.theme);
  }
  
  // Clear loading indicator
  const contentContainer = document.getElementById('magazine-content');
  contentContainer.innerHTML = '';
  
  // Hide visual prompts section in legacy mode
  document.getElementById('visual-prompts').classList.add('hidden');
  
  // Create default navigation items
  createDefaultNavigationItems(data);
  
  // Render each section
  if (data.sections && data.sections.length > 0) {
    data.sections.forEach((section, index) => {
      const sectionElement = createLegacySectionElement(section, index);
      contentContainer.appendChild(sectionElement);
    });
  } else {
    // Handle empty content
    contentContainer.innerHTML = '<div class="section centered">' +
      '<h2 class="section-title">No Content</h2>' +
      '<p class="section-content">The codex appears to be empty.</p>' +
      '</div>';
  }
  
  // Add animation for sections to appear sequentially
  animateSections();
}

/**
 * Creates a DOM element for a magazine section in legacy format
 * @param {Object} section - The section data
 * @param {Number} index - The section index
 * @returns {HTMLElement} The section DOM element
 */
function createLegacySectionElement(section, index) {
  const sectionElement = document.createElement('div');
  sectionElement.className = `section ${section.style || ''}`;
  sectionElement.setAttribute('data-index', index);
  sectionElement.id = `section-${index}`;
  
  const titleElement = document.createElement('h2');
  titleElement.className = 'section-title';
  titleElement.textContent = section.title || `Section ${index + 1}`;
  
  const contentElement = document.createElement('div');
  contentElement.className = 'section-content';
  contentElement.innerHTML = section.content || '';
  
  sectionElement.appendChild(titleElement);
  sectionElement.appendChild(contentElement);
  
  // Add special effects based on style
  if (section.style === 'glitched') {
    titleElement.classList.add('glitched');
  }
  
  return sectionElement;
}

/**
 * Animates sections to appear sequentially
 */
function animateSections() {
  // Get all sections (both rich and legacy formats)
  const sections = document.querySelectorAll('.section, .cover-section, .editorial-section, .culture-section, .tech-section, .interview-section, .ads-section, .lore-section');
  
  sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px) translateZ(5px)';
    setTimeout(() => {
      section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      section.style.opacity = '1';
      section.style.transform = 'translateY(0) translateZ(5px)';
    }, 100 * index);
  });
}

/**
 * Processes text to convert sigil tags into styled spans
 * @param {String} text - The text to process
 * @returns {String} The processed text with sigil spans
 */
function processSigils(text) {
  return text.replace(/<sigil-([^>]+)>/g, '<span class="sigil">$1</span>');
}

/**
 * Displays an error message to the user
 * @param {String} message - The error message to display
 */
function displayErrorMessage(message) {
  const contentContainer = document.getElementById('magazine-content');
  contentContainer.innerHTML = `
    <div class="error-message">
      <h2>Error</h2>
      <p>${message}</p>
    </div>
  `;
}

/**
 * Creates visual prompts section
 * @param {Array} prompts - The visual prompts array
 */
function createVisualPrompts(prompts) {
  const visualsSection = document.getElementById('visual-prompts');
  const promptGrid = visualsSection.querySelector('.prompt-grid');
  
  // Clear existing prompts
  promptGrid.innerHTML = '';
  
  // Create each prompt
  prompts.forEach(prompt => {
    const promptItem = document.createElement('div');
    promptItem.className = 'prompt-item';
    promptItem.textContent = prompt;
    promptGrid.appendChild(promptItem);
  });
  
  // Show the section
  visualsSection.classList.remove('hidden');
}

/**
 * Applies global layout settings to the document
 * @param {Object} globalLayout - The global layout configuration
 */
function applyGlobalLayout(globalLayout) {
  // Apply snap scrolling if specified
  if (globalLayout.snap_scroll) {
    const contentContainer = document.getElementById('magazine-content');
    if (contentContainer) {
      contentContainer.classList.add('snap-scroll');
    }
    
    // Add class to HTML root for global snap scrolling support
    document.documentElement.classList.add('snap-scroll-root');
  }
  
  // Apply portal transitions if specified
  if (globalLayout.transition_style === 'portal') {
    document.documentElement.classList.add('portal-transitions-enabled');
    
    // Add class to content container for portal styles
    const contentContainer = document.getElementById('magazine-content');
    if (contentContainer) {
      contentContainer.classList.add('portal-container');
    }
  }
}

/**
 * Creates portal navigation controls
 */
function createPortalNavControls() {
  // Check if controls already exist
  if (document.querySelector('.portal-nav-controls')) {
    return;
  }
  
  // Create controls container
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'portal-nav-controls';
  
  // Get sections and create a navigation dot for each
  const sections = document.querySelectorAll('.cover-section, .editorial-section, .culture-section, .tech-section, .interview-section, .ads-section, .lore-section');
  
  sections.forEach((section, index) => {
    const navButton = document.createElement('div');
    navButton.className = 'portal-nav-button';
    navButton.setAttribute('data-section', section.id);
    
    // Mark first section as active
    if (index === 0) {
      navButton.classList.add('active');
    }
    
    // Set custom color if available in magazine data
    if (window.magazineData && 
        window.magazineData.navigation && 
        window.magazineData.navigation.items) {
      
      const navItem = window.magazineData.navigation.items.find(item => item.id === section.id);
      if (navItem && navItem.portal_color) {
        navButton.style.backgroundColor = navItem.portal_color;
      }
    }
    
    // Add click handler to trigger transition
    navButton.addEventListener('click', () => {
      if (window.portalTransitions) {
        window.portalTransitions.transitionToSection(section.id);
        
        // Update active button
        document.querySelectorAll('.portal-nav-button').forEach(btn => {
          btn.classList.remove('active');
        });
        navButton.classList.add('active');
      } else {
        // Fallback to standard scrolling
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    controlsContainer.appendChild(navButton);
  });
  
  // Append controls to body
  document.body.appendChild(controlsContainer);
  
  // Set up intersection observer to update active dot
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        const sectionId = entry.target.id;
        const navButton = document.querySelector(`.portal-nav-button[data-section="${sectionId}"]`);
        
        if (navButton) {
          document.querySelectorAll('.portal-nav-button').forEach(btn => {
            btn.classList.remove('active');
          });
          navButton.classList.add('active');
        }
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px'
  });
  
  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
  });
}