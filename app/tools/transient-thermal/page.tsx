"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Activity, Info, Play, AlertTriangle, CheckCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { calculateFosterTransient } from "@/lib/thermal-calculations"

// Example Zth curves (R-tau pairs) for common packages
const zthPresets = [
  {
    name: "Custom",
    rcPairs: [
      { r: 0.2, tau: 0.001 },
      { r: 0.3, tau: 0.01 },
      { r: 0.5, tau: 0.1 },
      { r: 0.5, tau: 1 },
    ]
  },
  {
    name: "TO-247 (typical MOSFET)",
    rcPairs: [
      { r: 0.05, tau: 0.0005 },
      { r: 0.15, tau: 0.005 },
      { r: 0.25, tau: 0.05 },
      { r: 0.35, tau: 0.3 },
    ]
  },
  {
    name: "TO-220 (typical)",
    rcPairs: [
      { r: 0.1, tau: 0.001 },
      { r: 0.3, tau: 0.01 },
      { r: 0.5, tau: 0.1 },
      { r: 0.6, tau: 0.5 },
    ]
  },
  {
    name: "D2PAK (SMD)",
    rcPairs: [
      { r: 0.15, tau: 0.001 },
      { r: 0.35, tau: 0.008 },
      { r: 0.4, tau: 0.06 },
      { r: 0.5, tau: 0.4 },
    ]
  },
  {
    name: "IGBT Module (typical)",
    rcPairs: [
      { r: 0.01, tau: 0.002 },
      { r: 0.02, tau: 0.02 },
      { r: 0.03, tau: 0.1 },
      { r: 0.04, tau: 0.5 },
    ]
  },
]

