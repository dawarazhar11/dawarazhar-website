"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Info, AlertTriangle, CheckCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { calculateJunctionTemperature } from "@/lib/thermal-calculations"

// TIM presets
const timPresets = [
  { name: "Thermal Grease (High)", conductivity: 8.5, thickness: 0.05, rth: 0.1 },
  { name: "Thermal Grease (Mid)", conductivity: 4.0, thickness: 0.05, rth: 0.2 },
  { name: "Thermal Pad (Thin)", conductivity: 3.0, thickness: 0.5, rth: 0.4 },
  { name: "Thermal Pad (Thick)", conductivity: 3.0, thickness: 1.0, rth: 0.8 },
  { name: "Phase Change", conductivity: 3.8, thickness: 0.127, rth: 0.15 },
  { name: "Custom", conductivity: 0, thickness: 0, rth: 0.3 },
]

export default function ThermalStackPage() {
  // Inputs
  const [powerLoss, setPowerLoss] = useState(50)
  const [tAmbient, setTAmbient] = useState(40)
  const [tJunctionMax, setTJunctionMax] = useState(150)
  const [rThJC, setRThJC] = useState(0.5)
  const [selectedTim, setSelectedTim] = useState(0)
  const [rThCS, setRThCS] = useState(0.2)
  const [rThSA, setRThSA] = useState(1.5)

  // Calculate results
  const results = useMemo(() => {
    const effectiveRThCS = selectedTim === 5 ? rThCS : timPresets[selectedTim].rth
    return calculateJunctionTemperature(
      powerLoss,
      rThJC,
      effectiveRThCS,
      rThSA,
      tAmbient
    )
  }, [powerLoss, rThJC, rThCS, rThSA, tAmbient, selectedTim])

  const margin = tJunctionMax - results.tJunction
  const isOverTemp = margin < 0
  const isWarning = margin >= 0 && margin < 20

  // Temperature to color
  const tempToColor = (temp: number, min: number, max: number) => {
    const ratio = Math.min(1, Math.max(0, (temp - min) / (max - min)))
    if (ratio < 0.5) {
      // Blue to Yellow
      const r = Math.round(ratio * 2 * 255)
      const g = Math.round(ratio * 2 * 200 + 55)
      const b = Math.round(255 - ratio * 2 * 255)
      return `rgb(${r}, ${g}, ${b})`
    } else {
      // Yellow to Red
      const r = 255
      const g = Math.round(255 - (ratio - 0.5) * 2 * 255)
      const b = 0
      return `rgb(${r}, ${g}, ${b})`
    }
  }

  const effectiveRThCS = selectedTim === 5 ? rThCS : timPresets[selectedTim].rth

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Thermal Stack Builder</h1>
        <p className="text-muted-foreground">
          Visualize heat flow from junction to ambient. Model your thermal resistance network.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs Panel */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
          <h2 className="font-semibold text-lg">Parameters</h2>

          {/* Power Loss */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Power Dissipation (W)
            </label>
            <input
              type="range"
              min="1"
              max="200"
              value={powerLoss}
              onChange={(e) => setPowerLoss(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>1W</span>
              <span className="font-medium text-slate-900">{powerLoss} W</span>
              <span>200W</span>
            </div>
          </div>

          {/* Ambient Temperature */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Ambient Temperature (°C)
            </label>
            <input
              type="range"
              min="0"
              max="85"
              value={tAmbient}
              onChange={(e) => setTAmbient(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>0°C</span>
              <span className="font-medium text-slate-900">{tAmbient}°C</span>
              <span>85°C</span>
            </div>
          </div>

          {/* Max Junction Temp */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Max Junction Temperature (°C)
            </label>
            <input
              type="range"
              min="100"
              max="200"
              value={tJunctionMax}
              onChange={(e) => setTJunctionMax(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>100°C</span>
              <span className="font-medium text-slate-900">{tJunctionMax}°C</span>
              <span>200°C</span>
            </div>
          </div>

          {/* R_θjc */}
          <div>
            <label className="block text-sm font-medium mb-2">
              R<sub>θJC</sub> - Junction to Case (°C/W)
              <span className="ml-2 text-xs text-muted-foreground">(from datasheet)</span>
            </label>
            <input
              type="number"
              min="0.01"
              max="10"
              step="0.01"
              value={rThJC}
              onChange={(e) => setRThJC(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* TIM Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Thermal Interface Material (TIM)
            </label>
            <select
              value={selectedTim}
              onChange={(e) => setSelectedTim(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {timPresets.map((tim, i) => (
                <option key={i} value={i}>
                  {tim.name} {tim.rth > 0 ? `(~${tim.rth} °C/W)` : ""}
                </option>
              ))}
            </select>
            {selectedTim === 5 && (
              <input
                type="number"
                min="0.01"
                max="5"
                step="0.01"
                value={rThCS}
                onChange={(e) => setRThCS(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg mt-2"
                placeholder="Custom R_θCS (°C/W)"
              />
            )}
          </div>

          {/* R_θsa */}
          <div>
            <label className="block text-sm font-medium mb-2">
              R<sub>θSA</sub> - Heatsink to Ambient (°C/W)
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={rThSA}
              onChange={(e) => setRThSA(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>0.1 (large heatsink)</span>
              <span className="font-medium text-slate-900">{rThSA.toFixed(1)} °C/W</span>
              <span>10 (small)</span>
            </div>
          </div>
        </div>

        {/* Visual Thermal Stack */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-lg mb-4">Thermal Stack</h2>

          {/* Status Banner */}
          <motion.div
            className={`rounded-lg p-3 mb-4 flex items-center gap-2 ${
              isOverTemp
                ? "bg-red-100 text-red-800"
                : isWarning
                ? "bg-amber-100 text-amber-800"
                : "bg-green-100 text-green-800"
            }`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            {isOverTemp ? (
              <AlertTriangle className="h-5 w-5" />
            ) : isWarning ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
            <span className="font-medium">
              {isOverTemp
                ? `Over temperature by ${Math.abs(margin).toFixed(1)}°C!`
                : isWarning
                ? `Low margin: ${margin.toFixed(1)}°C`
                : `Thermal margin: ${margin.toFixed(1)}°C`}
            </span>
          </motion.div>

          {/* Visual Stack */}
          <div className="relative">
            {/* Junction */}
            <motion.div
              className="rounded-t-lg p-4 text-white text-center relative overflow-hidden"
              style={{ backgroundColor: tempToColor(results.tJunction, tAmbient, tJunctionMax + 20) }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative z-10">
                <div className="text-sm opacity-80">Junction (T<sub>J</sub>)</div>
                <div className="text-3xl font-bold">{results.tJunction.toFixed(1)}°C</div>
              </div>
            </motion.div>

            {/* R_θJC */}
            <div className="bg-slate-200 p-2 text-center text-sm">
              <span className="text-slate-600">R<sub>θJC</sub> = {rThJC} °C/W</span>
              <span className="mx-2">|</span>
              <span className="text-slate-500">ΔT = {(powerLoss * rThJC).toFixed(1)}°C</span>
            </div>

            {/* Case */}
            <motion.div
              className="p-4 text-white text-center"
              style={{ backgroundColor: tempToColor(results.tCase, tAmbient, tJunctionMax + 20) }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-sm opacity-80">Case (T<sub>C</sub>)</div>
              <div className="text-2xl font-bold">{results.tCase.toFixed(1)}°C</div>
            </motion.div>

            {/* R_θCS (TIM) */}
            <div className="bg-slate-300 p-2 text-center text-sm">
              <span className="text-slate-700">TIM: {timPresets[selectedTim].name}</span>
              <span className="mx-2">|</span>
              <span className="text-slate-600">R<sub>θCS</sub> = {effectiveRThCS} °C/W</span>
            </div>

            {/* Heatsink */}
            <motion.div
              className="p-4 text-white text-center"
              style={{ backgroundColor: tempToColor(results.tSink, tAmbient, tJunctionMax + 20) }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-sm opacity-80">Heatsink (T<sub>S</sub>)</div>
              <div className="text-2xl font-bold">{results.tSink.toFixed(1)}°C</div>
            </motion.div>

            {/* R_θSA */}
            <div className="bg-slate-200 p-2 text-center text-sm">
              <span className="text-slate-600">R<sub>θSA</sub> = {rThSA} °C/W</span>
              <span className="mx-2">|</span>
              <span className="text-slate-500">ΔT = {(powerLoss * rThSA).toFixed(1)}°C</span>
            </div>

            {/* Ambient */}
            <motion.div
              className="rounded-b-lg p-4 text-center"
              style={{ backgroundColor: tempToColor(tAmbient, tAmbient, tJunctionMax + 20) }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-sm text-blue-800 opacity-80">Ambient (T<sub>A</sub>)</div>
              <div className="text-2xl font-bold text-blue-900">{tAmbient}°C</div>
            </motion.div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-2">Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Total R<sub>θJA</sub>:</div>
              <div className="font-medium">{results.totalRth.toFixed(2)} °C/W</div>
              <div>Total ΔT:</div>
              <div className="font-medium">{(results.tJunction - tAmbient).toFixed(1)}°C</div>
              <div>Power dissipated:</div>
              <div className="font-medium">{powerLoss} W</div>
              <div>Max safe power:</div>
              <div className="font-medium">{((tJunctionMax - tAmbient) / results.totalRth).toFixed(1)} W</div>
            </div>
          </div>

          {/* Formula */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Formula:</strong> T<sub>J</sub> = T<sub>A</sub> + P × (R<sub>θJC</sub> + R<sub>θCS</sub> + R<sub>θSA</sub>)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
