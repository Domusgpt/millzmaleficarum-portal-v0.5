#!/bin/bash
# Copy the portal transition files to shared storage
# Updated version with automatic permissions and backup

# Create destination directory
DEST_DIR="/mnt/shared/millzmaleficarum-portal-transitions"
BACKUP_DIR="/mnt/shared/millzmaleficarum-portal-backup-$(date +%Y%m%d_%H%M%S)"

# Create directories
mkdir -p "$DEST_DIR"
mkdir -p "$BACKUP_DIR"

# Backup existing files
if [ -d "$DEST_DIR" ]; then
  echo "Creating backup in $BACKUP_DIR"
  cp -r "$DEST_DIR"/* "$BACKUP_DIR/" 2>/dev/null
fi

# Copy the key files
cp -v public/enhanced-portal-transitions.js "$DEST_DIR/"
cp -v public/portal-transitions.css "$DEST_DIR/"
cp -v public/script.js "$DEST_DIR/"
cp -v data/current_magazine_data.json "$DEST_DIR/"
cp -v public/portal-transitions.js "$DEST_DIR/"
cp -v public/index.html "$DEST_DIR/"
cp -v CLAUDE.md "$DEST_DIR/"

# Set permissions for access
chmod -R 777 "$DEST_DIR"

echo "Files copied to $DEST_DIR"
echo "Permissions set to 777 for full access"
echo "Backup created in $BACKUP_DIR"
echo ""
echo "You can access them in your Android device at:"
echo "/storage/emulated/0/Claude Code/millzmaleficarum-portal-transitions/"