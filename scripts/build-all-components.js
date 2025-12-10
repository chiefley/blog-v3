import { build } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const CONFIG_PATH = resolve(__dirname, '../config/components.json')
const DIST_ROOT = resolve(__dirname, '../components/dist')

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`Components config not found at ${CONFIG_PATH}`)
  }

  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8')
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed.components) || !Array.isArray(parsed.sites)) {
    throw new Error('components.json must include "sites" and "components" arrays')
  }

  return parsed
}

function validateSiteKey(siteKey, sites) {
  return sites.some((site) => site.key === siteKey)
}

function groupComponentsBySite(components) {
  return components.reduce((acc, component) => {
    if (!acc[component.site]) {
      acc[component.site] = []
    }
    acc[component.site].push(component)
    return acc
  }, {})
}

async function buildComponent(component, outDir) {
  console.log(`\nBuilding ${component.name} for ${component.site}...`)

  await build({
    configFile: false,
    define: {
      'process.env.NODE_ENV': JSON.stringify('production')
    },
    resolve: {
      alias: {
        '@shared': resolve(__dirname, '../components/src/shared')
      }
    },
    build: {
      lib: {
        entry: resolve(__dirname, `../${component.entry}`),
        name: component.name,
        fileName: () => `${component.fileName}.iife.js`,
        formats: ['iife']
      },
      rollupOptions: {
        output: {}
      },
      outDir,
      emptyOutDir: false,
      cssCodeSplit: false
    },
    plugins: [
      (await import('@vitejs/plugin-react')).default()
    ]
  })

  console.log(`✓ ${component.name} built`)
}

function ensureDir(path) {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true })
  }
  fs.mkdirSync(path, { recursive: true })
}

async function buildSite(siteKey, components) {
  if (!components.length) {
    console.log(`- No components configured for ${siteKey}, skipping`)
    return
  }

  const siteOutDir = resolve(DIST_ROOT, siteKey)
  ensureDir(siteOutDir)

  for (const component of components) {
    await buildComponent(component, siteOutDir)
  }

  console.log(`\n✓ ${siteKey} components built: ${components.map((c) => c.name).join(', ')}`)
}

async function run() {
  const config = loadConfig()
  const componentsBySite = groupComponentsBySite(config.components)

  const argSite = process.argv[2]
  const buildAllSites = !argSite || argSite === 'all'

  const sitesToBuild = buildAllSites
    ? config.sites.map((site) => site.key)
    : [argSite]

  sitesToBuild.forEach((siteKey) => {
    if (!validateSiteKey(siteKey, config.sites)) {
      console.error(`Unknown site key "${siteKey}". Available: ${config.sites.map((s) => s.key).join(', ')}`)
      process.exit(1)
    }
  })

  if (buildAllSites) {
    ensureDir(DIST_ROOT)
  } else if (!fs.existsSync(DIST_ROOT)) {
    fs.mkdirSync(DIST_ROOT, { recursive: true })
  }

  for (const siteKey of sitesToBuild) {
    const components = componentsBySite[siteKey] || []
    await buildSite(siteKey, components)
  }

  console.log('\n✓ All requested sites built')
  console.log(`Output: ${DIST_ROOT}/<site>/`)
  console.log('Next steps: upload the site folder to /wp-content/uploads/react-components/<site>/')
}

run().catch((error) => {
  console.error('Build failed:', error)
  process.exit(1)
})
