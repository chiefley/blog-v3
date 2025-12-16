# The Apple & The Finch – CSS Strategy

## 1. Goals

This CSS strategy is designed for a **multi-site WordPress network** using:

- **GeneratePress** (parent theme)
- **Darkify** (dark mode)
- Custom **React components** (e.g., Weasel simulation and future elements)

Key goals:

1. Let **GeneratePress Customizer** control as much as possible (layout, typography basics).
2. Use **Additional CSS** to define a site-wide **design system**: variables, card surfaces, text refinements, unified link and form styling.
3. Use **Darkify Custom CSS** only to:
   - Flip variable values into a dark palette.
   - Apply minimal structural adjustments using Darkify’s required `:not-disallowed` selectors.
4. Ensure the design scales across the entire network and survives theme/plugin updates.

---

## 2. Theme & Plugin Responsibilities

### GeneratePress (GP)

GP is responsible for all *structure*:

- Container layout (one/separate)
- Sidebar positioning
- Header, nav, footer placement
- Responsive breakpoints
- Base body font & heading font families

We **do not override** GP layout or containers; instead we style inside them.

---

### Additional CSS (Light Mode)

Defines the **Applefinch design system** in light mode.

### Responsibilities:

#### 1) **CSS Variables (`--af-*`)**

Central colors, borders, surfaces, text, and component styling:
- `--af-page-bg`, `--af-surface`, `--af-surface-soft`
- `--af-text-main`, `--af-text-muted`
- `--af-link`, `--af-link-hover`
- Component tokens for calculators & Weasel simulations.

These form the foundation for both light & dark themes.

---

#### 2) **Style inside GP containers**

We style:

- `.inside-article`
- `.widget`
- `.comments-area`
- `.inside-right-sidebar`

We **never replace** GP’s container system.

---

#### 3) **Typography refinements**

- Heading letter-spacing & vertical rhythm.
- Comfortable reading width for `.entry-content`.
- Balanced spacing around paragraphs, lists, blockquotes.
- Code, tables, and blockquotes read from variables.

---

#### 4) **Unified link, button, and form styling**

- Links use token-driven colors.
- Buttons unify appearance across WP, GP, Gutenberg, and React.
- Form controls (input/select/textarea) use `--af-input-*` variables.

---

#### 5) **React components integrate with site theme**

The Weasel simulation and other components:

- Use wrapper classes such as `.weasel-sim-container`, `.optimized-controls`.
- Adopt color & surface tokens.
- Automatically switch between light/dark through variable overrides.

---

## 3. Darkify Custom CSS (Dark Mode)

Darkify handles toggle & class injection.  
Our CSS only needs to provide design-system flips.

### Strategy Summary

1. Scope everything under:

```
.darkify_dark_mode_enabled …
```

2. Use **`:not-disallowed`** so Darkify doesn’t treat our selectors as exclusions.

3. Override only **variables**, not layout:

```
.darkify_dark_mode_enabled body:not-disallowed {
  --af-page-bg: #050509;
  --af-surface: #101019;
  --af-text-main: #f5f5f8;
  --af-link: #9ec5ff;
}
```

4. Minimal structural adjustments:
   - GP container interiors get new dark surfaces.
   - Buttons and forms remain readable.
   - React wrappers adapt automatically.

Dark mode becomes a *pure palette swap*, not a layout rewrite.


### Darkify Assumptions and Gotchas

#### Darkify rewrites selectors
Darkify’s “Custom CSS” UI automatically **prefixes/scopes** your rules under `.darkify_dark_mode_enabled`.  
Selectors like `html.darkify_dark_mode_enabled:root { ... }` can be rewritten into selectors that never match (for example, `.darkify_dark_mode_enabled html...`), and then **none of your variables apply**.

**Rule:** In the Darkify Custom CSS field, avoid `html...`, `:root`, or “double-scoped” selectors. Prefer `body:not-disallowed { ... }` (or specific page containers).

#### Variables must live on a real element
For React apps (and especially canvas apps) to see dark-mode values consistently:

