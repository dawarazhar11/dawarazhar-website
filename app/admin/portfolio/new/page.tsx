"use client"

import { PortfolioEditor } from '@/components/portfolio/portfolio-editor'

export default function NewPortfolioPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
      <PortfolioEditor isNew />
    </div>
  )
}
