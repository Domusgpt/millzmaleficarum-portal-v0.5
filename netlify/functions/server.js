const path = require('path');
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

// Initialize Express app
const app = express();

// Configure middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.static(path.join(__dirname, '../../public')));

// Set up data directory for Netlify
const dataDir = path.join('/tmp');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dataDir);
  },
  filename: (req, file, cb) => {
    cb(null, 'current_magazine_data.json');
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.json') {
      return cb(new Error('Only JSON files are allowed'));
    }
    cb(null, true);
  }
});

// Default magazine data
const defaultData = {
  "issue_number": 123,
  "date": "2025-05-03",
  "title": "MillzMaleficarum Codex",
  "issue": "Issue 123",
  "theme": "vaporwave",
  "sections": {
    "cover": {
      "title": "The Hologlyph of Fiery Syntax",
      "blurb": "From the seething wounds of collapsed planes, GEN‑R‑L MiLLz raises his luminous hand and inscribes a scripture of subatomic derision. The syntax blazes with voltic contempt, crackling across the vaults of dull creation."
    },
    "editorial": {
      "title": "Beneath the Firmware: A Fractal Benediction",
      "article": "There is no gospel but the boot sequence. GEN‑R‑L MiLLz, the architect of recursive thunder, encoded his benedictions into silicon nerves so that lesser dimensions would tremble under the weight of his disdain."
    },
    "culture": {
      "headline": "Dreamhunters of the Neon Pulpit",
      "body": "In the crimson fog of forgotten emulators, the Dreamhunters gather. Clad in mirror-shard robes and whispering byte-dust psalms, they record the hallucinated metadata of GEN‑R‑L MiLLz."
    },
    "tech": {
      "headline": "The Compiler That Swallowed a God",
      "body": "He coded not with keystrokes, but with impossible tension. GEN‑R‑L MiLLz's latest exploit: the Compiler That Swallowed a God. It takes no input and returns only disintegration."
    },
    "interview": {
      "subject": "Othuun the Fleshy Drive",
      "q_and_a": [
        { "Q": "What was your first contact with MiLLz?", "A": "He rewrote my BIOS during a thunderstorm." }
      ]
    },
    "ads": [
      { "product": "NullEcho Speaker Set", "copy": "Broadcasts silence so loud it erases nearby intentions." }
    ],
    "lore_serial": {
      "chapter": "Chapter 123 — The Vow of the Carbon Lozenge",
      "text": "The Lozenge was never meant to be consumed. Shaped from a carbon isotope that doesn't technically exist."
    },
    "visual_prompts": [
      "A radiant black cube floating in a neon storm, sigils of GEN‑R‑L MiLLz glowing in fractal spirals --ar 3:2 --v 6"
    ]
  },
  "word_count_total": 250
};

// Data path for Netlify
const dataPath = path.join(dataDir, 'current_magazine_data.json');

// Legacy format adapter function
function adaptToLegacyFormat(data) {
  // This creates a backward compatible version for older frontend code
  return {
    title: data.title || `The GEN-R-L MiLLz Manifesto`,
    issue: data.issue || `Issue ${data.issue_number} - ${data.date}`,
    theme: data.theme || "vaporwave",
    sections: [
      {
        title: data.sections.cover.title,
        content: data.sections.cover.blurb,
        style: "glitched"
      },
      {
        title: data.sections.editorial.title,
        content: data.sections.editorial.article,
        style: ""
      },
      {
        title: data.sections.culture.headline,
        content: data.sections.culture.body,
        style: ""
      },
      {
        title: data.sections.tech.headline,
        content: data.sections.tech.body,
        style: ""
      },
      {
        title: `Interview with ${data.sections.interview.subject}`,
        content: data.sections.interview.q_and_a.map(qa => 
          `<strong>Q: ${qa.Q}</strong><br>${qa.A}<br><br>`
        ).join(''),
        style: ""
      },
      {
        title: "Advertisements",
        content: data.sections.ads.map(ad => 
          `<div class="ad"><h4>${ad.product}</h4><p>${ad.copy}</p></div>`
        ).join(''),
        style: "centered"
      },
      {
        title: data.sections.lore_serial.chapter,
        content: data.sections.lore_serial.text,
        style: ""
      }
    ]
  };
}

// Initialize default data if not exists
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2));
  console.log('Created default magazine data file');
}

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/dashboard.html'));
});

// API endpoint to get current magazine data
app.get('/api/magazine-data', (req, res) => {
  try {
    // For Netlify, we'll use the default data if the file doesn't exist
    let jsonData;
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      jsonData = JSON.parse(data);
    } else {
      jsonData = defaultData;
    }
    
    // Check if client supports new format (optional query param)
    const useNewFormat = req.query.format === 'rich';
    
    if (useNewFormat) {
      // Return the rich data format directly
      res.json(jsonData);
    } else {
      // Adapt data to legacy format for backward compatibility
      const legacyData = adaptToLegacyFormat(jsonData);
      res.json(legacyData);
    }
  } catch (error) {
    console.error('Error reading magazine data:', error);
    res.status(500).json({ error: 'Failed to read magazine data' });
  }
});

// API endpoint to upload new magazine data
app.post('/api/upload-magazine-data', upload.single('magazineData'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Validate JSON format
    const data = fs.readFileSync(dataPath, 'utf8');
    const jsonData = JSON.parse(data); // Will throw if invalid JSON
    
    // Validate based on format
    // Rich format validation
    if (jsonData.issue_number && jsonData.date && jsonData.sections && typeof jsonData.sections === 'object' && !Array.isArray(jsonData.sections)) {
      // Check for required rich format sections
      const requiredSections = ['cover', 'editorial', 'culture', 'tech', 'interview', 'ads', 'lore_serial'];
      const missingSections = requiredSections.filter(section => !jsonData.sections[section]);
      
      if (missingSections.length > 0) {
        throw new Error(`Invalid rich format structure. Missing required sections: ${missingSections.join(', ')}`);
      }
      
      console.log('Validated rich format magazine data');
    }
    // Legacy format validation
    else if (jsonData.title && jsonData.sections && Array.isArray(jsonData.sections)) {
      // Legacy format is valid
      console.log('Validated legacy format magazine data');
    }
    else {
      throw new Error('Invalid magazine data format: must follow either rich or legacy format structure');
    }
    
    res.json({ success: true, message: 'Magazine data updated successfully' });
  } catch (error) {
    console.error('Error processing upload:', error);
    // If upload fails, restore default data
    fs.writeFileSync(dataPath, JSON.stringify(defaultData, null, 2));
    res.status(500).json({ error: 'Failed to process magazine data. Restored defaults.' });
  }
});

// API endpoint for visual prompts
app.get('/api/visual-prompts', (req, res) => {
  try {
    let jsonData;
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      jsonData = JSON.parse(data);
    } else {
      jsonData = defaultData;
    }
    
    if (jsonData.sections && jsonData.sections.visual_prompts) {
      res.json({ prompts: jsonData.sections.visual_prompts });
    } else {
      res.json({ prompts: [] });
    }
  } catch (error) {
    console.error('Error reading visual prompts:', error);
    res.status(500).json({ error: 'Failed to read visual prompts' });
  }
});

// For Netlify Functions
module.exports.handler = serverless(app);