"use client"

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ExternalLink, Github, FileText, Calendar, User, Clock, Building, Box, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import type { PortfolioProject } from '@/types/portfolio'
import ReactMarkdown from 'react-markdown'

// Dynamically import 3D viewer to avoid SSR issues
const Model3DViewer = dynamic(
  () => import('@/components/portfolio/model-3d-viewer').then(mod => mod.Model3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }
)

interface PortfolioDetailContentProps {
  project: PortfolioProject
}

export function PortfolioDetailContent({ project }: PortfolioDetailContentProps) {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/portfolio">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Portfolio
            </Link>
          </Button>
        </motion.div>

        {/* Header Section */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary" className="text-sm">
              {project.category}
            </Badge>
            {project.featured && (
              <Badge variant="default" className="bg-yellow-500 text-white">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}
            {project.year && (
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                {project.year}
              </Badge>
            )}
          </div>

          <motion.h1
            className="text-3xl font-bold tracking-tight lg:text-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {project.title}
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {project.description}
          </motion.p>
        </motion.div>

        {/* 3D Model or Cover Image */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {project.model3D?.file ? (
            <div className="rounded-lg overflow-hidden border">
              <Suspense fallback={
                <div className="h-[400px] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              }>
                <Model3DViewer
                  settings={{
                    ...project.model3D,
                    autoRotate: true,
                  }}
                  className="h-[400px]"
                  showControls={true}
                />
              </Suspense>
              <div className="bg-muted/50 px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                <Box className="h-4 w-4" />
                Interactive 3D Model - Drag to rotate, scroll to zoom
              </div>
            </div>
          ) : project.coverImage ? (
            <div className="rounded-lg overflow-hidden border">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          ) : (
            <div className="h-[300px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border">
              <Box className="h-16 w-16 text-blue-300" />
            </div>
          )}
        </motion.div>

        {/* Project Info Cards */}
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {project.role && (
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm font-medium">{project.role}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {project.client && (
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Client</p>
                  <p className="text-sm font-medium">{project.client}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {project.duration && (
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">{project.duration}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {project.year && (
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Year</p>
                  <p className="text-sm font-medium">{project.year}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Technologies */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold mb-3">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <motion.span
                key={tech}
                className="px-3 py-1.5 bg-muted rounded-full text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.highlights.map((highlight, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    >
                      <span className="text-green-500 mt-1">&#10003;</span>
                      <span>{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Full Description */}
        {project.fullDescription && (
          <motion.div
            className="mb-8 prose prose-gray dark:prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <ReactMarkdown>{project.fullDescription}</ReactMarkdown>
          </motion.div>
        )}

        {/* Image Gallery */}
        {project.images && project.images.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h2 className="text-lg font-semibold mb-4">Gallery</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {project.images.map((image, index) => (
                <motion.div
                  key={index}
                  className="rounded-lg overflow-hidden border"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {project.githubUrl && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild>
                <Link href={project.githubUrl} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  View Code
                </Link>
              </Button>
            </motion.div>
          )}
          {project.liveUrl && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="secondary" asChild>
                <Link href={project.liveUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </Link>
              </Button>
            </motion.div>
          )}
          {project.documentationUrl && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" asChild>
                <Link href={project.documentationUrl} target="_blank" rel="noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  Documentation
                </Link>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
