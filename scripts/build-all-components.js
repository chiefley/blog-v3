import { build } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// List of components to build
const components = [
  {
    name: 'Calculator',
    entry: resolve(__dirname, '../components/src/Calculator/index.ts'),
    fileName: 'calculator'
  },
  {
    name: 'DawkinsWeaselSimulation',
    entry: resolve(__dirname, '../components/src/DawkinsWeaselSimulation/index.ts'),
    fileName: 'dawkins-weasel-simulation'
  },
  {
    name: 'OptimizedWeaselSimulation',
    entry: resolve(__dirname, '../components/src/OptimizedWeaselSimulation/index.ts'),
    fileName: 'optimized-weasel-simulation'
  }
]

async function buildComponent(component) {
  console.log(`\nBuilding ${component.name}...`)

  try {
    await build({
      configFile: false,
      build: {
        lib: {
          entry: component.entry,
          name: component.name,
          fileName: () => `${component.fileName}.iife.js`,
          formats: ['iife']
        },
        rollupOptions: {
          output: {
            assetFileNames: 'style.css'
          }
        },
        outDir: resolve(__dirname, '../components/dist'),
        emptyOutDir: false,
        cssCodeSplit: false
      },
      plugins: [
        (await import('@vitejs/plugin-react')).default()
      ]
    })

    console.log(`✓ ${component.name} built successfully`)
  } catch (error) {
    console.error(`✗ Failed to build ${component.name}:`, error)
    process.exit(1)
  }
}

async function buildAll() {
  console.log('Building all components...')

  // Clear dist directory
  const distDir = resolve(__dirname, '../components/dist')
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true })
  }
  fs.mkdirSync(distDir, { recursive: true })

  // Build each component
  for (const component of components) {
    await buildComponent(component)
  }

  console.log('\n✓ All components built successfully!')
  console.log(`\nOutput directory: ${distDir}`)
  console.log('\nNext steps:')
  console.log('1. Upload files from components/dist/ to your WordPress site')
  console.log('2. Place them in /wp-content/uploads/react-components/')
  console.log('3. Use shortcodes in your posts (e.g., [react-calculator])')
}

buildAll()