- Define the dark palette variables on `body:not-disallowed` (or a wrapper element that always exists).
- If the app expects tokens like `--af-surface` / `--af-page-bg`, either define them directly or provide aliases from your `--af-bg-*` tokens.

**Rule:** Never put “top-level” variable declarations outside a selector block; that’s invalid CSS and will be dropped.

#### Canvas must be protected from dark-mode filters
Some dark-mode approaches apply `filter:` transforms to large DOM regions. Canvas output can be unintentionally inverted/shifted.

**Rule:** For canvas-based React apps, add a defensive rule in Darkify CSS:

```css
.weasel-sim-container canvas {
  filter: none !important;
  mix-blend-mode: normal !important;
  background-color: var(--af-weasel-surface, var(--af-surface)) !important;
}
```

(Background color matters: canvas does **not** “inherit” a background the way normal elements do.)

---

## 4. Variable Naming & Usage

### Naming

- All variables begin with `--af-`.
- Categories include surfaces, text, borders, links, component-specific tokens.

### Usage

Never hard-code colors. Always use variables:

```
.entry-content { color: var(--af-text-main); }
.weasel-sim-container { background: var(--af-surface); }
```

---

## 5. Layout Philosophy

- GP defines structure.
- Additional CSS styles surfaces **inside** that structure.
- No absolute widths or fixed container overrides.

This ensures:
- Full compatibility with GP updates
- Consistent behavior across multiple Applefinch pages
- Dark mode that never disrupts layout

---

## 6. Typography Philosophy

- GP → base fonts, sizes, line heights.
- Additional CSS → refinement only:
  - Vertical rhythm
  - Heading spacing
  - Code, blockquote, table presentation

Darkify inherits the same typography automatically.

---

## 7. Links, Buttons, Forms

### Links

- Use variables for color & hover.

### Buttons

- Site-wide unified button style across WP, GP, Gutenberg, and React.
- Darkify adjusts only variable colors.

### Forms

- Inputs, selects, textareas use `--af-input-*` tokens.
- Darkify safely targets them using `.darkify_style_form_element:not-disallowed`.

---

## 8. React Component Integration

React components:

- Do **not** hard-code colors.
- Use wrapper classes (e.g., `.optimized-weasel-wrapper`).
- Rely on `--af-*` variables for palette & typography.
- Automatically respond to Dark Mode via variable swaps.


### React App Assumptions

#### Token contract
React apps must treat the WordPress theme as the “source of truth” for palette:

- Do not hard-code colors in JS.
- Read colors from `--af-*` variables (either on `body` or the app wrapper).
- Prefer stable “global” tokens (`--af-surface`, `--af-text-main`, etc.) and use component tokens (`--af-weasel-*`) only for app-specific accents.

#### Dark mode detection
React apps should not need to “know about Darkify” beyond this:

- Dark mode is expressed via **different CSS variable values**.
- If the app caches colors at mount time (common in canvas apps), it must re-read variables and redraw when Darkify toggles. A simple trigger is a `MutationObserver` watching class changes on `<html>`/`<body>`.

#### Canvas rendering rule of thumb
Canvas does not inherit styling, so you must explicitly:

- Clear and paint the background each redraw, using a token-derived background color.
- Keep stroke/text colors token-driven.

This prevents the “light strokes on white canvas” failure mode when only some tokens flip.

---

## 9. Multi-Site Scalability

This approach works for the entire XBlog network:

- Network-level tokens may be shared.
- Site-level overrides remain small and controlled.
- Consistency across sites without sacrificing identity.

---

## 10. Safe Extension Checklist

Before adding/changing CSS:

1. Prefer GP Customizer where possible.
2. Add new variables (in both light & dark) instead of hard-coded colors.
3. Do not override GP structure or container rules.
4. In Darkify CSS, always:
   - Scope under `.darkify_dark_mode_enabled`
   - Use `:not-disallowed`
5. Test both themes on:
   - Posts
   - React-powered pages
   - Widget-heavy layouts

---

End of Document.
