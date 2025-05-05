# Portal Transitions Development Guide

This guide provides instructions for developing and deploying the portal transitions feature for MillzMaleficarum Digital Magazine.

## Repository

- **GitHub**: https://github.com/Domusgpt/millzmaleficarum-portal-v0.5
- **Local Path**: `/root/millzmaleficarum-codex-v0.4/`
- **Deployment**: https://millzmaleficarum-portal-v05.fly.dev/

## Key Files

- **Enhanced Portal Transitions**: `public/enhanced-portal-transitions.js`
- **Portal CSS**: `public/portal-transitions.css`
- **Magazine Data**: `data/current_magazine_data.json`
- **Main Script**: `public/script.js`

## Development Workflow

### Creating a Feature Branch

Use the provided script to create a new feature branch:

```bash
./create-portal-feature-branch.sh feature-name
```

Example:
```bash
./create-portal-feature-branch.sh improved-tesseract
```

### Accessing Files on Android

Files are automatically copied to shared storage for Android access:

```bash
./copy-to-shared.sh
```

Files will be available at:
`/storage/emulated/0/Claude Code/millzmaleficarum-portal-transitions/`

### Deployment

The site is automatically deployed via GitHub Actions when changes are pushed to master. You can also deploy manually:

```bash
# Make sure Fly.io is configured
export FLYCTL_INSTALL="/root/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Deploy to Fly.io
flyctl deploy --app millzmaleficarum-portal-v05
```

## Portal Configuration

Portal transitions are configured in the magazine data JSON:

```json
"effects": {
  "portal_transitions": {
    "enabled": true,
    "intensity": 0.95,
    "audio_enabled": true,
    "visual_style": "hyperdimensional",
    "4d_effects": true,
    "hyperav_enabled": true,
    "direction_aware": true,
    "mouse_reactive": true,
    "colors": {
      "cover": { "primary": "#ff00aa", "secondary": "#00eeff", "accent": "#ff33ff" },
      ...
    }
  }
}
```

## Integration Testing

After making changes, test the following:

1. Portal transitions between sections
2. Direction-aware effects (scrolling up vs down)
3. HyperAV integration during transitions
4. Audio synthesis during transitions
5. Mobile and desktop compatibility
6. Performance impact

## Future Enhancements

- Add more transition styles beyond the current options
- Implement interactive portal elements
- Create fully customizable transition parameters
- Optimize performance for low-end devices
- Create more advanced 4D visualization during transitions