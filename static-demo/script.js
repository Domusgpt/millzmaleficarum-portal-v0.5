/**
 * MillzMaleficarum Codex v0.2 - Enhanced Edition
 * Frontend script for the dynamic magazine with hyperdimensional effects
 * Includes HyperAV integration and advanced visual enhancements
 */

// Track current display mode
let currentMode = 'rich'; // 'rich' or 'legacy'

document.addEventListener('DOMContentLoaded', function() {
  // Initialize HyperAV background
  initHyperAV();
  
  // Set up mode toggle buttons
  setupModeToggle();
  
  // Apply micro-animations to random elements
  initMicroAnimations();
  
  // Load magazine data (static version)
  setTimeout(() => {
    if (currentMode === 'rich') {
      renderRichMagazine(magazineData);
    } else {
      renderLegacyMagazine(legacyMagazineData);
    }
  }, 1000); // Show loading spinner for 1 second for effect
});

/**
 * Initializes the HyperAV background visualization
 */
function initHyperAV() {
  const container = document.getElementById('hyperav-container');
  if (!container || !window.HyperAVMinimal) return;
  
  try {
    window.hyperAV = new HyperAVMinimal(container, {
      autoRotate: true,
      randomizeParams: true,
      lowDetail: true,
      opacity: 0.6
    });
    
    // Randomize settings every 30-60 seconds
    setInterval(() => {
      if (window.hyperAV) {
        window.hyperAV.randomizeProjection();
      }
    }, Math.random() * 30000 + 30000);
  } catch (error) {
    console.error('Failed to initialize HyperAV:', error);
  }
}

/**
 * Initializes micro-animations on content elements
 */
function initMicroAnimations() {
  // Apply glitch effect to random paragraphs
  document.addEventListener('contentLoaded', () => {
    // Wait for content to be rendered
    setTimeout(() => {
      const paragraphs = document.querySelectorAll('.section-content p, .editorial-content p, .culture-content p, .tech-content p');
      for (let i = 0; i < paragraphs.length; i++) {
        if (Math.random() > 0.7) {
          paragraphs[i].style.animation = `microShift ${2 + Math.random() * 2}s infinite`;
          paragraphs[i].style.position = 'relative';
        }
      }
    }, 1500);
  });
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
      renderRichMagazine(magazineData);
    }
  });
  
  legacyModeBtn.addEventListener('click', () => {
    if (currentMode !== 'legacy') {
      currentMode = 'legacy';
      updateActiveButton(legacyModeBtn, richModeBtn);
      renderLegacyMagazine(legacyMagazineData);
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
 * Renders the magazine in rich format
 * @param {Object} data - The rich format magazine data
 */
function renderRichMagazine(data) {
  // Update header information
  document.querySelector('.title').textContent = 'The GEN-R-L MiLLz Manifesto';
  document.querySelector('.issue').textContent = '';
  document.querySelector('.issue-number').textContent = `Issue #${data.issue_number}`;
  document.querySelector('.issue-date').textContent = data.date;
  
  // Clear loading indicator
  const contentContainer = document.getElementById('magazine-content');
  contentContainer.innerHTML = '';
  
  // Create the cover section
  const coverSection = createCoverSection(data.sections.cover);
  contentContainer.appendChild(coverSection);
  
  // Create the editorial section
  const editorialSection = createEditorialSection(data.sections.editorial);
  contentContainer.appendChild(editorialSection);
  
  // Create the culture section
  const cultureSection = createCultureSection(data.sections.culture);
  contentContainer.appendChild(cultureSection);
  
  // Create the tech section
  const techSection = createTechSection(data.sections.tech);
  contentContainer.appendChild(techSection);
  
  // Create the interview section
  const interviewSection = createInterviewSection(data.sections.interview);
  contentContainer.appendChild(interviewSection);
  
  // Create the ads section
  const adsSection = createAdsSection(data.sections.ads);
  contentContainer.appendChild(adsSection);
  
  // Create the lore section
  const loreSection = createLoreSection(data.sections.lore_serial);
  contentContainer.appendChild(loreSection);
  
  // Add visual prompts if available
  if (data.sections.visual_prompts && data.sections.visual_prompts.length > 0) {
    createVisualPrompts(data.sections.visual_prompts);
  }
  
  // Add animation for sections to appear sequentially
  animateSections();
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
  content.innerHTML = processSigils(content.textContent);
  
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
  content.innerHTML = processSigils(content.textContent);
  
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
  content.innerHTML = processSigils(content.textContent);
  
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
  content.innerHTML = processSigils(content.textContent);
  
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
  title.innerHTML = processSigils(title.textContent);
  
  const content = document.createElement('div');
  content.className = 'lore-content';
  content.textContent = loreData.text;
  
  // Process sigils in content
  content.innerHTML = processSigils(content.textContent);
  
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
    section.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
      
      // Apply depth effect to add false sense of holographic depth
      applyDepthEffect(section);
      
      // Dispatch event when content is loaded
      if (index === sections.length - 1) {
        const event = new Event('contentLoaded');
        document.dispatchEvent(event);
      }
    }, 100 * index);
  });
}

/**
 * Applies a depth effect to create false sense of holographic depth
 * @param {HTMLElement} element - The element to apply the effect to
 */
function applyDepthEffect(element) {
  const titles = element.querySelectorAll('h2, h3');
  
  titles.forEach(title => {
    // Add depth shadow effect
    title.style.textShadow = '0 0 8px var(--accent2), 0 0 12px var(--accent1), 0 0 20px var(--primary)';
    
    // Add subtle floating animation
    title.style.animation = 'depthPulse 8s infinite';
    
    // Random rotation for some titles
    if (Math.random() > 0.7) {
      title.style.transform = `rotateX(${Math.random() * 5 - 2.5}deg) rotateY(${Math.random() * 5 - 2.5}deg)`;
      title.style.transformStyle = 'preserve-3d';
      title.style.perspective = '1000px';
    }
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