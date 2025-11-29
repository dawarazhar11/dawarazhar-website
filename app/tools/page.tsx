"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Thermometer,
  Cpu,
  Fan,
  CircuitBoard,
  Activity,
  ArrowRight,
  Zap
} from "lucide-react"

const tools = [
  {
    name: "Thermal Stack Builder",
    href: "/tools/thermal-stack",
    icon: Thermometer,
    description: "Visual thermal resistance calculator. Model heat flow from junction to ambient with interactive diagrams.",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-50",
    features: ["Interactive thermal path", "Real-time temperature", "Visual gradient"]
  },
  {
    name: "Power Loss Calculator",
    href: "/tools/power-loss",
    icon: Cpu,
    description: "Calculate MOSFET and IGBT conduction and switching losses. Includes device database.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    features: ["MOSFET & IGBT", "Switching losses", "Loss breakdown chart"]
  },
  {
    name: "Heatsink Selector",
    href: "/tools/heatsink-selector",
    icon: Fan,
    description: "Find the right heatsink for your application. Calculate required thermal resistance.",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    features: ["Heatsink database", "Thermal budget", "Altitude derating"]
  },
  {
    name: "PCB Trace Calculator",
    href: "/tools/pcb-trace",
    icon: CircuitBoard,
    description: "Calculate minimum trace width for your current using IPC-2152 standards.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    features: ["IPC-2152 compliant", "Internal/External", "Resistance calc"]
  },
  {
    name: "Transient Thermal",
    href: "/tools/transient-thermal",
    icon: Activity,
    description: "Analyze junction temperature during pulsed operation. Visualize thermal response.",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50",
    features: ["Pulse analysis", "Zth curves", "Time response"]
  }
]

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Zap className="h-4 w-4" />
          Power Electronics Tools
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Engineering Calculators
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Interactive tools for thermal management, power loss calculations, and PCB design.
          Built for power electronics engineers.
        </p>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => {
          const Icon = tool.icon
          return (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Link href={tool.href}>
                <div className="group bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                  {/* Header with gradient */}
                  <div className={`h-2 bg-gradient-to-r ${tool.color}`} />

                  <div className="p-6">
                    {/* Icon */}
                    <div className={`${tool.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 bg-gradient-to-r ${tool.color} bg-clip-text`} style={{ color: 'currentColor' }} />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h2>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4">
                      {tool.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                      Open Tool
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Info Section */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border p-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold mb-3">About These Tools</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>
            <strong className="text-slate-900">Accuracy</strong>
            <p>Calculations follow industry standards (IPC-2152, thermal network models). Always verify critical designs.</p>
          </div>
          <div>
            <strong className="text-slate-900">Privacy</strong>
            <p>All calculations run in your browser. No data is sent to servers or stored.</p>
          </div>
          <div>
            <strong className="text-slate-900">Feedback</strong>
            <p>Found a bug or have suggestions? Contact me at hello@dawarazhar.com</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
