# AppleFinch Site Assets

- `css/` – Versioned Additional CSS (Customizer), Darkify overrides, and any GeneratePress tweaks.
- `functions/` – Site-specific PHP snippets or GP hooks if needed.
- `react/` – AppleFinch React components (built via `config/components.json` + build scripts).

Deployment notes:
- Upload React bundles from `components/dist/applefinch/` to `/wp-content/uploads/react-components/applefinch/`.
- Shortcodes come from `config/components.json`; AppleFinch components are registered automatically by the plugin.
- Keep Customizer exports/screenshots here if you export GeneratePress settings.
