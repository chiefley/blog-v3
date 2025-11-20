import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OptimizedWeaselSimulation from './OptimizedWeaselSimulation'
import './OptimizedWeaselSimulation.css'

// Auto-mount function
function autoMount() {
  const containers = document.querySelectorAll('[data-component="optimized-weasel-simulation"]')
  containers.forEach((container) => {
    // Read optional data attributes for configuration
    const mutationLevel = container.getAttribute('data-mutation-level')
      ? parseInt(container.getAttribute('data-mutation-level')!)
      : undefined
    const withBadger = container.getAttribute('data-with-badger') === 'true'
    const initialFoodSources = container.getAttribute('data-initial-food-sources')
      ? parseInt(container.getAttribute('data-initial-food-sources')!)
      : undefined
    const height = container.getAttribute('data-height')
      ? parseInt(container.getAttribute('data-height')!)
      : undefined
    const showControls = container.getAttribute('data-show-controls') !== 'false'

    const root = createRoot(container)
    root.render(
      <StrictMode>
        <OptimizedWeaselSimulation
          mutationLevel={mutationLevel}
          withBadger={withBadger}
          initialFoodSources={initialFoodSources}
          height={height}
          showControls={showControls}
        />
      </StrictMode>
    )
  })
}

// Auto-mount on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoMount)
} else {
  // DOM already loaded
  autoMount()
}

export { OptimizedWeaselSimulation }
