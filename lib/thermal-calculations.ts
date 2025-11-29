// Thermal Calculation Functions for Power Electronics

/**
 * Calculate junction temperature from thermal stack
 */
export function calculateJunctionTemperature(
  powerLoss: number,      // W
  rThJC: number,          // °C/W - Junction to Case
  rThCS: number,          // °C/W - Case to Sink (TIM)
  rThSA: number,          // °C/W - Sink to Ambient
  tAmbient: number        // °C
): {
  tJunction: number;
  tCase: number;
  tSink: number;
  totalRth: number;
} {
  const totalRth = rThJC + rThCS + rThSA;
  const deltaT = powerLoss * totalRth;

  const tSink = tAmbient + powerLoss * rThSA;
  const tCase = tSink + powerLoss * rThCS;
  const tJunction = tCase + powerLoss * rThJC;

  return {
    tJunction,
    tCase,
    tSink,
    totalRth
  };
}

/**
 * Calculate required heatsink thermal resistance
 */
export function calculateRequiredRthSA(
  powerLoss: number,      // W
  tJunctionMax: number,   // °C
  tAmbient: number,       // °C
  rThJC: number,          // °C/W
  rThCS: number           // °C/W
): number {
  const thermalBudget = tJunctionMax - tAmbient;
  const rThTotal = thermalBudget / powerLoss;
  const rThSA = rThTotal - rThJC - rThCS;
  return Math.max(0, rThSA);
}

/**
 * MOSFET Conduction Loss
 */
export function calculateMosfetConductionLoss(
  iRms: number,           // A - RMS current
  rDsOn: number,          // Ω - On resistance
  tempCoeff: number = 1.5 // Temperature coefficient (typically 1.5 at 100°C vs 25°C)
): number {
  return iRms * iRms * rDsOn * tempCoeff;
}

/**
 * MOSFET Switching Loss (simplified)
 */
export function calculateMosfetSwitchingLoss(
  vDs: number,            // V - Drain-source voltage
  iD: number,             // A - Drain current
  tOn: number,            // s - Turn-on time
  tOff: number,           // s - Turn-off time
  fSw: number             // Hz - Switching frequency
): number {
  return 0.5 * vDs * iD * (tOn + tOff) * fSw;
}

/**
 * MOSFET Gate Drive Loss
 */
export function calculateGateDriveLoss(
  qG: number,             // C - Gate charge
  vGs: number,            // V - Gate-source voltage
  fSw: number             // Hz - Switching frequency
): number {
  return qG * vGs * fSw;
}

/**
 * IGBT Conduction Loss
 */
export function calculateIgbtConductionLoss(
  iAvg: number,           // A - Average current
  vCeSat: number,         // V - Collector-emitter saturation voltage
  iRms: number,           // A - RMS current
  rCe: number = 0         // Ω - On-state resistance (slope)
): number {
  return vCeSat * iAvg + rCe * iRms * iRms;
}

/**
 * IGBT Switching Loss using energy values
 */
export function calculateIgbtSwitchingLossEnergy(
  eOn: number,            // J - Turn-on energy
  eOff: number,           // J - Turn-off energy
  fSw: number,            // Hz - Switching frequency
  vActual: number,        // V - Actual voltage
  vRef: number,           // V - Reference voltage (datasheet)
  iActual: number,        // A - Actual current
  iRef: number            // A - Reference current (datasheet)
): number {
  const scaleFactor = (vActual / vRef) * (iActual / iRef);
  return (eOn + eOff) * fSw * scaleFactor;
}

/**
 * PCB Trace Width Calculator (IPC-2152)
 */
export function calculatePcbTraceWidth(
  current: number,        // A
  tempRise: number,       // °C
  copperThickness: number,// mm (1oz = 0.035mm)
  isExternal: boolean     // true for external, false for internal
): {
  width: number;          // mm
  area: number;           // mm²
} {
  // IPC-2152 constants
  const k = isExternal ? 0.048 : 0.024;
  const b = 0.44;
  const c = 0.725;

  // Calculate cross-sectional area in mils²
  const areaMils = Math.pow(current / (k * Math.pow(tempRise, b)), 1/c);

  // Convert to mm²
  const areaMm = areaMils * 0.0006452; // mils² to mm²

  // Calculate width
  const width = areaMm / copperThickness;

  return {
    width: Math.max(0.1, width), // Minimum 0.1mm
    area: areaMm
  };
}

/**
 * Trace Resistance Calculator
 */
export function calculateTraceResistance(
  length: number,         // mm
  width: number,          // mm
  copperThickness: number,// mm
  temperature: number = 25// °C
): number {
  // Copper resistivity at 20°C: 1.68e-8 Ω·m
  const rho20 = 1.68e-8;
  const tempCoeff = 0.00393; // per °C

  // Adjust for temperature
  const rho = rho20 * (1 + tempCoeff * (temperature - 20));

  // Convert to mm
  const rhoMm = rho * 1e6; // Ω·mm

  // R = ρ * L / A
  const area = width * copperThickness;
  return (rhoMm * length) / area;
}

/**
 * Forced Air Cooling CFM Calculator
 */
export function calculateRequiredCFM(
  heatLoad: number,       // W
  tempRise: number,       // °C (outlet - inlet)
  altitude: number = 0    // m
): number {
  // Air properties at sea level
  const rho0 = 1.225; // kg/m³
  const cp = 1006;    // J/(kg·K)

  // Altitude derating (approximate)
  const rho = rho0 * Math.exp(-altitude / 8500);

  // Q = m_dot * cp * ΔT
  // CFM = Q / (ρ * cp * ΔT) * conversion
  const m3PerSec = heatLoad / (rho * cp * tempRise);
  const cfm = m3PerSec * 2118.88; // m³/s to CFM

  return cfm;
}

/**
 * Natural Convection Heat Dissipation (simplified)
 */
export function calculateNaturalConvection(
  surfaceArea: number,    // m²
  tempDiff: number,       // °C (surface - ambient)
  orientation: 'horizontal' | 'vertical' = 'vertical'
): number {
  // Simplified convection coefficient
  const h = orientation === 'vertical'
    ? 1.42 * Math.pow(tempDiff / 1, 0.25) // W/(m²·K) for vertical plate
    : 1.32 * Math.pow(tempDiff / 1, 0.25); // for horizontal

  return h * surfaceArea * tempDiff;
}

/**
 * Transient Thermal Impedance (1st order RC)
 */
export function calculateTransientTemp(
  power: number,          // W
  rTh: number,            // °C/W
  cTh: number,            // J/°C (thermal capacitance)
  time: number,           // s
  tInitial: number        // °C
): number {
  const tau = rTh * cTh;
  const tSteadyState = tInitial + power * rTh;
  return tSteadyState - (tSteadyState - tInitial) * Math.exp(-time / tau);
}

/**
 * Foster Network Transient Response
 */
export function calculateFosterTransient(
  power: number,          // W
  rcPairs: { r: number; tau: number }[], // R-tau pairs
  time: number,           // s
  tAmbient: number        // °C
): number {
  let zTh = 0;
  for (const pair of rcPairs) {
    zTh += pair.r * (1 - Math.exp(-time / pair.tau));
  }
  return tAmbient + power * zTh;
}
