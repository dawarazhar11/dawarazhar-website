import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getAllProjectsIncludingDrafts, saveProject } from '@/lib/portfolio'
import type { PortfolioProject } from '@/types/portfolio'

export async function GET() {
  try {
    const projects = getAllProjectsIncludingDrafts()
    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project: PortfolioProject = await request.json()

    if (!project.title || !project.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 })
    }

    const success = saveProject(project)
    if (success) {
      return NextResponse.json({ success: true, project })
    } else {
      return NextResponse.json({ error: 'Failed to save project' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project: PortfolioProject = await request.json()

    if (!project.title || !project.slug) {
      return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 })
    }

    const success = saveProject(project)
    if (success) {
      return NextResponse.json({ success: true, project })
    } else {
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}
