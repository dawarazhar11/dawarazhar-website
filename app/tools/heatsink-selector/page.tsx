"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Fan, CheckCircle, XCircle, AlertTriangle, Info, ExternalLink } from "lucide-react"
import { calculateRequiredRthSA } from "@/lib/thermal-calculations"

// Heatsink database
const heatsinkDatabase = [
  // Natural convection heatsinks
  { model: "Fischer SK 104 25.4", rthSA: 6.5, dimensions: "25×25×25mm", type: "natural", price: "$", url: "" },
  { model: "Fischer SK 104 50.8", rthSA: 3.8, dimensions: "50×25×25mm", type: "natural", price: "$", url: "" },
  { model: "Fischer SK 129 50.8", rthSA: 2.5, dimensions: "50×50×25mm", type: "natural", price: "$$", url: "" },
  { model: "Fischer SK 89 75", rthSA: 1.6, dimensions: "75×75×30mm", type: "natural", price: "$$", url: "" },
  { model: "Aavid 507302B00000G", rthSA: 1.8, dimensions: "75×75×25mm", type: "natural", price: "$$", url: "" },
  { model: "Aavid 576802B00000G", rthSA: 1.2, dimensions: "100×100×30mm", type: "natural", price: "$$$", url: "" },
  { model: "Wakefield 517", rthSA: 2.1, dimensions: "63×63×25mm", type: "natural", price: "$$", url: "" },
  // Forced air heatsinks
  { model: "Fischer SK 576 (200LFM)", rthSA: 0.85, dimensions: "75×75×40mm", type: "forced", price: "$$", url: "" },
  { model: "Fischer SK 576 (400LFM)", rthSA: 0.55, dimensions: "75×75×40mm", type: "forced", price: "$$", url: "" },
  { model: "Aavid 423K (200LFM)", rthSA: 0.7, dimensions: "100×100×40mm", type: "forced", price: "$$$", url: "" },
  { model: "Aavid 423K (400LFM)", rthSA: 0.45, dimensions: "100×100×40mm", type: "forced", price: "$$$", url: "" },
  { model: "Intel Stock Cooler", rthSA: 0.35, dimensions: "70×70×50mm", type: "forced", price: "$", url: "" },
]

// Altitude derating factors
const altitudeDerating = [
  { altitude: 0, factor: 1.0 },
  { altitude: 1000, factor: 1.12 },
  { altitude: 2000, factor: 1.26 },
  { altitude: 3000, factor: 1.42 },
  { altitude: 4000, factor: 1.61 },
  { altitude: 5000, factor: 1.85 },
]

