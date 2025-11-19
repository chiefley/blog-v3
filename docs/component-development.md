# Component Development Guide

Guide for developing new React/TypeScript components for WordPress embedding.

## Component Structure

Each component should follow this structure:

```
components/src/YourComponent/
├── YourComponent.tsx    # Main React component
├── YourComponent.css    # Component styles
└── index.ts            # Entry point with mounting logic
```

## Creating a New Component

### 1. Create Component Files

**YourComponent.tsx**

```typescript
import { useState } from 'react'
import './YourComponent.css'

export function YourComponent() {
  const [state, setState] = useState('initial')

  return (
    <div className="your-component">
      <h2>Your Component</h2>
      {/* Component JSX */}
    </div>
  )
}
```

**YourComponent.css**

```css
.your-component {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
}

/* Scope all styles to .your-component to avoid conflicts */
```

**index.ts**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { YourComponent } from './YourComponent'
import './YourComponent.css'

// Auto-mount on page load
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-component="your-component"]')
  containers.forEach((container) => {
    const root = createRoot(container)
    root.render(
      <StrictMode>
        <YourComponent />
      </StrictMode>
    )
  })
})

export { YourComponent }
```

### 2. Add to Build Script

Edit `scripts/build-all-components.js`:

```javascript
const components = [
  // ... existing components
  {
    name: 'YourComponent',
    entry: resolve(__dirname, '../components/src/YourComponent/index.ts'),
    fileName: 'your-component'
  }
]
```

### 3. Add WordPress Shortcode

Edit `wordpress/plugins/embed-components/embed-components.php`:

```php
// In constructor
add_shortcode('react-your-component', array($this, 'render_your_component'));

// New method
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

### 4. Test Locally

Add to `components/examples/index.html`:

```html
<div class="component-section">
  <h2 class="component-title">Your Component</h2>
  <div data-component="your-component"></div>
</div>

<script type="module" src="../src/YourComponent/index.ts"></script>
```

Run `npm run dev` and test at `http://localhost:3000`

### 5. Build and Deploy

```bash
npm run build:all
```

Upload `components/dist/your-component.iife.js` to WordPress.

## Best Practices

### CSS Scoping

Always scope styles to a root class to avoid conflicts:

```css
/* Good */
.your-component { }
.your-component button { }
.your-component .title { }

/* Bad - will conflict with WordPress theme */
button { }
.title { }
h2 { }
```

### Component Props via Data Attributes

To accept configuration, read from data attributes:

```typescript
document.addEventListener('DOMContentLoaded', () => {
  const containers = document.querySelectorAll('[data-component="your-component"]')
  containers.forEach((container) => {
    // Read data attributes
    const theme = container.getAttribute('data-theme') || 'light'
    const size = container.getAttribute('data-size') || 'medium'

    const root = createRoot(container)
    root.render(
      <StrictMode>
        <YourComponent theme={theme} size={size} />
      </StrictMode>
    )
  })
})
```

Usage in WordPress:

```html
<div data-component="your-component" data-theme="dark" data-size="large"></div>
```

### State Management

For simple components, use `useState`:

```typescript
const [count, setCount] = useState(0)
```

For complex state, consider `useReducer`:

```typescript
const [state, dispatch] = useReducer(reducer, initialState)
```

For shared state across multiple instances, you'd need a more complex setup (not recommended for WordPress embeds).

### Performance

- Keep components small and focused
- Avoid heavy dependencies
- Lazy load large data if needed
- Use `useMemo` and `useCallback` for expensive operations

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers

Example:

```typescript
<button
  onClick={handleClick}
  aria-label="Increase count"
  type="button"
>
  +
</button>
```

### TypeScript

Define proper types for props and state:

```typescript
interface YourComponentProps {
  theme?: 'light' | 'dark'
  size?: 'small' | 'medium' | 'large'
}

export function YourComponent({ theme = 'light', size = 'medium' }: YourComponentProps) {
  // ...
}
```

## Common Patterns

### Fetching Data

```typescript
import { useState, useEffect } from 'react'

export function DataComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return <div>{/* Render data */}</div>
}
```

### Form Handling

```typescript
import { useState, FormEvent } from 'react'

export function FormComponent() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Submitted:', email)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Using Shared Utilities

Create shared code in `components/src/shared/`:

```typescript
// components/src/shared/utils.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString()
}

// In your component
import { formatDate } from '../shared/utils'
```

## Testing Components

Currently no test setup included. Consider adding:

- Vitest for unit tests
- React Testing Library for component tests
- Playwright for E2E tests

## Debugging

### In Development

- Use browser DevTools
- React DevTools extension
- Console.log statements

### In WordPress

- Open browser console on the WordPress page
- Check for JavaScript errors
- Verify component script loaded
- Inspect element to verify mounting

## Version Management

When updating components:

1. Rebuild: `npm run build:all`
2. Update version in WordPress plugin
3. Upload new files to WordPress
4. Clear WordPress cache
5. Test on staging site first

## Theme Integration Notes

The component embedding system is **theme-independent**:
- Works with any WordPress theme (GeneratePress, Astra, block themes, etc.)
- No child theme required
- The plugin handles all script enqueuing
- Components render in the content area of any theme

For theme-specific styling customizations, use:
- **GeneratePress**: Appearance → Customize → Additional CSS
- **Other themes**: Built-in customizer or CSS plugins
- Avoid modifying component CSS for theme compatibility - adjust theme CSS instead

## Next Steps

- Add more sophisticated components
- Implement shared component library
- Add prop validation
- Create component documentation
- Set up automated testing
