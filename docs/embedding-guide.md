# Component Embedding Guide

This guide explains how to embed React components into your WordPress blog posts.

## Prerequisites

1. Components built (`npm run build:all`)
2. Built files uploaded to `/wp-content/uploads/react-components/`
3. WordPress plugin "Embed React Components" activated

## Using Shortcodes (Recommended)

The easiest way to embed components is using WordPress shortcodes in the Block Editor or Classic Editor.

### Available Shortcodes

#### Calculator

```
[react-calculator]
```

Add more shortcodes as you create components.

## Manual Embedding (Advanced)

If you prefer not to use shortcodes, you can manually add the HTML and enqueue scripts.

### In Block Editor

1. Add a "Custom HTML" block
2. Insert:

```html
<div data-component="calculator"></div>
```

3. Enqueue the component script via your theme's `functions.php` or the plugin

### Loading Scripts

Components automatically mount to any element with the appropriate `data-component` attribute when the page loads.

Note: The script is enqueued by the plugin when the shortcode is used, so no manual script loading is needed.

## Component Props (Future Enhancement)

Currently components don't accept props, but you can enhance them to read data from `data-*` attributes:

```html
<div
  data-component="calculator"
  data-theme="dark"
  data-size="large"
></div>
```

Then modify the component's `index.ts` to read these attributes.

## Styling Considerations

Components include their own CSS. If there are conflicts with your WordPress theme:

1. Increase CSS specificity in component styles
2. Use CSS modules in future iterations
3. Add a wrapper class to the container div
4. Use theme-specific CSS customization:
   - **GeneratePress**: Appearance → Customize → Additional CSS
   - **Other themes**: Similar customizer options or custom CSS plugins

## Multiple Instances

You can use the same component multiple times on one page:

```
[react-calculator]

Some text here...

[react-calculator]
```

Each instance is independent with its own state.

## Security Notes

- Components run in the user's browser
- They don't have access to WordPress admin or database
- Safe to use in any post/page
- User input is sandboxed to the component

## Performance Tips

1. Components load on page load (not lazy loaded by default)
2. React is bundled with each component (~130KB gzipped)
3. For multiple components on one page, consider refactoring to share React
4. Components are cached by WordPress/browser

## Troubleshooting

### Component doesn't appear

- Check shortcode spelling
- View page source - verify script is loading
- Check browser console for errors
- Confirm files exist at `/wp-content/uploads/react-components/`

### Component appears but doesn't work

- Check browser console for JavaScript errors
- Verify component built without errors
- Ensure data-component attribute matches component code

### Styling looks wrong

- Check for CSS conflicts with theme
- Inspect element to see which styles are being applied
- May need to adjust component CSS specificity

## Best Practices

1. **Test in preview first** before publishing
2. **Keep components simple** - complex apps may be better as standalone pages
3. **Document component usage** for future reference
4. **Version your builds** - update version numbers in plugin when rebuilding
5. **Clear cache** after uploading new versions

## Theme Compatibility

This embedding strategy is **theme-agnostic** and works with:
- GeneratePress (Free or Premium)
- Astra, Kadence, OceanWP
- Twenty Twenty-Four and other block themes
- Any WordPress theme

The plugin handles all script loading and component mounting, independent of your theme choice.
