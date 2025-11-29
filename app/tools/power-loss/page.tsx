"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Info, Cpu, Zap } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import {
  calculateMosfetConductionLoss,
  calculateMosfetSwitchingLoss,
  calculateGateDriveLoss,
  calculateIgbtConductionLoss,
  calculateIgbtSwitchingLossEnergy
} from "@/lib/thermal-calculations"

// Device database
const mosfetDatabase = [
  { name: "Custom", rdsOn: 17, qg: 180, tOn: 50, tOff: 70 },
  { name: "IRFP460 (500V, 20A)", rdsOn: 270, qg: 210, tOn: 77, tOff: 99 },
  { name: "IPW60R017C7 (600V, 72A)", rdsOn: 17, qg: 180, tOn: 25, tOff: 35 },
  { name: "IPW65R019C7 (650V, 66A)", rdsOn: 19, qg: 170, tOn: 28, tOff: 38 },
  { name: "STW48N60M2 (600V, 36A)", rdsOn: 70, qg: 85, tOn: 45, tOff: 55 },
  { name: "IXFH50N30Q3 (300V, 50A)", rdsOn: 75, qg: 110, tOn: 35, tOff: 45 },
]

const igbtDatabase = [
  { name: "Custom", vceSat: 1.8, rCe: 10, eOn: 3.5, eOff: 2.0, vRef: 600, iRef: 40 },
  { name: "IKW40N120H3 (1200V, 40A)", vceSat: 1.65, rCe: 8, eOn: 3.5, eOff: 2.0, vRef: 600, iRef: 40 },
  { name: "FGH40N60SMD (600V, 40A)", vceSat: 1.5, rCe: 12, eOn: 1.8, eOff: 0.9, vRef: 400, iRef: 40 },
  { name: "IGW50N65H5 (650V, 50A)", vceSat: 1.55, rCe: 6, eOn: 2.2, eOff: 1.1, vRef: 400, iRef: 50 },
]

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6"]

