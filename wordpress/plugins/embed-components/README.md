# Embed React Components WordPress Plugin

Loads built React bundles from `/wp-content/uploads/react-components/<site>/` and registers shortcodes per site using `components.json`.

## Install
1. Upload `embed-components/` (including `components.json`) to `/wp-content/plugins/`.
2. Activate the plugin in WordPress.
3. Upload built files for each site (e.g., `components/dist/applefinch/`) to `/wp-content/uploads/react-components/<site>/`.

## Shortcodes
Shortcodes are declared in `components.json` (see repo root `config/components.json`).
- AppleFinch examples: `[react-calculator]`, `[react-dawkins-weasel]`, `[react-optimized-weasel]`.

## Adding components/sites
1. Add entries to `config/components.json` (site key, shortcode, entry, etc.).
2. Build: `npm run build:all` or `npm run build:site <site>`.
3. Copy the updated `config/components.json` into this folder before deploying the plugin.
4. Upload the new bundles to `/wp-content/uploads/react-components/<site>/`.

## Styles
- Component bundles no longer ship their own CSS. All styling comes from WordPress Additional CSS / Darkify overrides.

## Hosting elsewhere
Set a filter for `embed_react_components_site_key` to override site detection if needed (e.g., mapping domains to site keys). Update `$this->components_url` if you want to serve bundles from a CDN or different path.
