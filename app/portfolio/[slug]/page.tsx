import { notFound } from 'next/navigation'
import { getProjectBySlug, getAllProjects } from '@/lib/portfolio'
import { PortfolioDetailContent } from '@/components/portfolio/portfolio-detail-content'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} | Portfolio`,
    description: project.description,
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return <PortfolioDetailContent project={project} />
}
