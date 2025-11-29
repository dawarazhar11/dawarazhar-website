"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Thermometer,
  Cpu,
  Fan,
  CircuitBoard,
  Activity,
  Calculator,
  ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"

const tools = [
  {
    name: "Thermal Stack",
    href: "/tools/thermal-stack",
    icon: Thermometer,
    description: "Visual thermal resistance calculator"
  },
  {
    name: "Power Loss",
    href: "/tools/power-loss",
    icon: Cpu,
    description: "MOSFET/IGBT loss calculator"
  },
  {
    name: "Heatsink Selector",
    href: "/tools/heatsink-selector",
    icon: Fan,
    description: "Find the right heatsink"
  },
  {
    name: "PCB Trace",
    href: "/tools/pcb-trace",
    icon: CircuitBoard,
    description: "Trace width calculator (IPC-2152)"
  },
  {
    name: "Transient Thermal",
    href: "/tools/transient-thermal",
    icon: Activity,
    description: "Pulsed load thermal analysis"
  }
]

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isToolsHome = pathname === "/tools"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Site
              </Link>
              <div className="h-4 w-px bg-border" />
              <Link href="/tools" className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">Engineering Tools</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Hidden on tools home, visible on tool pages */}
          {!isToolsHome && (
            <aside className="lg:w-64 shrink-0">
              <nav className="bg-white rounded-lg shadow p-4 sticky top-20">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Tools
                </h3>
                <ul className="space-y-1">
                  {tools.map((tool) => {
                    const Icon = tool.icon
                    const isActive = pathname === tool.href
                    return (
                      <li key={tool.href}>
                        <Link
                          href={tool.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                            isActive
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {tool.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Engineering Tools by{" "}
            <Link href="/" className="text-blue-600 hover:underline">
              Dawar Azhar
            </Link>
            {" "}| Power Electronics & Thermal Design
          </p>
        </div>
      </footer>
    </div>
  )
}
