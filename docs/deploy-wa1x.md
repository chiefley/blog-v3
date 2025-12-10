# Deploy WA1X React Components

This site currently has no React bundles. When adding WA1X components:

1) Declare them in `config/components.json` with `"site": "wa1x"`.
2) Build bundles:
```bash
npm run build:site wa1x
```
3) Upload `components/dist/wa1x/` to `/wp-content/uploads/react-components/wa1x/`.
4) Use the registered shortcodes from `config/components.json` in posts/pages.
5) Styles should come from WordPress Additional CSS/Darkify; no component CSS is built.
