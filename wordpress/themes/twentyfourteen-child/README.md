# Twenty Fourteen Child Theme

A child theme for WordPress Twenty Fourteen with custom modifications for a classic blog layout.

## Installation

### Upload to WordPress

1. **Zip the theme folder:**
   ```bash
   cd wordpress/themes
   zip -r twentyfourteen-child.zip twentyfourteen-child/
   ```

2. **Upload to WordPress:**
   - Log into your WordPress admin panel
   - Go to Appearance → Themes
   - Click "Add New" → "Upload Theme"
   - Choose the `twentyfourteen-child.zip` file
   - Click "Install Now"

3. **Activate the theme:**
   - After installation, click "Activate"
   - The parent theme (Twenty Fourteen) must be installed for this to work

### Manual Installation via FTP/File Manager

1. Upload the entire `twentyfourteen-child` folder to `/wp-content/themes/` on your WordPress installation
2. Make sure the parent theme "Twenty Fourteen" is also installed
3. Go to Appearance → Themes in WordPress admin
4. Activate "Twenty Fourteen Child"

## What's Included

- **style.css** - Child theme stylesheet with custom CSS
- **functions.php** - Theme functions and customizations
- **README.md** - This file

## Customizations

### Current Modifications

1. **Content Width**: Set to 900px to match reference site
2. **Widget Titles**: Ensured widget titles are visible and properly styled
3. **Clean structure**: Ready for additional customizations

### Adding More Customizations

#### Custom CSS
Add custom styles to `style.css` below the "Add any additional custom styles" comment.

#### Custom PHP Functions
Add custom functions to `functions.php` below the "Custom functions and modifications" comment.

#### Override Template Files
To customize specific templates:
1. Copy the template file from `/wp-content/themes/twentyfourteen/`
2. Paste it into this child theme folder
3. Modify the copied file (the child theme version will be used instead)

Common templates to override:
- `header.php` - Site header
- `footer.php` - Site footer
- `sidebar.php` - Sidebar content
- `content.php` - Post content template
- `archive.php` - Archive pages

## WordPress Multisite

This child theme works on WordPress multisite installations. You can:
- Network activate it to make it available to all sites
- Activate it per-site as needed

## Troubleshooting

### Theme doesn't appear in WordPress
- Ensure the parent theme "Twenty Fourteen" is installed
- Check that all files were uploaded correctly
- Verify file permissions (folders: 755, files: 644)

### Styles not applying
- Clear your WordPress cache (if using a caching plugin)
- Clear your browser cache
- Check that the theme is activated (not just installed)

### Widget titles still not showing
- Check if titles are entered in Appearance → Widgets
- Inspect the page with browser dev tools to see if CSS is hiding them
- Check for conflicting plugins

## Next Steps

1. Activate the theme in WordPress
2. Configure widgets in Appearance → Widgets
3. Customize the Additional CSS if needed (Appearance → Customize → Additional CSS)
4. Add any template overrides as needed

## Support

For WordPress child theme documentation:
https://developer.wordpress.org/themes/advanced-topics/child-themes/

## License

This child theme inherits the GPL v2 license from WordPress and Twenty Fourteen.
