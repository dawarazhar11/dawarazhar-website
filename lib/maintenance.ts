import fs from 'fs'
import path from 'path'

export interface MaintenanceConfig {
  enabled: boolean
  title: string
  message: string
  showProgress: boolean
  progressPercent: number
  expectedDate: string
  showSocial: boolean
  allowedPaths: string[]
}

// Use absolute path to avoid cwd issues in production
const getConfigPath = () => {
  // In production, use the app directory
  const cwd = process.cwd()
  return path.join(cwd, 'config', 'maintenance.json')
}

const defaultConfig: MaintenanceConfig = {
  enabled: false,
  title: "Coming Soon",
  message: "We're working hard to bring you something amazing. Stay tuned!",
  showProgress: true,
  progressPercent: 75,
  expectedDate: "",
  showSocial: true,
  allowedPaths: ['/admin', '/api']
}

function ensureConfigDir() {
  const configPath = getConfigPath()
  const configDir = path.dirname(configPath)
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true })
  }
}

export function getMaintenanceConfig(): MaintenanceConfig {
  try {
    const configPath = getConfigPath()
    ensureConfigDir()

    // Force fresh read by using openSync with close
    if (fs.existsSync(configPath)) {
      // Clear any potential stat cache
      fs.statSync(configPath)
      const content = fs.readFileSync(configPath, { encoding: 'utf-8', flag: 'r' })
      const parsed = JSON.parse(content)
      console.log('[Maintenance] Read config from:', configPath, 'enabled:', parsed.enabled)
      return { ...defaultConfig, ...parsed }
    }
    console.log('[Maintenance] Config file not found at:', configPath)
    return defaultConfig
  } catch (error) {
    console.error('Error reading maintenance config:', error)
    return defaultConfig
  }
}

export function saveMaintenanceConfig(config: Partial<MaintenanceConfig>): boolean {
  try {
    const configPath = getConfigPath()
    ensureConfigDir()
    const currentConfig = getMaintenanceConfig()
    const newConfig = { ...currentConfig, ...config }
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2))
    return true
  } catch (error) {
    console.error('Error saving maintenance config:', error)
    return false
  }
}

export function isMaintenanceMode(): boolean {
  return getMaintenanceConfig().enabled
}

export function isPathAllowed(pathname: string): boolean {
  const config = getMaintenanceConfig()
  return config.allowedPaths.some(allowedPath => pathname.startsWith(allowedPath))
}
