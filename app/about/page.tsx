"use client"

import { motion } from "framer-motion"
import { MetricsSection } from "@/components/about/metrics-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Award, BookOpen } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const specializations = [
    "Medium Voltage Systems",
    "Solid-State Transformers",
    "First Principles Design",
    "High-Density Power Electronics",
    "Thermal Management",
    "CAD/SolidWorks Expert",
    "Design for Manufacturing",
    "Startup Product Development"
  ]

  const achievements = [
    { icon: Award, title: "Innovation Leadership", description: "Co-invented world's first multi-port solid-state transformer with patent-pending technology" },
    { icon: BookOpen, title: "Business Impact", description: "Contributed to $80M total funding ($20M Series A + $60M follow-on) and generated tens of millions in purchase orders" },
    { icon: Calendar, title: "Technical Excellence", description: "Achieved 10x size reduction and 60% assembly time improvement through advanced engineering" }
  ]

  return (
    <div className="container py-10 max-w-6xl">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="relative inline-block mb-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            DA
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <Badge variant="secondary" className="px-3 py-1">
              <MapPin className="w-3 h-3 mr-1" />
              Open to new projects
            </Badge>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Dawar Azhar
        </h1>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          Principal Mechanical Engineer & Founding Team Member specializing in medium voltage (MV) power electronics
          and solid-state transformer (SST) technology. Expert in high-density mechanical packaging for
          next-generation grid infrastructure and energy systems.
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {specializations.map((spec) => (
            <Badge key={spec} variant="outline" className="px-3 py-1">
              {spec}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/resume">View Resume</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/portfolio">See My Work</Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="mailto:hello@dawarazhar.com">Get In Touch</a>
          </Button>
        </div>
      </motion.div>

      {/* Metrics and Visualizations */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Professional Overview</h2>
        <MetricsSection />
      </motion.section>

      {/* About Content */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Professional Journey</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray dark:prose-invert max-w-none">
                <p>
                  I'm an entrepreneurial Principal Mechanical Engineer with 7+ years of proven track record
                  building breakthrough medium voltage (MV) power electronics from startup phase through commercial
                  success. I apply a first principles design approach—questioning industry assumptions and rebuilding
                  solutions from the ground up. As a founding team member, I co-invented the world's first multi-port
                  solid-state transformer (SST), contributing to $80M in total funding and generating tens of millions
                  in purchase orders.
                </p>

                <p>
                  My expertise centers on MV systems design, including 15kV-class power electronics packaging,
                  high-voltage insulation coordination, and advanced thermal management for SST applications.
                  I've achieved remarkable results including 10x size reduction in MV converter packaging,
                  60% assembly time reduction, and 35% manufacturing cost savings through innovative engineering
                  solutions combining silicon carbide (SiC) power modules with optimized mechanical architectures.
                </p>

                <p>
                  Specializing in high-density power electronics packaging for grid-scale applications, modular
                  SST architecture, and manufacturing optimization for utility-grade equipment, I excel at
                  transforming complex MV engineering challenges into breakthrough commercial products. My work
                  on next-generation grid infrastructure has established new industry standards for power density
                  and reliability in solid-state transformer technology.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6"
          >
            {achievements.map((achievement, index) => (
              <Card key={achievement.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <achievement.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Connect Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center"
      >
        <Card>
          <CardHeader>
            <CardTitle>Let's Connect & Collaborate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Ready to tackle complex engineering challenges, explore innovative solutions, 
              and collaborate with forward-thinking teams on breakthrough technologies.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" asChild>
                <a href="https://github.com/dawarazhar11" target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://www.linkedin.com/in/dawarazhar/" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </Button>
              <Button asChild>
                <a href="mailto:hello@dawarazhar.com">
                  Email Me
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  )
}