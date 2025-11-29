"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { CircuitBoard, Info, AlertTriangle, CheckCircle } from "lucide-react"
import { calculatePcbTraceWidth, calculateTraceResistance } from "@/lib/thermal-calculations"

// Copper weights and their thicknesses
const copperWeights = [
  { name: "0.5 oz (17.5 µm)", oz: 0.5, thickness: 0.0175 },
  { name: "1 oz (35 µm)", oz: 1, thickness: 0.035 },
  { name: "2 oz (70 µm)", oz: 2, thickness: 0.070 },
  { name: "3 oz (105 µm)", oz: 3, thickness: 0.105 },
  { name: "4 oz (140 µm)", oz: 4, thickness: 0.140 },
]

export default function PcbTracePage() {
  // Inputs
  const [current, setCurrent] = useState(10)
  const [tempRise, setTempRise] = useState(20)
  const [copperWeight, setCopperWeight] = useState(1)
  const [isExternal, setIsExternal] = useState(true)
  const [traceLength, setTraceLength] = useState(50)
  const [ambientTemp, setAmbientTemp] = useState(25)

  // Get copper thickness
  const copper = copperWeights.find(c => c.oz === copperWeight) || copperWeights[1]

  // Calculate results
  const results = useMemo(() => {
    const trace = calculatePcbTraceWidth(current, tempRise, copper.thickness, isExternal)
    const resistance = calculateTraceResistance(traceLength, trace.width, copper.thickness, ambientTemp + tempRise)
    const voltageDrop = current * resistance
    const powerDissipation = current * current * resistance * 1000 // mW

    return {
      widthMm: trace.width,
      widthMils: trace.width * 39.37,
      areaMm2: trace.area,
      resistance: resistance * 1000, // mΩ
      voltageDrop: voltageDrop * 1000, // mV
      powerDissipation,
      finalTemp: ambientTemp + tempRise
    }
  }, [current, tempRise, copper.thickness, isExternal, traceLength, ambientTemp])

  // Status
  const widthWarning = results.widthMm < 0.15 // Less than 6 mils
  const widthOk = results.widthMm >= 0.25
  const standardWidths = [0.2, 0.25, 0.3, 0.4, 0.5, 0.8, 1.0, 1.5, 2.0]
  const recommendedWidth = standardWidths.find(w => w >= results.widthMm) || results.widthMm

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">PCB Trace Width Calculator</h1>
        <p className="text-muted-foreground">
          Calculate minimum trace width for your current using IPC-2152 standards
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs Panel */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <h2 className="font-semibold text-lg">Parameters</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Current (A)</label>
            <input
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={current}
              onChange={(e) => setCurrent(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>0.5A</span>
              <span className="font-medium text-slate-900">{current} A</span>
              <span>50A</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Temperature Rise (°C)</label>
            <input
              type="range"
              min="5"
              max="60"
              value={tempRise}
              onChange={(e) => setTempRise(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>5°C</span>
              <span className="font-medium text-slate-900">{tempRise}°C</span>
              <span>60°C</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Copper Weight</label>
            <select
              value={copperWeight}
              onChange={(e) => setCopperWeight(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {copperWeights.map((c) => (
                <option key={c.oz} value={c.oz}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Layer Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsExternal(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isExternal
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                External
              </button>
              <button
                onClick={() => setIsExternal(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  !isExternal
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Internal
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Internal layers require wider traces due to reduced heat dissipation
            </p>
          </div>

          <hr />

          <h3 className="font-medium">Optional: Resistance Calculation</h3>

          <div>
            <label className="block text-sm font-medium mb-2">Trace Length (mm)</label>
            <input
              type="number"
              value={traceLength}
              onChange={(e) => setTraceLength(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ambient Temperature (°C)</label>
            <input
              type="number"
              value={ambientTemp}
              onChange={(e) => setAmbientTemp(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Main Result */}
          <motion.div
            className={`rounded-xl shadow-sm border p-6 ${
              widthWarning ? "bg-amber-50" : "bg-white"
            }`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="font-semibold text-lg mb-4">Minimum Trace Width</h2>

            <div className="flex items-center gap-4 mb-4">
              {widthWarning ? (
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-500" />
              )}
              <div>
                <div className="text-4xl font-bold text-slate-900">
                  {results.widthMm.toFixed(2)} mm
                </div>
                <div className="text-lg text-muted-foreground">
                  ({results.widthMils.toFixed(1)} mils)
                </div>
              </div>
            </div>

            {widthWarning && (
              <div className="p-3 bg-amber-100 rounded-lg text-amber-800 text-sm mb-4">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Trace width is very narrow. Consider using higher copper weight or accepting more temperature rise.
              </div>
            )}

            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm font-medium mb-2">Recommended Standard Width</div>
              <div className="text-2xl font-bold text-blue-600">{recommendedWidth.toFixed(2)} mm</div>
              <div className="text-xs text-muted-foreground">Next standard size above minimum</div>
            </div>
          </motion.div>

          {/* Visual Trace */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-lg mb-4">Visual Preview</h2>
            <div className="bg-green-900 p-6 rounded-lg relative">
              {/* PCB background */}
              <div className="text-center">
                <div className="text-green-400 text-xs mb-2">PCB ({isExternal ? "External" : "Internal"} Layer)</div>
                {/* Trace */}
                <motion.div
                  className="mx-auto bg-amber-400 rounded"
                  style={{
                    width: `${Math.min(100, Math.max(10, results.widthMm * 50))}%`,
                    height: `${Math.max(8, copper.thickness * 200)}px`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(10, results.widthMm * 50))}%` }}
                  transition={{ duration: 0.3 }}
                />
                <div className="text-amber-300 text-xs mt-2">
                  Copper: {copper.name}
                </div>
              </div>
              {/* Scale */}
              <div className="flex justify-between text-xs text-green-400 mt-4">
                <span>Width: {results.widthMm.toFixed(2)}mm</span>
                <span>Thickness: {copper.thickness * 1000}µm</span>
              </div>
            </div>
          </div>

          {/* Additional Results */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-lg mb-4">Electrical Properties</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-slate-900">{results.resistance.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Resistance (mΩ)</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-slate-900">{results.voltageDrop.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Voltage Drop (mV)</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-slate-900">{results.powerDissipation.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Power Loss (mW)</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-slate-900">{results.finalTemp}</div>
                <div className="text-sm text-muted-foreground">Final Temp (°C)</div>
              </div>
            </div>
          </div>

          {/* Formula Reference */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              IPC-2152 Formula
            </h3>
            <div className="font-mono text-sm bg-white p-3 rounded border">
              <div>Area = (I / (k × ΔT<sup>0.44</sup>))<sup>1/0.725</sup></div>
              <div className="mt-2 text-muted-foreground">
                k = {isExternal ? "0.048" : "0.024"} ({isExternal ? "external" : "internal"})
              </div>
            </div>
            <p className="text-xs text-blue-800 mt-3">
              IPC-2152 supersedes IPC-2221 with more accurate thermal modeling.
              Values are for DC or low-frequency AC current.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
