import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Calculator } from './Calculator'

// This function will be called to mount the component
export function mountCalculator(elementId: string) {
  const container = document.getElementById(elementId)
  if (!container) {
    console.error(`Element with id "${elementId}" not found`)
    return
  }

  const root = createRoot(container)
  root.render(
    <StrictMode>
      <Calculator />
    </StrictMode>
  )
}

// Auto-mount function
function autoMount() {
  const containers = document.querySelectorAll('[data-component="calculator"]')
  containers.forEach((container) => {
    const root = createRoot(container)
    root.render(
      <StrictMode>
        <Calculator />
      </StrictMode>
    )
  })
}

// Auto-mount if data attribute is present
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoMount)
} else {
  // DOM already loaded
  autoMount()
}

// Export for manual use
export { Calculator }
