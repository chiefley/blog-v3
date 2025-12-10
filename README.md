# Blog v3 - React Components & WordPress Development

Development environment for building embeddable React/TypeScript components and custom WordPress functionality.

## Project Structure

```
blog-v3/
├── components/              # React/TypeScript embeddable components
│   ├── src/                # Component source code
│   │   ├── Calculator/     # Example calculator component
│   │   └── shared/         # Shared utilities and types
│   ├── dist/               # Built component bundles (gitignored)
│   └── examples/           # Local development preview
├── wordpress/              # WordPress development
│   ├── plugins/            # Custom plugins
│   │   └── embed-components/  # Plugin for embedding React components
│   └── scripts/            # WordPress deployment helpers
└── scripts/                # Build scripts
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Develop Components Locally

Start the development server to preview components:

```bash
npm run dev
```

This opens a browser at `http://localhost:3000` showing all components.

### 3. Build Components

Build all components for production:

```bash
npm run build:all
```

Built files will be in `components/dist/` as:
- `calculator.iife.js` - Component JavaScript bundle
- `style.css` - Component styles

### 4. Deploy to WordPress

#### Option A: Manual Upload (Recommended for Hostinger)

1. Build components: `npm run build:all`
2. Log into Hostinger File Manager
3. Navigate to `/wp-content/uploads/` and create folder `react-components`
4. Upload all files from `components/dist/` to that folder

#### Option B: FTP/SFTP

See `wordpress/scripts/deploy.sh` for FTP examples.

### 5. Install WordPress Plugin

1. Upload `wordpress/plugins/embed-components/` to `/wp-content/plugins/` on your WordPress site
2. Activate "Embed React Components" in WordPress admin

### 6. Use Components in Posts

Add shortcodes to any WordPress post or page:

```
[react-calculator]
```

## Development Workflow

### Creating a New Component

1. Create component folder: `components/src/YourComponent/`
2. Add files:
   - `YourComponent.tsx` - Main component
   - `YourComponent.css` - Styles
   - `index.ts` - Entry point with auto-mount logic

3. Update `scripts/build-all-components.js` to include your component:

```javascript
const components = [
  {
    name: 'Calculator',
    entry: resolve(__dirname, '../components/src/Calculator/index.ts'),
    fileName: 'calculator'
  },
  {
    name: 'YourComponent',
    entry: resolve(__dirname, '../components/src/YourComponent/index.ts'),
    fileName: 'your-component'
  }
]
```

4. Add shortcode to `wordpress/plugins/embed-components/embed-components.php`:

```php
add_shortcode('react-your-component', array($this, 'render_your_component'));

public function render_your_component($atts) {
    wp_enqueue_script(
        'your-component',
        $this->components_url . '/your-component.iife.js',
        array(),
        '1.0.0',
        true
    );
    return '<div data-component="your-component"></div>';
}
```

5. Build and deploy!

### Component Auto-Mount Pattern

Components automatically mount to any element with `data-component` attribute:

```html
<div data-component="calculator"></div>
```

This happens via the `DOMContentLoaded` listener in each component's `index.ts`.

## Tech Stack

- **React 18** - UI components
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **WordPress** - Content management
- **PHP** - WordPress plugin development

## Available Scripts

- `npm run dev` - Start development server for component preview
- `npm run build` - Build the current component (configured in vite.config.ts)
- `npm run build:all` - Build all components for production
- `npm run preview` - Preview production build

## WordPress Integration

Components are built as IIFE (Immediately Invoked Function Expressions) bundles that:
- Include React bundled within them
- Auto-mount on page load
- Work in any WordPress post/page

The custom WordPress plugin provides shortcodes for easy embedding.

## Git Workflow

This project is designed to be version controlled. The `.gitignore` excludes:
- `node_modules/`
- `components/dist/`
- Environment files
- WordPress uploads and database files

Commit your source code and custom WordPress plugins/themes, but rebuild components on each deployment.

## WordPress Theme Compatibility

This embedding strategy works with any WordPress theme:
- **GeneratePress** (Free or Premium) - Recommended
- **Astra**, **Kadence**, **Twenty Twenty-Four** - All compatible
- The plugin is theme-agnostic and survives theme changes

For multi-site WordPress installations:
1. Built components can be shared across all sites in the network
2. Upload to main site's `/wp-content/uploads/react-components/`
3. Network activate the plugin if you want it on all sites

## Troubleshooting

### Components not showing in WordPress

1. Check browser console for JavaScript errors
2. Verify files uploaded to correct directory
3. Check WordPress plugin is activated
4. Confirm shortcode spelling matches plugin definition

### Build errors

1. Delete `node_modules/` and run `npm install` again
2. Check Node.js version (requires Node 16+)
3. Verify TypeScript syntax in component files

## Next Steps

- Add more components as needed
- Customize WordPress plugin for advanced features
- Set up automated deployment if desired
- Customize theme via Appearance → Customize in WordPress admin

## License

MIT

## Multisite structure
- Configure sites/components in `config/components.json` (site keys, domains, shortcode names, and entries). AppleFinch React sources live under `wordpress/sites/applefinch/react/`.
- Build everything: `npm run build:all`; build one site: `npm run build:site <site>` (e.g., `applefinch`).
- Upload bundles to `/wp-content/uploads/react-components/<site>/` to keep sites isolated.
- Embed plugin reads the same config and registers shortcodes per-site based on the current domain.
- Per-site theme tweaks: use `wordpress/sites/<site>/css/customizer.css` and related folders to version Additional CSS and snippets.
- Component builds are JS-only; styling comes from WordPress Additional CSS/Darkify overrides (not from the bundles).
