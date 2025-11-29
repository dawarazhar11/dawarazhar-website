"use client"

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Box, Star, Filter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { PortfolioProject, PortfolioCategory } from '@/types/portfolio'

// Dynamically import 3D viewer to avoid SSR issues
const Model3DViewer = dynamic(
  () => import('@/components/portfolio/model-3d-viewer').then(mod => mod.Model3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-lg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }
)

interface PortfolioContentProps {
  projects: PortfolioProject[]
  categories: PortfolioCategory[]
}

export function PortfolioContent({ projects, categories }: PortfolioContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p =>
        p.category.toLowerCase() === selectedCategory.toLowerCase() ||
        categories.find(c => c.slug === selectedCategory)?.name.toLowerCase() === p.category.toLowerCase()
      )

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="space-y-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl font-bold tracking-tight lg:text-5xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Portfolio
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A collection of my engineering projects, featuring MV power electronics, solid-state transformers, and mechanical design work.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            <Filter className="h-4 w-4 mr-2" />
            All Projects
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.slug)}
            >
              {category.name}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <Box className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                {selectedCategory === 'all'
                  ? 'Projects will appear here once added.'
                  : 'No projects in this category yet.'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHoveredProject(project.id)}
                  onHoverEnd={() => setHoveredProject(null)}
                >
                  <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    {/* 3D Model or Cover Image */}
                    {project.model3D?.file ? (
                      <div className="h-48 relative">
                        <Suspense fallback={
                          <div className="h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                          </div>
                        }>
                          <Model3DViewer
                            settings={{
                              ...project.model3D,
                              autoRotate: hoveredProject === project.id,
                            }}
                            className="h-full"
                            showControls={false}
                          />
                        </Suspense>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-white/80">
                            <Box className="h-3 w-3 mr-1" />
                            3D
                          </Badge>
                        </div>
                      </div>
                    ) : project.coverImage ? (
                      <div className="h-48 relative overflow-hidden bg-muted">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                        <Box className="h-12 w-12 text-blue-300" />
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <motion.span
                          className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary"
                          whileHover={{ scale: 1.1 }}
                        >
                          {project.category}
                        </motion.span>
                        {project.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {(project.technologies || []).slice(0, 4).map((tech, techIndex) => (
                          <motion.span
                            key={tech}
                            className="text-xs px-2 py-1 bg-muted rounded-md"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.8 + index * 0.1 + techIndex * 0.05 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                        {(project.technologies || []).length > 4 && (
                          <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">
                            +{(project.technologies || []).length - 4}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        {project.githubUrl && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button variant="outline" size="sm" asChild>
                              <Link href={project.githubUrl} target="_blank" rel="noreferrer">
                                <Github className="h-4 w-4 mr-1" />
                                Code
                              </Link>
                            </Button>
                          </motion.div>
                        )}
                        {project.liveUrl && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button variant="outline" size="sm" asChild>
                              <Link href={project.liveUrl} target="_blank" rel="noreferrer">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Demo
                              </Link>
                            </Button>
                          </motion.div>
                        )}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="ml-auto"
                        >
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/portfolio/${project.slug}`}>
                              View Details
                            </Link>
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
