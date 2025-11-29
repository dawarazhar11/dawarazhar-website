export interface Model3DSettings {
  file: string                              // Path to .glb file
  scale?: number                            // Default scale (default: 1)
  position?: [number, number, number]       // [x, y, z] position
  rotation?: [number, number, number]       // [x, y, z] rotation in radians
  autoRotate?: boolean                      // Enable auto-rotation
  autoRotateSpeed?: number                  // Rotation speed (default: 2)
  cameraPosition?: [number, number, number] // Camera position
  environmentPreset?: 'studio' | 'warehouse' | 'forest' | 'city' | 'sunset' | 'dawn' | 'night' | 'apartment' | 'park' | 'lobby'
  backgroundColor?: string                  // Background color (hex)
  enableZoom?: boolean                      // Allow zoom (default: true)
  enablePan?: boolean                       // Allow panning (default: true)
  minDistance?: number                      // Minimum zoom distance
  maxDistance?: number                      // Maximum zoom distance
}

export interface PortfolioProject {
  id: string
  slug: string
  title: string
  description: string
  category: string

  // Media
  coverImage?: string
  images?: string[]
  model3D?: Model3DSettings

  // Content
  fullDescription?: string    // Markdown content for detailed view
  technologies: string[]
  highlights?: string[]       // Key achievements/features

  // Links
  githubUrl?: string
  liveUrl?: string
  documentationUrl?: string

  // Metadata
  year?: string
  client?: string
  duration?: string           // e.g., "3 months", "Ongoing"
  role?: string               // e.g., "Lead Engineer", "Sole Developer"
  featured: boolean
  order?: number              // For custom sorting
  publishDate: string
  draft: boolean
}

export interface PortfolioCategory {
  id: string
  name: string
  slug: string
  description?: string
  order: number
}

export interface PortfolioConfig {
  categories: PortfolioCategory[]
}

// Default categories
export const DEFAULT_CATEGORIES: PortfolioCategory[] = [
  { id: '1', name: 'Solid-State Transformers', slug: 'sst', description: 'SST and MV power conversion systems', order: 1 },
  { id: '2', name: 'MV Power Systems', slug: 'mv-systems', description: 'Medium voltage power electronics', order: 2 },
  { id: '3', name: 'Thermal Management', slug: 'thermal', description: 'Cooling systems and thermal design', order: 3 },
  { id: '4', name: 'Mechanical Design', slug: 'mechanical', description: 'CAD and mechanical engineering', order: 4 },
  { id: '5', name: 'Engineering Software', slug: 'software', description: 'Engineering tools and simulations', order: 5 },
  { id: '6', name: 'AI/ML', slug: 'ai-ml', description: 'Machine learning projects', order: 6 },
]
