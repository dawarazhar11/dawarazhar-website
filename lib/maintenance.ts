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

const configPath = path.join(process.cwd(), 'config', 'maintenance.json')

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
  const configDir = path.dirname(configPath)
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true })
  }
}

export function getMaintenanceConfig(): MaintenanceConfig {
  try {
    ensureConfigDir()
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8')
      return { ...defaultConfig, ...JSON.parse(content) }
    }
    return defaultConfig
  } catch (error) {
    console.error('Error reading maintenance config:', error)
    return defaultConfig
  }
}

export function saveMaintenanceConfig(config: Partial<MaintenanceConfig>): boolean {
  try {
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
