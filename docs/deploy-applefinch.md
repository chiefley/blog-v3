# Deploy AppleFinch React Components

1) Build AppleFinch bundles locally (source lives in `wordpress/sites/applefinch/react/`):
```bash
npm run build:site applefinch
```

2) Upload artifacts:
- Source: `components/dist/applefinch/`
- Destination: `/wp-content/uploads/react-components/applefinch/`

3) Shortcodes (from `config/components.json`):
- `[react-calculator]`
- `[react-dawkins-weasel]` (attrs: target-string, max-generations, height, show-controls)
- `[react-optimized-weasel]` (attrs: mutation-level, with-badger, initial-food-sources, height, show-controls)

4) Styles:
- Component builds ship JS only; no component CSS is produced.
- All styling lives in WordPress Additional CSS / Darkify overrides. Keep them versioned in `wordpress/sites/applefinch/css/customizer.css` if you want them tracked.

5) Notes:
- The embed plugin detects the current site by domain (see `config/components.json -> sites`).
- If domains change, update that list and redeploy the plugin.
