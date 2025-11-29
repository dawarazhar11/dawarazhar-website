import fs from 'fs'
import path from 'path'
import type { PortfolioProject, PortfolioCategory, PortfolioConfig } from '@/types/portfolio'
import { DEFAULT_CATEGORIES } from '@/types/portfolio'

const portfolioDirectory = path.join(process.cwd(), 'content', 'portfolio')
const configFile = path.join(portfolioDirectory, '_config.json')

// Ensure portfolio directory exists
function ensureDirectoryExists() {
  if (!fs.existsSync(portfolioDirectory)) {
    fs.mkdirSync(portfolioDirectory, { recursive: true })
  }
}

// ==================== CATEGORIES ====================

export function getPortfolioCategories(): PortfolioCategory[] {
  try {
    ensureDirectoryExists()
    // First try _config.json (legacy)
    if (fs.existsSync(configFile)) {
      const config: PortfolioConfig = JSON.parse(fs.readFileSync(configFile, 'utf-8'))
      return config.categories.sort((a, b) => a.order - b.order)
    }
    // Then try categories.json
    const categoriesFile = path.join(portfolioDirectory, 'categories.json')
    if (fs.existsSync(categoriesFile)) {
      const categories: PortfolioCategory[] = JSON.parse(fs.readFileSync(categoriesFile, 'utf-8'))
      return categories.sort((a, b) => a.order - b.order)
    }
    return DEFAULT_CATEGORIES
  } catch (error) {
    console.error('Error reading portfolio categories:', error)
    return DEFAULT_CATEGORIES
  }
}

export function savePortfolioCategories(categories: PortfolioCategory[]): boolean {
  try {
    ensureDirectoryExists()
    const config: PortfolioConfig = { categories }
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2))
    return true
  } catch (error) {
    console.error('Error saving portfolio categories:', error)
    return false
  }
}

// ==================== PROJECTS ====================

export function getAllProjects(): PortfolioProject[] {
  try {
    ensureDirectoryExists()

    const fileNames = fs.readdirSync(portfolioDirectory)
    const projects = fileNames
      .filter(fileName => fileName.endsWith('.json') && !fileName.startsWith('_') && fileName !== 'categories.json')
      .map((fileName) => {
        try {
          const fullPath = path.join(portfolioDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, 'utf-8')
          const project: PortfolioProject = JSON.parse(fileContents)
          return project
        } catch (error) {
          console.error(`Error reading project file ${fileName}:`, error)
          return null
        }
      })
      .filter((project): project is PortfolioProject => project !== null && !project.draft)
      .sort((a, b) => {
        // Sort by order first, then by publish date
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order
        }
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      })

    return projects
  } catch (error) {
    console.error('Error getting all projects:', error)
    return []
  }
}

export function getAllProjectsIncludingDrafts(): PortfolioProject[] {
  try {
    ensureDirectoryExists()

    const fileNames = fs.readdirSync(portfolioDirectory)
    const projects = fileNames
      .filter(fileName => fileName.endsWith('.json') && !fileName.startsWith('_') && fileName !== 'categories.json')
      .map((fileName) => {
        try {
          const fullPath = path.join(portfolioDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, 'utf-8')
          const project: PortfolioProject = JSON.parse(fileContents)
          return project
        } catch (error) {
          console.error(`Error reading project file ${fileName}:`, error)
          return null
        }
      })
      .filter((project): project is PortfolioProject => project !== null)
      .sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order
        }
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      })

    return projects
  } catch (error) {
    console.error('Error getting all projects:', error)
    return []
  }
}

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  try {
    // Sanitize slug to prevent directory traversal
    const sanitizedSlug = slug.replace(/[^a-z0-9-]/gi, '')
    const fullPath = path.join(portfolioDirectory, `${sanitizedSlug}.json`)

    if (!fs.existsSync(fullPath)) {
      console.warn(`Project not found: ${sanitizedSlug}`)
      return undefined
    }

    const fileContents = fs.readFileSync(fullPath, 'utf-8')
    const project: PortfolioProject = JSON.parse(fileContents)
    return project
  } catch (error) {
    console.error(`Error getting project by slug ${slug}:`, error)
    return undefined
  }
}

export function getFeaturedProjects(): PortfolioProject[] {
  return getAllProjects().filter(project => project.featured)
}

export function getProjectsByCategory(categorySlug: string): PortfolioProject[] {
  const categories = getPortfolioCategories()
  const category = categories.find(c => c.slug === categorySlug)
  if (!category) return []

  return getAllProjects().filter(project =>
    project.category.toLowerCase() === category.name.toLowerCase() ||
    project.category.toLowerCase() === categorySlug.toLowerCase()
  )
}

export function saveProject(project: PortfolioProject): boolean {
  try {
    ensureDirectoryExists()
    const fullPath = path.join(portfolioDirectory, `${project.slug}.json`)
    fs.writeFileSync(fullPath, JSON.stringify(project, null, 2))
    return true
  } catch (error) {
    console.error('Error saving project:', error)
    return false
  }
}

export function deleteProject(slug: string): boolean {
  try {
    const sanitizedSlug = slug.replace(/[^a-z0-9-]/gi, '')
    const fullPath = path.join(portfolioDirectory, `${sanitizedSlug}.json`)

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
      return true
    }
    return false
  } catch (error) {
    console.error('Error deleting project:', error)
    return false
  }
}

// ==================== UTILITIES ====================

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateProjectId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
