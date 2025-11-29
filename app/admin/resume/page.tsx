'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Save, GripVertical } from 'lucide-react'

interface Experience {
  title: string
  company: string
  location: string
  period: string
  description: string[]
  technologies: string[]
}

interface Education {
  degree: string
  school: string
  location: string
  period: string
  gpa: string
  focus: string
  projects: string[]
}

interface Certification {
  name: string
  issuer: string
  date: string
  credential: string
}

interface Publication {
  title: string
  journal: string
  year: string
  authors: string
}

interface ResumeData {
  name: string
  title: string
  location: string
  yearsExperience: string
  email: string
  phone: string
  linkedin: string
  summary: string
  experience: Experience[]
  education: Education[]
  certifications: Certification[]
  skills: Record<string, string[]>
  publications: Publication[]
}

const defaultResumeData: ResumeData = {
  name: "Dawar Azhar",
  title: "Principal Mechanical Engineer | CAD Expert | DFM Specialist",
  location: "Pakistan",
  yearsExperience: "7+",
  email: "dawar.azhar@yahoo.com",
  phone: "+92-312-6475939",
  linkedin: "https://www.linkedin.com/in/dawarazhar/",
  summary: "Entrepreneurial Principal Mechanical Engineer with 7+ years developing breakthrough electromechanical systems from concept through manufacturing. Expert in first principles design approach—questioning industry assumptions to create innovative solutions. Co-invented world's first multi-port solid-state transformer, contributing to $80M in total funding. Skilled in advanced CAD modeling, Design for Manufacturing (DFM), and thermal management with proven track record achieving 10x size reduction and 60% assembly time improvement. Specialized in high-density mechanical packaging, modular design architecture, and manufacturing optimization for high-volume production.",
  experience: [],
  education: [],
  certifications: [],
  skills: {},
  publications: []
}

export default function AdminResumePage() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData)
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('basic')

  useEffect(() => {
    // Load resume data from localStorage or API
    const saved = localStorage.getItem('resumeData')
    if (saved) {
      try {
        setResumeData(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved resume data:', e)
      }
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem('resumeData', JSON.stringify(resumeData))
      alert('Resume data saved successfully! Note: To apply changes to the live site, you need to update the resume/page.tsx file.')
    } catch (error) {
      console.error('Error saving resume:', error)
      alert('Failed to save resume data')
    }
    setIsSaving(false)
  }

  const updateBasicInfo = (field: keyof ResumeData, value: string) => {
    setResumeData(prev => ({ ...prev, [field]: value }))
  }

  // Experience handlers
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        location: '',
        period: '',
        description: [''],
        technologies: []
      }]
    }))
  }

  const updateExperience = (index: number, field: keyof Experience, value: string | string[]) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  // Education handlers
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        school: '',
        location: '',
        period: '',
        gpa: '',
        focus: '',
        projects: ['']
      }]
    }))
  }

  const updateEducation = (index: number, field: keyof Education, value: string | string[]) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  // Certification handlers
  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        name: '',
        issuer: '',
        date: '',
        credential: ''
      }]
    }))
  }

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) =>
        i === index ? { ...cert, [field]: value } : cert
      )
    }))
  }

  const removeCertification = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  // Publication handlers
  const addPublication = () => {
    setResumeData(prev => ({
      ...prev,
      publications: [...prev.publications, {
        title: '',
        journal: '',
        year: '',
        authors: ''
      }]
    }))
  }

  const updatePublication = (index: number, field: keyof Publication, value: string) => {
    setResumeData(prev => ({
      ...prev,
      publications: prev.publications.map((pub, i) =>
        i === index ? { ...pub, [field]: value } : pub
      )
    }))
  }

  const removePublication = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Resume</h1>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 border-b pb-4">
        {['basic', 'experience', 'education', 'certifications', 'publications'].map((section) => (
          <Button
            key={section}
            variant={activeSection === section ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection(section)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Button>
        ))}
      </div>

      {/* Basic Info Section */}
      {activeSection === 'basic' && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resumeData.name}
                  onChange={(e) => updateBasicInfo('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={resumeData.title}
                  onChange={(e) => updateBasicInfo('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={resumeData.location}
                  onChange={(e) => updateBasicInfo('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input
                  type="text"
                  value={resumeData.yearsExperience}
                  onChange={(e) => updateBasicInfo('yearsExperience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => updateBasicInfo('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={resumeData.phone}
                  onChange={(e) => updateBasicInfo('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={resumeData.linkedin}
                  onChange={(e) => updateBasicInfo('linkedin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
              <textarea
                value={resumeData.summary}
                onChange={(e) => updateBasicInfo('summary', e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experience Section */}
      {activeSection === 'experience' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Work Experience</CardTitle>
            <Button onClick={addExperience} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Experience
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                <button
                  onClick={() => removeExperience(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(index, 'period', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="March 2022 - Present"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (one bullet per line)</label>
                  <textarea
                    value={exp.description.join('\n')}
                    onChange={(e) => updateExperience(index, 'description', e.target.value.split('\n'))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={exp.technologies.join(', ')}
                    onChange={(e) => updateExperience(index, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            ))}
            {resumeData.experience.length === 0 && (
              <p className="text-gray-500 text-center py-8">No experience added yet. Click "Add Experience" to get started.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Education Section */}
      {activeSection === 'education' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Education</CardTitle>
            <Button onClick={addEducation} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Education
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                <button
                  onClick={() => removeEducation(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => updateEducation(index, 'location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => updateEducation(index, 'period', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Focus</label>
                    <input
                      type="text"
                      value={edu.focus}
                      onChange={(e) => updateEducation(index, 'focus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Projects (one per line)</label>
                  <textarea
                    value={edu.projects.join('\n')}
                    onChange={(e) => updateEducation(index, 'projects', e.target.value.split('\n'))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            ))}
            {resumeData.education.length === 0 && (
              <p className="text-gray-500 text-center py-8">No education added yet. Click "Add Education" to get started.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Certifications Section */}
      {activeSection === 'certifications' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Certifications</CardTitle>
            <Button onClick={addCertification} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Certification
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {resumeData.certifications.map((cert, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                <button
                  onClick={() => removeCertification(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateCertification(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issuer</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => updateCertification(index, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID</label>
                    <input
                      type="text"
                      value={cert.credential}
                      onChange={(e) => updateCertification(index, 'credential', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}
            {resumeData.certifications.length === 0 && (
              <p className="text-gray-500 text-center py-8">No certifications added yet. Click "Add Certification" to get started.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Publications Section */}
      {activeSection === 'publications' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Publications</CardTitle>
            <Button onClick={addPublication} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Publication
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {resumeData.publications.map((pub, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                <button
                  onClick={() => removePublication(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={pub.title}
                      onChange={(e) => updatePublication(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Journal</label>
                    <input
                      type="text"
                      value={pub.journal}
                      onChange={(e) => updatePublication(index, 'journal', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={pub.year}
                      onChange={(e) => updatePublication(index, 'year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Authors</label>
                    <input
                      type="text"
                      value={pub.authors}
                      onChange={(e) => updatePublication(index, 'authors', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}
            {resumeData.publications.length === 0 && (
              <p className="text-gray-500 text-center py-8">No publications added yet. Click "Add Publication" to get started.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
