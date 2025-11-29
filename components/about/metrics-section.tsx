"use client"

import { motion } from "framer-motion"
import CountUp from "react-countup"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"

const experienceData = [
  { name: "Mechanical Design", years: 7 },
  { name: "CAD/SolidWorks", years: 7 },
  { name: "Manufacturing", years: 6 },
  { name: "Thermal Management", years: 5 },
  { name: "3D Printing/Prototyping", years: 5 }
]

const skillsData = [
  { name: "SolidWorks/CAD", value: 95 },
  { name: "ANSYS/Simulation", value: 90 },
  { name: "Manufacturing/DFM", value: 92 },
  { name: "Thermal Design", value: 85 },
  { name: "Product Development", value: 88 }
]

const projectsData = [
  { category: "Power Electronics", count: 25, color: "#0891b2" },
  { category: "Mechanical Design", count: 35, color: "#7c3aed" },
  { category: "Manufacturing", count: 20, color: "#dc2626" },
  { category: "Innovation/IP", count: 8, color: "#059669" }
]

const COLORS = ["#0891b2", "#7c3aed", "#dc2626", "#059669"]

const careerProgression = [
  { year: 2019, level: 1 },
  { year: 2020, level: 2 },
  { year: 2021, level: 3 },
  { year: 2022, level: 4 },
  { year: 2023, level: 5 },
  { year: 2024, level: 6 },
  { year: 2025, level: 7 }
]

const fundingMilestones = [
  { round: "Series A", amount: 20, year: "2023", cumulative: 20 },
  { round: "Follow-on", amount: 60, year: "2024", cumulative: 80 }
]

export function MetricsSection() {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  <CountUp end={7} duration={2.5} />+
                </div>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  $<CountUp end={80} duration={2.5} />M
                </div>
                <p className="text-sm text-muted-foreground">Total Funding Secured</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  <CountUp end={10} duration={2.5} />x
                </div>
                <p className="text-sm text-muted-foreground">Size Reduction</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  <CountUp end={60} duration={2.5} />%
                </div>
                <p className="text-sm text-muted-foreground">Assembly Time Cut</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Achievement Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  <CountUp end={35} duration={2.5} />%
                </div>
                <p className="text-sm text-muted-foreground">Cost Reduction</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-rose-600">
                  <CountUp end={90} duration={2.5} />%
                </div>
                <p className="text-sm text-muted-foreground">Yield Rate</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">
                  <CountUp end={10} duration={2.5} />X
                </div>
                <p className="text-sm text-muted-foreground">AI Assisted Design Cycle</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600">
                  <CountUp end={1000} duration={2.5} />+
                </div>
                <p className="text-sm text-muted-foreground">Components Sync</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Experience by Domain */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Experience by Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={experienceData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100}
                    fontSize={12}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="years" fill="#0891b2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Project Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {projectsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-4">
                {projectsData.map((entry, index) => (
                  <div key={entry.category} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm">{entry.category}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Skills Proficiency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Technical Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsData.map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{skill.name}</span>
                      <span>{skill.value}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.value}%` }}
                        transition={{ duration: 1.5, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Career Progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Career Progression</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={careerProgression}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="level"
                    stroke="#0891b2"
                    strokeWidth={3}
                    dot={{ fill: "#0891b2", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Funding Milestones Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Funding Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line - only covers the milestone items */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full" style={{ height: 'calc(100% - 120px)', top: 0 }} />

              <div className="space-y-8 relative">
                {fundingMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.round}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.2 }}
                    className={`flex items-center gap-4 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <Card className="inline-block">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">
                            $<CountUp end={milestone.amount} duration={2} delay={1 + index * 0.2} />M
                          </div>
                          <div className="text-sm font-semibold">{milestone.round}</div>
                          <div className="text-xs text-muted-foreground">{milestone.year}</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Timeline dot */}
                    <div className="relative z-10 w-4 h-4 bg-green-500 rounded-full border-4 border-background shadow-lg" />

                    <div className={`flex-1 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                      <div className="text-sm text-muted-foreground">
                        Cumulative: <span className="font-semibold text-foreground">${milestone.cumulative}M</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total funding highlight - outside the timeline */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="flex justify-center mt-8"
              >
                <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl font-bold text-green-600">
                      $<CountUp end={80} duration={2.5} delay={1.5} />M
                    </div>
                    <div className="text-sm font-semibold">Total Funding Raised</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Validating breakthrough technology & market potential
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}