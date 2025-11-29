"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { PortfolioEditor } from '@/components/portfolio/portfolio-editor'
import type { PortfolioProject } from '@/types/portfolio'

export default function EditPortfolioPage() {
  const params = useParams()
  const slug = params.slug as string
  const [project, setProject] = useState<PortfolioProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/portfolio/projects/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setProject(data.project)
        } else {
          setError('Project not found')
        }
      } catch (err) {
        setError('Error loading project')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProject()
    }
  }, [slug])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading project...</div>
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">{error || 'Project not found'}</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Project: {project.title}</h1>
      <PortfolioEditor project={project} />
    </div>
  )
}