export default function PowerLossPage() {
  const [deviceType, setDeviceType] = useState<"mosfet" | "igbt">("mosfet")
  const [selectedDevice, setSelectedDevice] = useState(0)

  // Common inputs
  const [vds, setVds] = useState(400)
  const [current, setCurrent] = useState(20)
  const [fsw, setFsw] = useState(50)
  const [dutyCycle, setDutyCycle] = useState(50)
  const [vgs, setVgs] = useState(12)
  const [tempCoeff, setTempCoeff] = useState(1.4)

  // Custom MOSFET inputs
  const [rdsOn, setRdsOn] = useState(17)
  const [qg, setQg] = useState(180)
  const [tOn, setTOn] = useState(50)
  const [tOff, setTOff] = useState(70)

  // Custom IGBT inputs
  const [vceSat, setVceSat] = useState(1.8)
  const [rCe, setRCe] = useState(10)
  const [eOn, setEOn] = useState(3.5)
  const [eOff, setEOff] = useState(2.0)

  // Get effective device parameters
  const getDeviceParams = () => {
    if (deviceType === "mosfet") {
      const device = mosfetDatabase[selectedDevice]
      if (selectedDevice === 0) {
        return { rdsOn, qg, tOn, tOff }
      }
      return device
    } else {
      const device = igbtDatabase[selectedDevice]
      if (selectedDevice === 0) {
        return { vceSat, rCe, eOn, eOff, vRef: 600, iRef: 40 }
      }
      return device
    }
  }

  // Calculate losses
  const results = useMemo(() => {
    const params = getDeviceParams()
    const fswHz = fsw * 1000
    const duty = dutyCycle / 100

    if (deviceType === "mosfet") {
      const { rdsOn: r, qg: q, tOn: ton, tOff: toff } = params as typeof mosfetDatabase[0]

      // RMS current for buck converter
      const iRms = current * Math.sqrt(duty)
      const iAvg = current * duty

      const pCond = calculateMosfetConductionLoss(iRms, r / 1000, tempCoeff)
      const pSw = calculateMosfetSwitchingLoss(vds, current, ton * 1e-9, toff * 1e-9, fswHz)
      const pGate = calculateGateDriveLoss(q * 1e-9, vgs, fswHz)
      const pTotal = pCond + pSw + pGate

      return {
        conduction: pCond,
        switching: pSw,
        gate: pGate,
        total: pTotal,
        iRms,
        iAvg
      }
    } else {
      const { vceSat: vce, rCe: r, eOn: eon, eOff: eoff, vRef, iRef } = params as typeof igbtDatabase[0]

      const iRms = current * Math.sqrt(duty)
      const iAvg = current * duty

      const pCond = calculateIgbtConductionLoss(iAvg, vce, iRms, r / 1000)
      const pSw = calculateIgbtSwitchingLossEnergy(eon * 1e-3, eoff * 1e-3, fswHz, vds, vRef, current, iRef)
      const pTotal = pCond + pSw

      return {
        conduction: pCond,
        switching: pSw,
        gate: 0,
        total: pTotal,
        iRms,
        iAvg
      }
    }
  }, [deviceType, selectedDevice, vds, current, fsw, dutyCycle, vgs, tempCoeff, rdsOn, qg, tOn, tOff, vceSat, rCe, eOn, eOff])

  const pieData = [
    { name: "Conduction", value: results.conduction },
    { name: "Switching", value: results.switching },
    ...(deviceType === "mosfet" ? [{ name: "Gate Drive", value: results.gate }] : [])
  ].filter(d => d.value > 0.01)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Power Loss Calculator</h1>
        <p className="text-muted-foreground">
          Calculate conduction and switching losses for MOSFETs and IGBTs
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Inputs Panel */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
          {/* Device Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => { setDeviceType("mosfet"); setSelectedDevice(0) }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                deviceType === "mosfet"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Cpu className="h-4 w-4 inline mr-2" />
              MOSFET
            </button>
            <button
              onClick={() => { setDeviceType("igbt"); setSelectedDevice(0) }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                deviceType === "igbt"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Zap className="h-4 w-4 inline mr-2" />
              IGBT
            </button>
          </div>

          {/* Device Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Device</label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {(deviceType === "mosfet" ? mosfetDatabase : igbtDatabase).map((device, i) => (
                <option key={i} value={i}>{device.name}</option>
              ))}
            </select>
          </div>

          {/* Custom Device Parameters */}
          {selectedDevice === 0 && (
            <div className="p-4 bg-slate-50 rounded-lg space-y-4">
              <h3 className="font-medium text-sm">Custom Device Parameters</h3>
              {deviceType === "mosfet" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">R<sub>DS(on)</sub> (mΩ)</label>
                    <input
                      type="number"
                      value={rdsOn}
                      onChange={(e) => setRdsOn(Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Q<sub>g</sub> (nC)</label>
                    <input
                      type="number"
                      value={qg}
                      onChange={(e) => setQg(Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">t<sub>on</sub> (ns)</label>
                    <input
                      type="number"
                      value={tOn}
                      onChange={(e) => setTOn(Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">t<sub>off</sub> (ns)</label>
                    <input
                      type="number"
                      value={tOff}
                      onChange={(e) => setTOff(Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">V<sub>CE(sat)</sub> (V)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={vceSat}
                      onChange={(e) => setVceSat(Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">r<sub>CE</sub> (mΩ)</label>
                    <input
                      type="number"
                      value={rCe}
                      onChange={(e) => setRCe(Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">E<sub>on</sub> (mJ)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={eOn}
                      onChange={(e) => setEOn(Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">E<sub>off</sub> (mJ)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={eOff}
                      onChange={(e) => setEOff(Number(e.target.value))}
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <hr />

          {/* Operating Conditions */}
          <h3 className="font-medium">Operating Conditions</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                V<sub>{deviceType === "mosfet" ? "DS" : "CE"}</sub> (V)
              </label>
              <input
                type="number"
                value={vds}
                onChange={(e) => setVds(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                I<sub>{deviceType === "mosfet" ? "D" : "C"}</sub> (A)
              </label>
              <input
                type="number"
                value={current}
                onChange={(e) => setCurrent(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Switching Frequency (kHz)
            </label>
            <input
              type="range"
              min="1"
              max="500"
              value={fsw}
              onChange={(e) => setFsw(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>1 kHz</span>
              <span className="font-medium text-slate-900">{fsw} kHz</span>
              <span>500 kHz</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Duty Cycle (%)
            </label>
            <input
              type="range"
              min="5"
              max="95"
              value={dutyCycle}
              onChange={(e) => setDutyCycle(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-1">
              <span>5%</span>
              <span className="font-medium text-slate-900">{dutyCycle}%</span>
              <span>95%</span>
            </div>
          </div>

          {deviceType === "mosfet" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  V<sub>GS</sub> (V)
                </label>
                <input
                  type="number"
                  value={vgs}
                  onChange={(e) => setVgs(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Temperature Coefficient (R<sub>DS(on)</sub> multiplier)
                </label>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.1"
                  value={tempCoeff}
                  onChange={(e) => setTempCoeff(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>1.0 (25°C)</span>
                  <span className="font-medium text-slate-900">×{tempCoeff.toFixed(1)}</span>
                  <span>2.0 (150°C)</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Total Power Loss */}
          <motion.div
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-blue-100 text-sm">Total Power Loss</div>
            <div className="text-4xl font-bold mt-1">{results.total.toFixed(2)} W</div>
            <div className="text-blue-200 text-sm mt-2">
              I<sub>RMS</sub> = {results.iRms.toFixed(2)} A | I<sub>avg</sub> = {results.iAvg.toFixed(2)} A
            </div>
          </motion.div>

          {/* Loss Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-lg mb-4">Loss Breakdown</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.conduction.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Conduction (W)</div>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{results.switching.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Switching (W)</div>
              </div>
              {deviceType === "mosfet" && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{results.gate.toFixed(3)}</div>
                  <div className="text-xs text-muted-foreground">Gate Drive (W)</div>
                </div>
              )}
            </div>

            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: { name: string; percent?: number }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(3)} W`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Formulas */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="font-semibold text-lg mb-4">Formulas Used</h2>
            <div className="space-y-3 text-sm">
              {deviceType === "mosfet" ? (
                <>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <strong>Conduction Loss:</strong>
                    <div className="font-mono mt-1">P<sub>cond</sub> = I<sub>RMS</sub>² × R<sub>DS(on)</sub> × k<sub>temp</sub></div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <strong>Switching Loss:</strong>
                    <div className="font-mono mt-1">P<sub>sw</sub> = ½ × V<sub>DS</sub> × I<sub>D</sub> × (t<sub>on</sub> + t<sub>off</sub>) × f<sub>sw</sub></div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <strong>Gate Drive Loss:</strong>
                    <div className="font-mono mt-1">P<sub>gate</sub> = Q<sub>g</sub> × V<sub>GS</sub> × f<sub>sw</sub></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <strong>Conduction Loss:</strong>
                    <div className="font-mono mt-1">P<sub>cond</sub> = V<sub>CE(sat)</sub> × I<sub>avg</sub> + r<sub>CE</sub> × I<sub>RMS</sub>²</div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <strong>Switching Loss:</strong>
                    <div className="font-mono mt-1">P<sub>sw</sub> = (E<sub>on</sub> + E<sub>off</sub>) × f<sub>sw</sub> × (V/V<sub>ref</sub>) × (I/I<sub>ref</sub>)</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
