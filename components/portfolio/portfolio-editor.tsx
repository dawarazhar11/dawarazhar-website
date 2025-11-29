"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, ArrowLeft, X, Upload, Box, Image as ImageIcon, AlertCircle } from 'lucide-react'
import type { PortfolioProject, PortfolioCategory, Model3DSettings } from '@/types/portfolio'

// Dynamically import 3D viewer to avoid SSR issues
const Model3DViewer = dynamic(
  () => import('@/components/portfolio/model-3d-viewer').then(mod => mod.Model3DViewer),
  { ssr: false, loading: () => <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">Loading 3D viewer...</div> }
)

interface PortfolioEditorProps {
  project?: PortfolioProject
  isNew?: boolean
}

const ENVIRONMENT_PRESETS = [
  'studio', 'warehouse', 'forest', 'city', 'sunset', 'dawn', 'night', 'apartment', 'park', 'lobby'
] as const

export function PortfolioEditor({ project, isNew = false }: PortfolioEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<PortfolioCategory[]>([])
  const [techInput, setTechInput] = useState('')
  const [highlightInput, setHighlightInput] = useState('')
  const [uploadingModel, setUploadingModel] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [formData, setFormData] = useState<Partial<PortfolioProject>>({
    title: project?.title || '',
    slug: project?.slug || '',
    description: project?.description || '',
    fullDescription: project?.fullDescription || '',
    category: project?.category || '',
    technologies: project?.technologies || [],
    highlights: project?.highlights || [],
    coverImage: project?.coverImage || '',
    images: project?.images || [],
    model3D: project?.model3D || undefined,
    githubUrl: project?.githubUrl || '',
    liveUrl: project?.liveUrl || '',
    documentationUrl: project?.documentationUrl || '',
    year: project?.year || new Date().getFullYear().toString(),
    client: project?.client || '',
    duration: project?.duration || '',
    role: project?.role || '',
    featured: project?.featured || false,
    draft: project?.draft ?? true,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/portfolio/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: isNew ? generateSlug(title) : prev.slug
    }))
  }

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies?.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), techInput.trim()]
      }))
      setTechInput('')
    }
  }

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(t => t !== tech) || []
    }))
  }

  const addHighlight = () => {
    if (highlightInput.trim() && !formData.highlights?.includes(highlightInput.trim())) {
      setFormData(prev => ({
        ...prev,
        highlights: [...(prev.highlights || []), highlightInput.trim()]
      }))
      setHighlightInput('')
    }
  }

  const removeHighlight = (highlight: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights?.filter(h => h !== highlight) || []
    }))
  }

  const updateModel3D = (updates: Partial<Model3DSettings>) => {
    setFormData(prev => ({
      ...prev,
      model3D: prev.model3D ? { ...prev.model3D, ...updates } : { file: '', ...updates }
    }))
  }

  const handleModelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
      alert('Please upload a .glb or .gltf file')
      return
    }

    setUploadingModel(true)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('slug', formData.slug || 'temp')
    formDataUpload.append('type', 'model')

    try {
      const response = await fetch('/api/portfolio/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        updateModel3D({ file: data.url })
      } else {
        alert('Failed to upload model')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading model')
    } finally {
      setUploadingModel(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('slug', formData.slug || 'temp')
    formDataUpload.append('type', 'image')

    try {
      const response = await fetch('/api/portfolio/upload', {
        method: 'POST',
        body: formDataUpload,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData(prev => ({ ...prev, coverImage: data.url }))
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const projectData: PortfolioProject = {
      id: project?.id || `proj_${Date.now()}`,
      slug: formData.slug || generateSlug(formData.title || ''),
      title: formData.title || '',
      description: formData.description || '',
      fullDescription: formData.fullDescription,
      category: formData.category || 'Other',
      technologies: formData.technologies || [],
      highlights: formData.highlights,
      coverImage: formData.coverImage,
      images: formData.images,
      model3D: formData.model3D?.file ? formData.model3D : undefined,
      githubUrl: formData.githubUrl,
      liveUrl: formData.liveUrl,
      documentationUrl: formData.documentationUrl,
      year: formData.year,
      client: formData.client,
      duration: formData.duration,
      role: formData.role,
      featured: formData.featured || false,
      order: project?.order,
      publishDate: project?.publishDate || new Date().toISOString(),
      draft: formData.draft ?? false,
    }

    try {
      const response = await fetch('/api/portfolio/projects', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })

      if (response.ok) {
        router.push('/admin/portfolio')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to save project')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Error saving project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={() => router.push('/admin/portfolio')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={!formData.draft}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, draft: !checked }))}
            />
            <Label>{formData.draft ? 'Draft' : 'Published'}</Label>
          </div>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="media">Media & 3D Model</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Project title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="project-slug"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the project"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
                <Label>Featured Project</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Add technology"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                />
                <Button type="button" onClick={addTechnology}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.technologies?.map((tech) => (
                  <Badge key={tech} variant="secondary" className="gap-1">
                    {tech}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTechnology(tech)} />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Cover Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.coverImage && (
                <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={formData.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
              </div>
              <div className="text-sm text-muted-foreground">
                Or enter URL directly:
                <Input
                  value={formData.coverImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                3D Model (GLB/GLTF)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Recommended format: GLB (Binary glTF)</p>
                    <p className="text-blue-700">Export from SolidWorks, Blender, or other CAD software. Max file size: 50MB</p>
                  </div>
                </div>
              </div>

              <div>
                <Label>Upload 3D Model</Label>
                <Input
                  type="file"
                  accept=".glb,.gltf"
                  onChange={handleModelUpload}
                  disabled={uploadingModel}
                  className="mt-1"
                />
                {uploadingModel && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
              </div>

              <div>
                <Label>Or enter model URL</Label>
                <Input
                  value={formData.model3D?.file || ''}
                  onChange={(e) => updateModel3D({ file: e.target.value })}
                  placeholder="/portfolio/project-name/model.glb"
                  className="mt-1"
                />
              </div>

              {formData.model3D?.file && (
                <>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="h-[300px]">
                      <Suspense fallback={<div className="h-full bg-gray-100 flex items-center justify-center">Loading viewer...</div>}>
                        <Model3DViewer settings={formData.model3D} showControls={false} />
                      </Suspense>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Scale</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.model3D?.scale || 1}
                        onChange={(e) => updateModel3D({ scale: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Environment</Label>
                      <Select
                        value={formData.model3D?.environmentPreset || 'studio'}
                        onValueChange={(value: typeof ENVIRONMENT_PRESETS[number]) => updateModel3D({ environmentPreset: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ENVIRONMENT_PRESETS.map((preset) => (
                            <SelectItem key={preset} value={preset}>
                              {preset.charAt(0).toUpperCase() + preset.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.model3D?.autoRotate ?? true}
                        onCheckedChange={(checked) => updateModel3D({ autoRotate: checked })}
                      />
                      <Label>Auto Rotate</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.model3D?.enableZoom ?? true}
                        onCheckedChange={(checked) => updateModel3D({ enableZoom: checked })}
                      />
                      <Label>Enable Zoom</Label>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setFormData(prev => ({ ...prev, model3D: undefined }))}
                  >
                    Remove 3D Model
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Full Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.fullDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                placeholder="Detailed description of the project (supports Markdown)"
                rows={10}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  placeholder="Add key achievement or feature"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                />
                <Button type="button" onClick={addHighlight}>Add</Button>
              </div>
              <ul className="space-y-2">
                {formData.highlights?.map((highlight, index) => (
                  <li key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <span className="flex-1">{highlight}</span>
                    <X className="h-4 w-4 cursor-pointer text-gray-500 hover:text-red-500" onClick={() => removeHighlight(highlight)} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                    placeholder="Client name (optional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 3 months, Ongoing"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Lead Engineer, Sole Developer"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub Repository</Label>
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live Demo / Website</Label>
                <Input
                  id="liveUrl"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentationUrl">Documentation</Label>
                <Input
                  id="documentationUrl"
                  value={formData.documentationUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, documentationUrl: e.target.value }))}
                  placeholder="https://docs.example.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}

export default PortfolioEditor