export default function TransientThermalPage() {
  // Inputs
  const [pulsePower, setPulsePower] = useState(100)
  const [pulseDuration, setPulseDuration] = useState(10) // ms
  const [dutyCycle, setDutyCycle] = useState(50) // %
  const [tAmbient, setTAmbient] = useState(40)
  const [tJunctionMax, setTJunctionMax] = useState(150)
  const [selectedPreset, setSelectedPreset] = useState(1)
  const [rThSA, setRThSA] = useState(1.0) // Heatsink thermal resistance

  // Custom RC pairs (only used when preset 0 is selected)
  const [customPairs, setCustomPairs] = useState(zthPresets[0].rcPairs)

  // Get effective RC pairs
  const rcPairs = selectedPreset === 0 ? customPairs : zthPresets[selectedPreset].rcPairs
  const totalRthJC = rcPairs.reduce((sum, p) => sum + p.r, 0)

  // Generate time-temperature data
  const results = useMemo(() => {
    const periodMs = pulseDuration / (dutyCycle / 100)
    const offTime = periodMs - pulseDuration
    const numCycles = 5
    const pointsPerCycle = 100
    const totalTime = periodMs * numCycles

    const data: { time: number; temp: number; power: number }[] = []
    let baseTemp = tAmbient

    // For each time point
    for (let i = 0; i <= pointsPerCycle * numCycles; i++) {
      const time = (i / (pointsPerCycle * numCycles)) * totalTime
      const cycleTime = time % periodMs
      const isPulseOn = cycleTime < pulseDuration

      // Calculate temperature using superposition
      // This is simplified - real transient requires convolution
      let temp: number

      if (isPulseOn) {
        // During pulse: temperature rises
        const timeInPulse = cycleTime
        const zthJC = calculateZth(rcPairs, timeInPulse / 1000) // Convert to seconds
        temp = baseTemp + pulsePower * (zthJC + rThSA * (1 - Math.exp(-timeInPulse / (1000 * rThSA * 10))))
      } else {
        // During off: temperature falls
        const timeInOff = cycleTime - pulseDuration
        const peakTemp = baseTemp + pulsePower * (calculateZth(rcPairs, pulseDuration / 1000) + rThSA * 0.5)
        const tau = rcPairs[rcPairs.length - 1].tau
        temp = baseTemp + (peakTemp - baseTemp) * Math.exp(-timeInOff / (1000 * tau))
      }

      // Add steady-state heating from average power
      const avgPower = pulsePower * (dutyCycle / 100)
      const steadyStateRise = avgPower * (totalRthJC + rThSA)
      temp = Math.min(temp, tAmbient + steadyStateRise + (isPulseOn ? pulsePower * calculateZth(rcPairs, pulseDuration / 1000) : 0))

      data.push({
        time: Math.round(time * 10) / 10,
        temp: Math.round(temp * 10) / 10,
        power: isPulseOn ? pulsePower : 0
      })
    }

    // Find peak and average temperatures
    const peakTemp = Math.max(...data.map(d => d.temp))
    const avgTemp = data.reduce((sum, d) => sum + d.temp, 0) / data.length
    const avgPower = pulsePower * (dutyCycle / 100)
    const steadyStateTemp = tAmbient + avgPower * (totalRthJC + rThSA)

    return {
      data,
      peakTemp,
      avgTemp,
      avgPower,
      steadyStateTemp,
      periodMs,
      totalTime
    }
  }, [pulsePower, pulseDuration, dutyCycle, tAmbient, rcPairs, rThSA, totalRthJC])

  // Calculate Zth from RC pairs
  function calculateZth(pairs: { r: number; tau: number }[], time: number): number {
    return pairs.reduce((sum, p) => sum + p.r * (1 - Math.exp(-time / p.tau)), 0)
  }

  const margin = tJunctionMax - results.peakTemp
  const isOverTemp = margin < 0
  const isWarning = margin >= 0 && margin < 20

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Transient Thermal Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze junction temperature during pulsed operation using thermal impedance (Z<sub>th</sub>)
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inputs Panel */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <h2 className="font-semibold text-lg">Pulse Parameters</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Pulse Power (W)</label>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={pulsePower}
              onChange={(e) => setPulsePower(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm font-medium">{pulsePower} W</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pulse Duration (ms)</label>
            <input
              type="range"
              min="0.1"
              max="100"
              step="0.1"
              value={pulseDuration}
              onChange={(e) => setPulseDuration(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm font-medium">{pulseDuration} ms</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Duty Cycle (%)</label>
            <input
              type="range"
              min="5"
              max="95"
              value={dutyCycle}
              onChange={(e) => setDutyCycle(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center text-sm font-medium">{dutyCycle}%</div>
          </div>

          <hr />

          <h3 className="font-medium">Thermal Parameters</h3>

          <div>
            <label className="block text-sm font-medium mb-2">Device Package (Z<sub>th</sub> curve)</label>
            <select
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {zthPresets.map((preset, i) => (
                <option key={i} value={i}>{preset.name}</option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">RC Network (Foster Model)</div>
            <div className="space-y-1 text-xs font-mono">
              {rcPairs.map((p, i) => (
                <div key={i} className="flex justify-between">
                  <span>R{i+1} = {p.r} °C/W</span>
                  <span>τ{i+1} = {p.tau}s</span>
                </div>
              ))}
              <div className="pt-1 border-t font-medium">
                R<sub>θJC</sub> = {totalRthJC.toFixed(2)} °C/W
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">R<sub>θSA</sub> (Heatsink) °C/W</label>
            <input
              type="number"
              step="0.1"
              value={rThSA}
              onChange={(e) => setRThSA(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ambient Temperature (°C)</label>
            <input
              type="number"
              value={tAmbient}
              onChange={(e) => setTAmbient(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Junction Temp (°C)</label>
            <input
              type="number"
              value={tJunctionMax}
              onChange={(e) => setTJunctionMax(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <motion.div
            className={`rounded-xl shadow-sm border p-4 flex items-center gap-3 ${
              isOverTemp
                ? "bg-red-50 border-red-200"
                : isWarning
                ? "bg-amber-50 border-amber-200"
                : "bg-green-50 border-green-200"
            }`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            {isOverTemp ? (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            ) : isWarning ? (
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-600" />
            )}
            <div>
              <div className={`font-medium ${isOverTemp ? "text-red-700" : isWarning ? "text-amber-700" : "text-green-700"}`}>
                {isOverTemp
                  ? `Over temperature! Peak exceeds limit by ${Math.abs(margin).toFixed(1)}°C`
                  : isWarning
                  ? `Warning: Only ${margin.toFixed(1)}°C margin`
                  : `Safe operation: ${margin.toFixed(1)}°C margin`}
              </div>
              <div className="text-sm text-muted-foreground">
                Peak: {results.peakTemp.toFixed(1)}°C | Limit: {tJunctionMax}°C
              </div>
            </div>
          </motion.div>

          {/* Temperature Chart */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-lg mb-4">
              <Activity className="h-5 w-5 inline mr-2" />
              Temperature Response
            </h2>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="time"
                    label={{ value: 'Time (ms)', position: 'bottom', offset: -5 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={[tAmbient - 10, Math.max(tJunctionMax + 10, results.peakTemp + 10)]}
                    label={{ value: 'T (°C)', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)}${name === 'temp' ? '°C' : 'W'}`,
                      name === 'temp' ? 'Junction Temp' : 'Power'
                    ]}
                    labelFormatter={(label) => `Time: ${label}ms`}
                  />
                  <ReferenceLine y={tJunctionMax} stroke="#ef4444" strokeDasharray="5 5" label="Tj(max)" />
                  <ReferenceLine y={results.steadyStateTemp} stroke="#3b82f6" strokeDasharray="3 3" label="Steady" />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    name="temp"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{results.peakTemp.toFixed(1)}°C</div>
              <div className="text-sm text-muted-foreground">Peak T<sub>J</sub></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{results.steadyStateTemp.toFixed(1)}°C</div>
              <div className="text-sm text-muted-foreground">Steady State</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{results.avgPower.toFixed(1)} W</div>
              <div className="text-sm text-muted-foreground">Avg Power</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{results.periodMs.toFixed(1)} ms</div>
              <div className="text-sm text-muted-foreground">Period</div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Note:</strong> This is a simplified Foster model analysis.
                For accurate results, use the actual Z<sub>th</sub> curve data from your device datasheet.
                The model assumes single-pulse thermal impedance applies to periodic pulses (valid for t<sub>pulse</sub> {'<'} τ<sub>1</sub>).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
