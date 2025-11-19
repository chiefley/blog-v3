#!/bin/bash

# Deploy built components to WordPress
# This is a template - customize for your Hostinger setup

# Configuration
WP_UPLOAD_DIR="/wp-content/uploads/react-components"
DIST_DIR="../../components/dist"

echo "WordPress Deployment Script"
echo "============================"
echo ""
echo "This script helps you deploy built components to WordPress."
echo "You'll need to customize this based on your Hostinger setup."
echo ""
echo "Options:"
echo "1. Manual upload via Hostinger file manager"
echo "2. FTP/SFTP (requires credentials)"
echo "3. WP-CLI (if available on your host)"
echo ""
echo "Built files are located in: $DIST_DIR"
echo "They should be uploaded to: $WP_UPLOAD_DIR"
echo ""
echo "Manual steps:"
echo "1. Log into Hostinger file manager or FTP client"
echo "2. Navigate to $WP_UPLOAD_DIR"
echo "3. Upload all files from $DIST_DIR"
echo ""
echo "Example FTP command (customize with your credentials):"
echo "  ftp -n yoursite.com <<END_SCRIPT"
echo "  quote USER your_username"
echo "  quote PASS your_password"
echo "  cd $WP_UPLOAD_DIR"
echo "  lcd $DIST_DIR"
echo "  mput *"
echo "  quit"
echo "  END_SCRIPT"
