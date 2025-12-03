"use client"

import { motion } from "framer-motion"
import { Mail, Linkedin, Github, Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@dawarazhar.com",
    href: "mailto:hello@dawarazhar.com",
    description: "Best for detailed inquiries",
    color: "bg-blue-500",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/dawarazhar",
    href: "https://linkedin.com/in/dawarazhar",
    description: "Connect professionally",
    color: "bg-[#0077B5]",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/dawarazhar11",
    href: "https://github.com/dawarazhar11",
    description: "Check out my projects",
    color: "bg-gray-800",
  },
]

const availabilityInfo = [
  { icon: MapPin, label: "Location", value: "Available for remote work globally" },
  { icon: Clock, label: "Response Time", value: "Usually within 24-48 hours" },
]

const openToItems = [
  "Technical consulting & advisory",
  "Power electronics design reviews",
  "Speaking engagements & workshops",
  "Collaboration on research projects",
  "Career mentoring & guidance",
]

export default function ContactPage() {
  // Load Calendly widget script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]')
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return (
    <div className="container py-12 max-w-6xl mx-auto px-4">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have a question, want to collaborate, or just want to say hello?
          I&apos;d love to hear from you. Choose the best way to reach me below.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Contact Methods */}
        <div className="space-y-6">
          {/* Contact Cards */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Contact Methods</h2>
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.label}
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-4 p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition-all group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className={`p-3 rounded-lg ${method.color} text-white`}>
                    <method.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{method.label}</div>
                    <div className="text-sm text-muted-foreground">{method.description}</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Availability Info */}
          <motion.div
            className="bg-slate-50 rounded-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="font-semibold mb-4">Availability</h3>
            <div className="space-y-3">
              {availabilityInfo.map((info) => (
                <div key={info.label} className="flex items-center gap-3">
                  <info.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">{info.label}: </span>
                    <span className="text-sm font-medium">{info.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Open To */}
          <motion.div
            className="bg-blue-50 rounded-xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="font-semibold mb-4 text-blue-900">Open To</h3>
            <ul className="space-y-2">
              {openToItems.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                  <span className="text-blue-500 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Right Column - Calendly */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-500" />
            Schedule a Call
          </h2>
          <p className="text-muted-foreground mb-4">
            Book a 30-minute call to discuss your project, ask questions, or explore collaboration opportunities.
          </p>

          {/* Calendly Inline Widget */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div
              className="calendly-inline-widget"
              data-url="https://calendly.com/mdawar-azhar/30min?hide_gdpr_banner=1&background_color=ffffff&text_color=1a1a1a&primary_color=3b82f6"
              style={{ minWidth: "320px", height: "630px" }}
            />
          </div>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            Don&apos;t have a Calendly account? No worries - just pick a time and enter your details.
          </p>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="mt-12 text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-2">Prefer a quick message?</h3>
        <p className="text-muted-foreground mb-4">
          Drop me an email and I&apos;ll get back to you as soon as possible.
        </p>
        <a
          href="mailto:hello@dawarazhar.com"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Mail className="h-5 w-5" />
          Send an Email
        </a>
      </motion.div>
    </div>
  )
}
