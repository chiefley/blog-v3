import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DawkinsWeaselSimulation from './DawkinsWeaselSimulation'
import './DawkinsWeaselSimulation.css'

// Auto-mount function
function autoMount() {
  const containers = document.querySelectorAll('[data-component="dawkins-weasel-simulation"]')
  containers.forEach((container) => {
    // Read optional data attributes for configuration
    const targetString = container.getAttribute('data-target-string') || undefined
    const maxGenerations = container.getAttribute('data-max-generations')
      ? parseInt(container.getAttribute('data-max-generations')!)
      : undefined
    const height = container.getAttribute('data-height')
      ? parseInt(container.getAttribute('data-height')!)
      : undefined
    const showControls = container.getAttribute('data-show-controls') !== 'false'

    const root = createRoot(container)
    root.render(
      <StrictMode>
        <DawkinsWeaselSimulation
          targetString={targetString}
          maxGenerations={maxGenerations}
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

export { DawkinsWeaselSimulation }
