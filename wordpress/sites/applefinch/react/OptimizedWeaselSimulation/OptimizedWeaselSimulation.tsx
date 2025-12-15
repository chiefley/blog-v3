import React, { useEffect, useRef, useState } from 'react';
import { WeaselSimulationOptimizer } from '@shared/libraries/weasels/weaselOptimizer';

interface OptimizedWeaselSimulationProps {
  mutationLevel?: number; // 1-5, defaults to 5
  withBadger?: boolean;   // Whether to include badger, defaults to true
  initialFoodSources?: number; // Initial number of food sources, defaults to 25
  height?: number; // Height of the canvas in pixels, defaults to 600
  showControls?: boolean; // Whether to show optimization controls
}

/**
 * An optimized component that displays the weasel genetic algorithm simulation.
 */
const OptimizedWeaselSimulation: React.FC<OptimizedWeaselSimulationProps> = ({
  mutationLevel = 5,
  withBadger: initialWithBadger = false,
  initialFoodSources = 25,
  height = 600,
  showControls = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const optimizerRef = useRef<WeaselSimulationOptimizer | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const [speed, setSpeed] = useState<number>(1.5); // Default to 1.5x speed
  const [withBadger, setWithBadger] = useState<boolean>(initialWithBadger);
  const [showAdvancedControls, setShowAdvancedControls] = useState<boolean>(false);

  const getIsDarkMode = () => {
    if (typeof document === 'undefined') return false;
    const bodyHas = document.body?.classList.contains('darkify_dark_mode_enabled');
    const htmlHas = document.documentElement.classList.contains('darkify_dark_mode_enabled');
    return Boolean(bodyHas || htmlHas);
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getIsDarkMode());

  // Track if the simulation is initialized
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Watch for Darkify toggles so the canvas palette follows the theme
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const targets = [document.body, document.documentElement].filter(Boolean) as HTMLElement[];
    const observer = new MutationObserver(() => setIsDarkMode(getIsDarkMode()));
    targets.forEach((target) => observer.observe(target, { attributes: true, attributeFilter: ['class'] }));
    return () => observer.disconnect();
  }, []);

  // Initialize the simulation once
  useEffect(() => {
    if (containerRef.current) {
      // Add styles to the document head if not already added
      if (!styleRef.current) {
        const style = document.createElement('style');
        style.textContent = `
          .weasel-sim-container .stats {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem;
            max-width: 100%;
            margin-bottom: 0.75rem;
          }
          .weasel-sim-container .stats > div {
            padding: 0.25rem 0.75rem;
            background-color: var(--af-weasel-stats-chip-bg, #2563eb);
            color: var(--af-weasel-stats-chip-text, #ffffff);
            border-radius: 0.75rem;
            font-size: 0.75rem;
            font-weight: 500;
            white-space: nowrap;
            min-width: fit-content;
            text-align: center;
          }
          .weasel-sim-container .stats > div span {
            font-weight: bold;
          }
          .weasel-sim-container canvas.field {
            width: 100%;
            height: auto;
            border: 1px solid var(--af-weasel-border, #e5e7eb);
            border-radius: 0.25rem;
            display: block;
            background-color: var(--af-surface, #ffffff);
          }
          .weasel-sim-container .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
            margin-top: 0.5rem;
          }
          .weasel-sim-container .controls button {
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
            background-color: var(--af-accent, #2563eb);
            color: var(--af-button-text, #ffffff);
            border: none;
            cursor: pointer;
            font-size: 0.75rem;
            font-weight: 500;
          }
          .weasel-sim-container .controls button:hover {
            background-color: var(--af-accent-hover, #1d4ed8);
          }
          .weasel-sim-container .controls button:disabled {
            background-color: var(--af-weasel-toggle-track-off, #9ca3af);
            cursor: not-allowed;
          }
          .weasel-sim-container .controls input {
            padding: 0.25rem;
            border-radius: 0.25rem;
            border: 1px solid var(--af-border-subtle, #e5e7eb);
            margin-left: 0.25rem;
            margin-right: 0.25rem;
            width: 50px;
            font-size: 0.75rem;
            background-color: var(--af-weasel-surface, #ffffff);
            color: var(--af-text-main, #111827);
          }
          .weasel-sim-container .controls label {
            font-size: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }
        `;
        document.head.appendChild(style);
        styleRef.current = style;
      }

      // Create the necessary HTML structure first
      const htmlContent = `
        <div class="stats">
          <div>Generations: <span class="lblGenerations">0</span></div>
          <div>Calories Spent: <span class="lblSpentCalories">0</span></div>
          <div>Calories Acquired: <span class="lblAcquiredCalories">0</span></div>
          <div>Net Calories: <span class="lblNetCalories">0</span></div>
        </div>
        <canvas class="field" width="1000" height="${height}"></canvas>
        <div class="controls">
          <label>Food Sources: <input type="number" class="txtNumSources" value="${initialFoodSources}" min="5" max="100" /></label>
          <button class="btnReset">Reset</button>
          <button class="btnRun">Run</button>
          <button class="btnStop">Stop</button>
          <button class="btnSingleStep">Step</button>
          <button class="btnEarthquake">Earthquake</button>
        </div>
      `;
      containerRef.current.innerHTML = htmlContent;

      // Initialize the simulation with our optimizer
      optimizerRef.current = new WeaselSimulationOptimizer(
        containerRef.current,
        mutationLevel,
        withBadger,
        {
          speedMultiplier: speed,
          showFps: false,
          isDarkMode: isDarkMode
        }
      );

      // Wait for canvas to be properly laid out before initializing
      // This ensures the canvas has correct clientWidth/clientHeight
      setTimeout(() => {
        const resetButton = containerRef.current?.querySelector('.btnReset');
        if (resetButton) {
          (resetButton as HTMLButtonElement).click();
          setIsInitialized(true);
        }
      }, 100);
    }

    // Clean up resources when component unmounts
    return () => {
      if (optimizerRef.current) {
        optimizerRef.current.dispose();
      }
      // Clean up style tag when component unmounts
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [mutationLevel, initialFoodSources, height]);

  // Update speed when it changes
  useEffect(() => {
    if (optimizerRef.current) {
      optimizerRef.current.setSpeedMultiplier(speed);
    }
  }, [speed]);

  // Sync theme changes into the simulation so canvas colors flip with Darkify
  useEffect(() => {
    if (optimizerRef.current) {
      optimizerRef.current.setDarkMode(isDarkMode);
    }
  }, [isDarkMode]);

  // Handle badger toggle and reinitialize the simulation
  const handleBadgerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Stop any running simulation first
    const stopButton = containerRef.current?.querySelector('.btnStop');
    if (stopButton) {
      (stopButton as HTMLButtonElement).click();
    }

    setWithBadger(event.target.checked);

    // We need to reinitialize the optimizer with the new badger setting
    if (containerRef.current && isInitialized) {
      // Clean up existing optimizer
      if (optimizerRef.current) {
        optimizerRef.current.dispose();
      }

      // Create a new optimizer with updated badger setting
      optimizerRef.current = new WeaselSimulationOptimizer(
        containerRef.current,
        mutationLevel,
        event.target.checked,
        {
          speedMultiplier: speed,
          showFps: false,
          isDarkMode: isDarkMode
        }
      );

      // Reset to initialize the simulation (with slight delay for canvas layout)
      setTimeout(() => {
        const resetButton = containerRef.current?.querySelector('.btnReset');
        if (resetButton) {
          (resetButton as HTMLButtonElement).click();
        }
      }, 100);
    }
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseFloat(event.target.value));
  };

  return (
    <div className="optimized-weasel-wrapper">
      <div ref={containerRef} className="weasel-sim-container" />

      {/* Compact controls row */}
      {showControls && (
        <div className="optimized-controls">
          {/* Speed control - compact */}
          <div className="speed-control-wrapper">
            <svg className="speed-icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
            </svg>
            <span className="speed-label">{speed}x</span>
            <input
              type="range"
              value={speed}
              onChange={handleSpeedChange}
              step={speed < 10 ? 0.5 : 5}
              min={0.5}
              max={50}
              className="speed-slider"
            />
          </div>

          {/* Badger toggle - compact */}
          <div className="badger-toggle-wrapper">
            <svg
              className={`badger-icon ${withBadger ? 'active' : 'inactive'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"/>
            </svg>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={withBadger}
                onChange={handleBadgerChange}
                className="toggle-checkbox"
              />
              <div className="toggle-switch"></div>
              <span className="toggle-text">Predator</span>
            </label>
          </div>

          {/* Settings toggle for future expansion */}
          <button
            onClick={() => setShowAdvancedControls(!showAdvancedControls)}
            disabled
            className="settings-button"
            title="Advanced Settings (Coming Soon)"
          >
            <svg className="settings-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      )}

      {/* Future: Advanced controls panel that can be toggled */}
      {showAdvancedControls && (
        <div className="advanced-controls">
          <p>Advanced controls will be available here in future versions</p>
        </div>
      )}
    </div>
  );
};

export default OptimizedWeaselSimulation;
