"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, Download, ExternalLink, Award, GraduationCap, Briefcase } from "lucide-react"

export default function ResumePage() {
  const experience = [
    {
      title: "Principal Mechanical Engineer & Founding Team Member",
      company: "Angularspring",
      location: "Lahore, Pakistan",
      period: "March 2022 - Present",
      description: [
        "Co-invented world's first multi-port solid-state transformer (SST), enabling breakthrough MV power electronics from startup to $80M total funding",
        "Designed 15kV-class MV converter packaging with advanced high-voltage insulation coordination and creepage/clearance optimization",
        "Engineered thermal management systems for 400kW+ SiC-based MV converters achieving industry-leading power density",
        "Applied first principles design to SST mechanical architecture, achieving 10x size reduction versus conventional transformer solutions",
        "Developed modular MV power building blocks enabling scalable grid infrastructure from 100kW to multi-MW systems",
        "Generated tens of millions in utility purchase orders for grid-scale SST deployments across North America"
      ],
      technologies: ["SolidWorks", "ANSYS", "CATIA V5", "COMSOL", "HV Insulation Design", "SiC Power Modules"]
    },
    {
      title: "Lead Product Development Engineer",
      company: "Powersoft19",
      location: "Lahore, Pakistan",
      period: "July 2021 - Feb 2022",
      description: [
        "Designed modular mechanical architecture synchronizing 1000+ components through validated DFMA analysis",
        "Increased mechanical system reliability by 40% through comprehensive DfR modeling and failure mode analysis",
        "Led seamless transition from prototype designs to full-scale manufacturing maintaining >90% yield rates",
        "Developed MVP architecture balancing technical performance with startup resource constraints"
      ],
      technologies: ["SolidWorks", "Pro Engineer", "Windchill", "ANSYS", "Lean Six Sigma", "DFMA"]
    },
    {
      title: "Product Development Engineer / Mechanical Design Engineer", 
      company: "Powersoft19",
      location: "Lahore, Pakistan",
      period: "July 2018 - June 2021",
      description: [
        "Developed sophisticated mechanical packaging for extreme conditions (-40°C operation, UV protection, IP65/66)",
        "Pioneered 3D printing integration reducing development cycles from 6 months to 1 month for 30+ components",
        "Achieved 30% improvement in operational longevity through innovative thermal management solutions",
        "Created cost-effective solutions achieving 30% performance advantage over established competitors"
      ],
      technologies: ["SolidWorks", "AutoCAD", "ANSYS Thermal", "3D Printing", "CNC Milling", "Injection Molding"]
    }
  ]

  const education = [
    {
      degree: "Master of Science in Manufacturing Engineering",
      school: "University of Engineering and Technology (UET)",
      location: "Lahore, Pakistan",
      period: "2022 - 2025",
      gpa: "In Progress",
      focus: "Advanced Manufacturing and Design Optimization",
      projects: [
        "Research on additive manufacturing optimization",
        "Advanced materials and thermal management systems"
      ]
    },
    {
      degree: "Bachelor of Science in Mechanical Engineering",
      school: "University of Engineering and Technology (UET)",
      location: "Lahore, Pakistan",
      period: "2014 - 2018",
      gpa: "Distinction",
      focus: "Mechanical Design and Manufacturing",
      projects: [
        "Senior Design: Advanced power electronics cooling systems",
        "Research on Design for Manufacturing principles"
      ]
    }
  ]

  const certifications = [
    {
      name: "Lean Six Sigma Green Belt",
      issuer: "International Association for Six Sigma Certification",
      date: "2023",
      credential: "LSS-GB-2023"
    },
    {
      name: "Advanced SolidWorks Professional",
      issuer: "Dassault Systèmes",
      date: "2022",
      credential: "CSWP-Advanced"
    },
    {
      name: "Design for Manufacturing & Assembly (DFMA)",
      issuer: "Boothroyd Dewhurst Inc.",
      date: "2021",
      credential: "DFMA-Certified"
    },
    {
      name: "Geometric Dimensioning & Tolerancing (GD&T)",
      issuer: "ASME",
      date: "2020",
      credential: "ASME-GDT-2020"
    }
  ]

  const skills = {
    "MV Power Electronics": ["15kV-Class Systems", "Solid-State Transformers", "SiC Power Modules", "HV Insulation Design", "Creepage/Clearance"],
    "CAD & Design Tools": ["SolidWorks (Expert)", "CATIA V5", "Pro Engineer", "PTC Creo", "AutoCAD"],
    "Analysis & Simulation": ["ANSYS (Thermal/Structural)", "COMSOL Multiphysics", "CFD Analysis", "HV Field Simulation"],
    "Design Principles": ["First Principles Design", "GD&T", "DFMA", "High-Density Packaging", "Modular Architecture"],
    "Thermal Management": ["Liquid Cooling Systems", "Cold Plates", "Heat Sinks", "Thermal Interface Materials"],
    "Manufacturing": ["3D Printing", "CNC Milling", "Sheet Metal", "Potting/Encapsulation", "HV Assembly"]
  }

  const publications = [
    {
      title: "Advanced Mesh Adaptation Techniques for Computational Fluid Dynamics",
      journal: "Journal of Computational Physics",
      year: "2023",
      authors: "D. Azhar, et al."
    },
    {
      title: "Machine Learning Applications in Engineering Simulation Workflows",
      journal: "International Journal of Engineering Applications",
      year: "2022",
      authors: "D. Azhar, J. Smith"
    }
  ]

  return (
    <div className="container py-10 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-2">Dawar Azhar</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Principal Mechanical Engineer | MV Power Electronics | SST Technology
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Pakistan
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            7+ Years Experience
          </div>
          <div className="flex items-center gap-1">
            dawar.azhar@yahoo.com
          </div>
          <div className="flex items-center gap-1">
            +92-312-6475939
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" asChild>
            <a href="mailto:hello@dawarazhar.com">
              Contact Me
            </a>
          </Button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Professional Summary */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Entrepreneurial Principal Mechanical Engineer with 7+ years developing breakthrough medium voltage
                  (MV) power electronics and solid-state transformer (SST) systems from concept through manufacturing.
                  Expert in first principles design approach—questioning industry assumptions to create innovative
                  solutions. Co-invented world's first multi-port SST, contributing to $80M in total funding.
                  Specialized in 15kV-class power electronics packaging, high-voltage insulation coordination,
                  and advanced thermal management for SiC-based MV converters. Proven track record achieving
                  10x size reduction in MV packaging and 60% assembly time improvement through innovative
                  mechanical architectures optimized for utility-grade grid infrastructure applications.
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* Experience */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {experience.map((job, index) => (
                    <div key={index} className="relative">
                      {index !== experience.length - 1 && (
                        <div className="absolute left-0 top-8 w-px h-full bg-border" />
                      )}
                      <div className="relative flex gap-4">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 relative z-10" />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="text-lg font-semibold">{job.title}</h3>
                              <p className="text-blue-600 font-medium">{job.company}</p>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <p>{job.period}</p>
                              <p>{job.location}</p>
                            </div>
                          </div>
                          <ul className="space-y-2 mb-4">
                            {job.description.map((item, i) => (
                              <li key={i} className="text-sm text-muted-foreground">
                                • {item}
                              </li>
                            ))}
                          </ul>
                          <div className="flex flex-wrap gap-2">
                            {job.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Education */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div key={index}>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{edu.degree}</h3>
                          <p className="text-blue-600 font-medium">{edu.school}</p>
                          <p className="text-sm text-muted-foreground">
                            Focus: {edu.focus} • GPA: {edu.gpa}
                          </p>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{edu.period}</p>
                          <p>{edu.location}</p>
                        </div>
                      </div>
                      <ul className="space-y-1">
                        {edu.projects.map((project, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {project}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Publications */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Publications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {publications.map((pub, index) => (
                    <div key={index}>
                      <h3 className="font-semibold">{pub.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pub.journal} • {pub.year} • {pub.authors}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">dawar.azhar@yahoo.com</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">+92-312-6475939</p>
                </div>
                <div>
                  <p className="text-sm font-medium">LinkedIn</p>
                  <a 
                    href="https://www.linkedin.com/in/dawarazhar/" 
                    className="text-sm text-blue-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    linkedin.com/in/dawarazhar
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">Pakistan</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Technical Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(skills).map(([category, skillList]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {skillList.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-semibold">{cert.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {cert.issuer} • {cert.date}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ID: {cert.credential}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}