export default function HeatsinkSelectorPage() {
  // Inputs
  const [powerLoss, setPowerLoss] = useState(30)
  const [tJunctionMax, setTJunctionMax] = useState(150)
  const [tAmbient, setTAmbient] = useState(40)
  const [rThJC, setRThJC] = useState(0.5)
  const [rThCS, setRThCS] = useState(0.3)
  const [coolingType, setCoolingType] = useState<"natural" | "forced" | "all">("all")
  const [altitude, setAltitude] = useState(0)
  const [safetyMargin, setSafetyMargin] = useState(10) // °C

  // Calculate required R_θSA
  const results = useMemo(() => {
    // Get altitude derating factor
    const altEntry = altitudeDerating.find(a => a.altitude >= altitude) || altitudeDerating[altitudeDerating.length - 1]
    const deratingFactor = altEntry.factor

    // Calculate with safety margin
    const effectiveTjMax = tJunctionMax - safetyMargin
    const requiredRthSA = calculateRequiredRthSA(
      powerLoss,
      effectiveTjMax,
      tAmbient,
      rThJC,
      rThCS
    )

    // Apply altitude derating (need lower R_θSA at altitude)
    const requiredRthSADerated = requiredRthSA / deratingFactor

    // Filter and sort heatsinks
    const filteredHeatsinks = heatsinkDatabase
      .filter(hs => coolingType === "all" || hs.type === coolingType)
      .map(hs => ({
        ...hs,
        effectiveRthSA: hs.rthSA * deratingFactor,
        meetsRequirement: hs.rthSA <= requiredRthSA,
        margin: ((requiredRthSA - hs.rthSA) / requiredRthSA) * 100
      }))
      .sort((a, b) => {
        // Sort by meets requirement first, then by R_θSA
        if (a.meetsRequirement && !b.meetsRequirement) return -1
        if (!a.meetsRequirement && b.meetsRequirement) return 1
        return a.rthSA - b.rthSA
      })

    return {
      requiredRthSA,
      requiredRthSADerated,
      thermalBudget: effectiveTjMax - tAmbient,
      totalRthAllowed: (effectiveTjMax - tAmbient) / powerLoss,
      deratingFactor,
      heatsinks: filteredHeatsinks
    }
  }, [powerLoss, tJunctionMax, tAmbient, rThJC, rThCS, coolingType, altitude, safetyMargin])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Heatsink Selector</h1>
        <p className="text-muted-foreground">
          Calculate required thermal resistance and find suitable heatsinks
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inputs Panel */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <h2 className="font-semibold text-lg">Requirements</h2>

          <div>
            <label className="block text-sm font-medium mb-2">Power Dissipation (W)</label>
            <input
              type="number"
              value={powerLoss}
              onChange={(e) => setPowerLoss(Number(e.target.value))}
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
            <label className="block text-sm font-medium mb-2">R<sub>θJC</sub> (°C/W)</label>
            <input
              type="number"
              step="0.1"
              value={rThJC}
              onChange={(e) => setRThJC(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">R<sub>θCS</sub> - TIM (°C/W)</label>
            <input
              type="number"
              step="0.1"
              value={rThCS}
              onChange={(e) => setRThCS(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Safety Margin (°C)</label>
            <input
              type="range"
              min="0"
              max="30"
              value={safetyMargin}
              onChange={(e) => setSafetyMargin(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground text-center">{safetyMargin}°C below T<sub>J(max)</sub></div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cooling Type</label>
            <select
              value={coolingType}
              onChange={(e) => setCoolingType(e.target.value as typeof coolingType)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="all">All Types</option>
              <option value="natural">Natural Convection</option>
              <option value="forced">Forced Air</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Altitude (m)</label>
            <select
              value={altitude}
              onChange={(e) => setAltitude(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value={0}>Sea Level (0m)</option>
              <option value={1000}>1,000m</option>
              <option value={2000}>2,000m</option>
              <option value={3000}>3,000m</option>
              <option value={4000}>4,000m</option>
              <option value={5000}>5,000m</option>
            </select>
            {altitude > 0 && (
              <div className="text-xs text-amber-600 mt-1">
                Derating factor: ×{results.deratingFactor.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Required R_θSA */}
          <motion.div
            className={`rounded-xl shadow-sm border p-6 ${
              results.requiredRthSA < 0 ? "bg-red-50 border-red-200" : "bg-white"
            }`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="font-semibold text-lg mb-4">Thermal Budget Analysis</h2>

            {results.requiredRthSA < 0 ? (
              <div className="flex items-center gap-3 text-red-700">
                <AlertTriangle className="h-6 w-6" />
                <div>
                  <div className="font-medium">Impossible thermal requirement!</div>
                  <div className="text-sm">R<sub>θJC</sub> + R<sub>θCS</sub> exceeds total allowed R<sub>θJA</sub></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Thermal Budget</div>
                  <div className="text-2xl font-bold text-blue-600">{results.thermalBudget}°C</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Total R<sub>θJA</sub> Max</div>
                  <div className="text-2xl font-bold text-green-600">{results.totalRthAllowed.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">°C/W</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Required R<sub>θSA</sub></div>
                  <div className="text-2xl font-bold text-amber-600">{results.requiredRthSA.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">°C/W</div>
                </div>
                {altitude > 0 && (
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Derated R<sub>θSA</sub></div>
                    <div className="text-2xl font-bold text-purple-600">{results.requiredRthSADerated.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">°C/W (at {altitude}m)</div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Heatsink Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-lg mb-4">
              <Fan className="h-5 w-5 inline mr-2" />
              Heatsink Options
            </h2>

            {results.requiredRthSA < 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Fix thermal requirements first
              </div>
            ) : (
              <div className="space-y-3">
                {results.heatsinks.map((hs, i) => (
                  <motion.div
                    key={hs.model}
                    className={`p-4 rounded-lg border ${
                      hs.meetsRequirement
                        ? "bg-green-50 border-green-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {hs.meetsRequirement ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-slate-400" />
                        )}
                        <div>
                          <div className="font-medium">{hs.model}</div>
                          <div className="text-sm text-muted-foreground">
                            {hs.dimensions} | {hs.type === "natural" ? "Natural" : "Forced Air"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${hs.meetsRequirement ? "text-green-600" : "text-slate-500"}`}>
                          {hs.rthSA} °C/W
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {hs.meetsRequirement
                            ? `${Math.abs(hs.margin).toFixed(0)}% margin`
                            : `Need ${Math.abs(hs.margin).toFixed(0)}% lower`}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <strong>Note:</strong> R<sub>θSA</sub> values depend on orientation, airflow, and mounting.
                Verify with manufacturer data. Forced air values shown are for ~200-400 LFM (1-2 m/s).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
