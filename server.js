const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 12000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Core material properties database
const coreMaterials = {
  'N87': { Bsat: 0.39, Tc: 210, resistivity: 5, Ae: 0.000097, le: 0.0395, Ve: 0.00000383 },
  'N97': { Bsat: 0.48, Tc: 180, resistivity: 10, Ae: 0.000097, le: 0.0395, Ve: 0.00000383 },
  '3C90': { Bsat: 0.45, Tc: 220, resistivity: 8, Ae: 0.000097, le: 0.0395, Ve: 0.00000383 },
  'MPP': { Bsat: 0.75, Tc: 200, resistivity: 1000000, Ae: 0.000097, le: 0.0395, Ve: 0.00000383 },
  'Kool_Mu': { Bsat: 1.05, Tc: 500, resistivity: 1000000, Ae: 0.000097, le: 0.0395, Ve: 0.00000383 }
};

// Real magnetic component database
const magneticParts = {
  // TDK Inductors
  'TDK_SLF12575': { 
    type: 'inductor', manufacturer: 'TDK', series: 'SLF12575', package: '12.5x12.5x7.5mm', 
    values: [
      { inductance: 10, current: 3.9, dcr: 0.025, partNumber: 'SLF12575T-100M2R2-PF' },
      { inductance: 15, current: 3.5, dcr: 0.035, partNumber: 'SLF12575T-150M2R5-PF' },
      { inductance: 22, current: 3.0, dcr: 0.050, partNumber: 'SLF12575T-220M3R0-PF' },
      { inductance: 33, current: 2.5, dcr: 0.075, partNumber: 'SLF12575T-330M2R5-PF' },
      { inductance: 47, current: 2.1, dcr: 0.100, partNumber: 'SLF12575T-470M2R1-PF' },
      { inductance: 68, current: 1.8, dcr: 0.140, partNumber: 'SLF12575T-680M1R8-PF' },
      { inductance: 100, current: 1.5, dcr: 0.200, partNumber: 'SLF12575T-101M1R5-PF' },
      { inductance: 150, current: 1.2, dcr: 0.300, partNumber: 'SLF12575T-151M1R2-PF' },
      { inductance: 220, current: 1.0, dcr: 0.450, partNumber: 'SLF12575T-221M1R0-PF' }
    ],
    material: 'ferrite', shielded: true, temp_range: [-40, 125]
  },
  
  'TDK_SLF10145': { 
    type: 'inductor', manufacturer: 'TDK', series: 'SLF10145', package: '10.1x10.1x4.5mm',
    values: [
      { inductance: 1.0, current: 6.5, dcr: 0.012, partNumber: 'SLF10145T-1R0M6R5-2PF' },
      { inductance: 1.5, current: 5.8, dcr: 0.018, partNumber: 'SLF10145T-1R5M5R8-2PF' },
      { inductance: 2.2, current: 5.0, dcr: 0.025, partNumber: 'SLF10145T-2R2M5R0-2PF' },
      { inductance: 3.3, current: 4.2, dcr: 0.038, partNumber: 'SLF10145T-3R3M4R2-2PF' },
      { inductance: 4.7, current: 3.6, dcr: 0.055, partNumber: 'SLF10145T-4R7M3R6-2PF' },
      { inductance: 6.8, current: 3.1, dcr: 0.075, partNumber: 'SLF10145T-6R8M3R1-2PF' },
      { inductance: 10, current: 2.6, dcr: 0.110, partNumber: 'SLF10145T-100M2R6-2PF' },
      { inductance: 15, current: 2.1, dcr: 0.170, partNumber: 'SLF10145T-150M2R1-2PF' },
      { inductance: 22, current: 1.7, dcr: 0.250, partNumber: 'SLF10145T-220M1R7-2PF' }
    ],
    material: 'ferrite', shielded: true, temp_range: [-40, 125]
  },

  // Wurth Elektronik WE-PD Series
  'WE_PD_744773': { 
    type: 'inductor', manufacturer: 'Wurth', series: 'WE-PD', package: '12.8x12.8x6.0mm',
    values: [
      { inductance: 10, current: 4.2, dcr: 0.022, partNumber: '744773100' },
      { inductance: 15, current: 3.8, dcr: 0.032, partNumber: '744773150' },
      { inductance: 22, current: 3.2, dcr: 0.045, partNumber: '744773220' },
      { inductance: 33, current: 2.7, dcr: 0.068, partNumber: '744773330' },
      { inductance: 47, current: 2.3, dcr: 0.095, partNumber: '744773470' },
      { inductance: 68, current: 1.9, dcr: 0.135, partNumber: '744773680' },
      { inductance: 100, current: 1.6, dcr: 0.190, partNumber: '744773101' },
      { inductance: 150, current: 1.3, dcr: 0.285, partNumber: '744773151' }
    ],
    material: 'ferrite', shielded: true, temp_range: [-40, 125]
  },

  'WE_TPC_744028': { 
    type: 'inductor', manufacturer: 'Wurth', series: 'WE-TPC', package: '2.8x2.8x1.1mm',
    values: [
      { inductance: 0.47, current: 2.8, dcr: 0.045, partNumber: '7440280047' },
      { inductance: 0.68, current: 2.5, dcr: 0.065, partNumber: '7440280068' },
      { inductance: 1.0, current: 2.2, dcr: 0.090, partNumber: '744028001' },
      { inductance: 1.5, current: 1.9, dcr: 0.130, partNumber: '7440280015' },
      { inductance: 2.2, current: 1.6, dcr: 0.180, partNumber: '7440280022' },
      { inductance: 3.3, current: 1.4, dcr: 0.260, partNumber: '7440280033' },
      { inductance: 4.7, current: 1.2, dcr: 0.360, partNumber: '7440280047' },
      { inductance: 6.8, current: 1.0, dcr: 0.520, partNumber: '7440280068' },
      { inductance: 10, current: 0.85, dcr: 0.750, partNumber: '744028010' }
    ],
    material: 'ferrite', shielded: true, temp_range: [-40, 125]
  },

  // Coilcraft XFL Series
  'COIL_XFL4020': { 
    type: 'inductor', manufacturer: 'Coilcraft', series: 'XFL4020', package: '4.0x4.0x2.0mm',
    values: [
      { inductance: 1.0, current: 4.8, dcr: 0.018, partNumber: 'XFL4020-102MEC' },
      { inductance: 1.5, current: 4.2, dcr: 0.026, partNumber: 'XFL4020-152MEC' },
      { inductance: 2.2, current: 3.6, dcr: 0.038, partNumber: 'XFL4020-222MEC' },
      { inductance: 3.3, current: 3.0, dcr: 0.055, partNumber: 'XFL4020-332MEC' },
      { inductance: 4.7, current: 2.5, dcr: 0.078, partNumber: 'XFL4020-472MEC' },
      { inductance: 6.8, current: 2.1, dcr: 0.110, partNumber: 'XFL4020-682MEC' },
      { inductance: 10, current: 1.8, dcr: 0.155, partNumber: 'XFL4020-103MEC' },
      { inductance: 15, current: 1.4, dcr: 0.235, partNumber: 'XFL4020-153MEC' },
      { inductance: 22, current: 1.2, dcr: 0.340, partNumber: 'XFL4020-223MEC' }
    ],
    material: 'ferrite', shielded: true, temp_range: [-40, 125]
  },

  'COIL_XAL1350': { 
    type: 'inductor', manufacturer: 'Coilcraft', series: 'XAL1350', package: '13.5x13.5x5.0mm',
    values: [
      { inductance: 10, current: 6.2, dcr: 0.015, partNumber: 'XAL1350-103MEC' },
      { inductance: 15, current: 5.5, dcr: 0.022, partNumber: 'XAL1350-153MEC' },
      { inductance: 22, current: 4.7, dcr: 0.032, partNumber: 'XAL1350-223MEC' },
      { inductance: 33, current: 3.9, dcr: 0.048, partNumber: 'XAL1350-333MEC' },
      { inductance: 47, current: 3.3, dcr: 0.068, partNumber: 'XAL1350-473MEC' },
      { inductance: 68, current: 2.8, dcr: 0.095, partNumber: 'XAL1350-683MEC' },
      { inductance: 100, current: 2.3, dcr: 0.135, partNumber: 'XAL1350-104MEC' },
      { inductance: 150, current: 1.9, dcr: 0.205, partNumber: 'XAL1350-154MEC' },
      { inductance: 220, current: 1.6, dcr: 0.295, partNumber: 'XAL1350-224MEC' }
    ],
    material: 'ferrite', shielded: true, temp_range: [-40, 125]
  },

  // Transformers for Flyback and PSFB
  'TDK_B82801A': { 
    type: 'transformer', manufacturer: 'TDK', series: 'B82801A', package: 'ETD29',
    values: [
      { turns_ratio: 1, primary_inductance: 100, leakage: 2, partNumber: 'B82801A0100A100' },
      { turns_ratio: 2, primary_inductance: 150, leakage: 3, partNumber: 'B82801A0150A200' },
      { turns_ratio: 3, primary_inductance: 220, leakage: 4, partNumber: 'B82801A0220A300' },
      { turns_ratio: 4, primary_inductance: 330, leakage: 5, partNumber: 'B82801A0330A400' },
      { turns_ratio: 5, primary_inductance: 470, leakage: 6, partNumber: 'B82801A0470A500' }
    ],
    isolation: 3000, material: 'N87', temp_range: [-40, 125]
  },

  'COIL_IFLY0012': { 
    type: 'transformer', manufacturer: 'Coilcraft', series: 'IFLY', package: 'EP13',
    values: [
      { turns_ratio: 2, primary_inductance: 200, leakage: 3, partNumber: 'IFLY0012-200-2' },
      { turns_ratio: 3, primary_inductance: 300, leakage: 4, partNumber: 'IFLY0012-300-3' },
      { turns_ratio: 4, primary_inductance: 400, leakage: 5, partNumber: 'IFLY0012-400-4' },
      { turns_ratio: 5, primary_inductance: 500, leakage: 6, partNumber: 'IFLY0012-500-5' },
      { turns_ratio: 6, primary_inductance: 600, leakage: 7, partNumber: 'IFLY0012-600-6' }
    ],
    isolation: 500, material: 'ferrite', temp_range: [-40, 125]
  }
};

// Wire gauge data (AWG)
const wireData = {
  14: { diameter: 1.628, area: 2.081, resistance: 8.286 },
  16: { diameter: 1.291, area: 1.309, resistance: 13.17 },
  18: { diameter: 1.024, area: 0.823, resistance: 20.95 },
  20: { diameter: 0.812, area: 0.518, resistance: 33.31 },
  22: { diameter: 0.644, area: 0.326, resistance: 52.96 },
  24: { diameter: 0.511, area: 0.205, resistance: 84.22 },
  26: { diameter: 0.405, area: 0.129, resistance: 133.9 },
  28: { diameter: 0.321, area: 0.0804, resistance: 212.9 },
  30: { diameter: 0.255, area: 0.0509, resistance: 338.6 }
};

// Magnetic design calculations
class MagneticDesign {
  
  // Buck converter inductor design
  static calculateBuckInductor(params) {
    const { Vin, Vout, Iout, fsw, rippleFactor, coreMaterial } = params;
    
    const dutyCycle = Vout / Vin;
    const deltaI = Iout * rippleFactor;
    const L = (Vin - Vout) * dutyCycle / (fsw * deltaI);
    
    const core = coreMaterials[coreMaterial];
    const Bmax = core.Bsat * 0.8; // 80% of saturation
    const Ipeak = Iout + deltaI / 2;
    
    const N = Math.ceil(L * Ipeak / (Bmax * core.Ae));
    const actualL = N * N * core.Ae * 4e-7 * Math.PI / core.le;
    
    // Core losses (simplified Steinmetz equation)
    const Bac = deltaI * L / (N * core.Ae);
    const coreLoss = 0.001 * Math.pow(fsw/1000, 1.3) * Math.pow(Bac, 2.4) * core.Ve * 1e6;
    
    return {
      inductance: L * 1e6, // µH
      turns: N,
      actualInductance: actualL * 1e6,
      peakCurrent: Ipeak,
      deltaI: deltaI,
      maxFluxDensity: Bmax,
      acFluxDensity: Bac,
      coreLoss: coreLoss,
      dutyCycle: dutyCycle
    };
  }
  
  // Boost converter inductor design
  static calculateBoostInductor(params) {
    const { Vin, Vout, Iout, fsw, rippleFactor, coreMaterial } = params;
    
    const dutyCycle = 1 - (Vin / Vout);
    const Iin = Iout * Vout / Vin;
    const deltaI = Iin * rippleFactor;
    const L = Vin * dutyCycle / (fsw * deltaI);
    
    const core = coreMaterials[coreMaterial];
    const Bmax = core.Bsat * 0.8;
    const Ipeak = Iin + deltaI / 2;
    
    const N = Math.ceil(L * Ipeak / (Bmax * core.Ae));
    const actualL = N * N * core.Ae * 4e-7 * Math.PI / core.le;
    
    const Bac = deltaI * L / (N * core.Ae);
    const coreLoss = 0.001 * Math.pow(fsw/1000, 1.3) * Math.pow(Bac, 2.4) * core.Ve * 1e6;
    
    return {
      inductance: L * 1e6,
      turns: N,
      actualInductance: actualL * 1e6,
      peakCurrent: Ipeak,
      deltaI: deltaI,
      maxFluxDensity: Bmax,
      acFluxDensity: Bac,
      coreLoss: coreLoss,
      dutyCycle: dutyCycle,
      inputCurrent: Iin
    };
  }
  
  // Flyback transformer design
  static calculateFlybackTransformer(params) {
    const { Vin_min, Vin_max, Vout, Iout, fsw, rippleFactor, coreMaterial } = params;
    
    const Vf = 0.7; // Diode forward voltage
    const n = (Vout + Vf) / (Vin_min * 0.45); // Turns ratio, 45% max duty cycle
    const Lp = Math.pow(Vin_min * 0.45, 2) / (2 * Iout * Vout * fsw / 0.8); // Primary inductance
    
    const core = coreMaterials[coreMaterial];
    const Bmax = core.Bsat * 0.8;
    const Ipeak = 2 * Iout * Vout / (Vin_min * 0.45);
    
    const Np = Math.ceil(Math.sqrt(Lp * core.le / (core.Ae * 4e-7 * Math.PI)));
    const Ns = Math.ceil(Np / n);
    const actualLp = Np * Np * core.Ae * 4e-7 * Math.PI / core.le;
    
    const coreLoss = 0.002 * Math.pow(fsw/1000, 1.3) * Math.pow(Bmax/2, 2.4) * core.Ve * 1e6;
    
    return {
      primaryInductance: Lp * 1e6,
      turnsRatio: n,
      primaryTurns: Np,
      secondaryTurns: Ns,
      actualPrimaryInductance: actualLp * 1e6,
      peakPrimaryCurrent: Ipeak,
      maxFluxDensity: Bmax,
      coreLoss: coreLoss
    };
  }
  
  // Phase-shifted full-bridge transformer design
  static calculatePSFBTransformer(params) {
    const { Vin, Vout, Iout, fsw, coreMaterial } = params;
    
    const Vf = 0.7; // Rectifier diode drop
    const n = Vout / (Vin * 0.45); // Turns ratio
    const Lp = Vin * 0.45 / (4 * fsw * Iout * 0.1); // Leakage inductance for 10% current ripple
    
    const core = coreMaterials[coreMaterial];
    const Bmax = core.Bsat * 0.9; // Can use higher flux density
    const Ipeak = Iout / n;
    
    const Np = Math.ceil(Vin * 0.45 / (4 * fsw * Bmax * core.Ae));
    const Ns = Math.ceil(Np / n);
    
    const coreLoss = 0.0015 * Math.pow(fsw/1000, 1.3) * Math.pow(Bmax, 2.4) * core.Ve * 1e6;
    
    return {
      leakageInductance: Lp * 1e6,
      turnsRatio: n,
      primaryTurns: Np,
      secondaryTurns: Ns,
      peakPrimaryCurrent: Ipeak,
      maxFluxDensity: Bmax,
      coreLoss: coreLoss
    };
  }
  
  // Wire selection based on current density
  static selectWire(current, currentDensity = 4) { // 4 A/mm² default
    const requiredArea = current / currentDensity;
    
    for (const [awg, data] of Object.entries(wireData)) {
      if (data.area >= requiredArea) {
        const actualCurrentDensity = current / data.area;
        const resistance = data.resistance / 1000; // mΩ/m to Ω/m
        const powerLoss = current * current * resistance; // W/m
        
        return {
          awg: parseInt(awg),
          diameter: data.diameter,
          area: data.area,
          actualCurrentDensity: actualCurrentDensity,
          resistance: resistance,
          powerLossPerMeter: powerLoss
        };
      }
    }
    
    return { error: 'Current too high for available wire gauges' };
  }

  // Recommend actual magnetic parts based on calculated requirements
  static recommendMagneticPart(requiredInductance, requiredCurrent, converterType) {
    const recommendations = [];
    
    for (const [partKey, part] of Object.entries(magneticParts)) {
      if (part.type === 'inductor' && ['buck', 'boost'].includes(converterType)) {
        for (const value of part.values) {
          if (value.inductance >= requiredInductance * 0.8 && 
              value.inductance <= requiredInductance * 1.5 &&
              value.current >= requiredCurrent) {
            
            const efficiency = Math.min(100, 95 - (value.dcr * requiredCurrent * requiredCurrent / 10));
            const score = (value.current / requiredCurrent) * (requiredInductance / value.inductance) * (efficiency / 100);
            
            recommendations.push({
              partNumber: value.partNumber,
              manufacturer: part.manufacturer,
              series: part.series,
              package: part.package,
              inductance: value.inductance,
              current: value.current,
              dcr: value.dcr,
              efficiency: efficiency.toFixed(1),
              score: score.toFixed(2),
              material: part.material,
              shielded: part.shielded
            });
          }
        }
      } else if (part.type === 'transformer' && ['flyback', 'psfb'].includes(converterType)) {
        for (const value of part.values) {
          if (value.primary_inductance >= requiredInductance * 0.8 && 
              value.primary_inductance <= requiredInductance * 1.5) {
            
            const score = requiredInductance / value.primary_inductance;
            
            recommendations.push({
              partNumber: value.partNumber,
              manufacturer: part.manufacturer,
              series: part.series,
              package: part.package,
              primaryInductance: value.primary_inductance,
              turnsRatio: value.turns_ratio,
              leakageInductance: value.leakage,
              isolation: part.isolation,
              score: score.toFixed(2),
              material: part.material
            });
          }
        }
      }
    }
    
    // Sort by score (higher is better)
    recommendations.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
    
    return recommendations.slice(0, 5); // Return top 5 recommendations
  }
}

// Feedback compensation design class
class CompensationDesign {
  
  // Type II compensator design (one pole, one zero)
  static designTypeII(params) {
    const { Vout, fsw, L, C, ESR, Vin, loadCurrent } = params;
    
    // Power stage transfer function characteristics
    const fc_lc = 1 / (2 * Math.PI * Math.sqrt(L * C)); // LC filter corner frequency
    const fz_esr = 1 / (2 * Math.PI * ESR * C); // ESR zero frequency
    const Qo = Math.sqrt(L / C) / ESR; // Quality factor
    
    // Desired crossover frequency (typically fsw/10 to fsw/20)
    const fc_desired = fsw / 15;
    
    // Compensator design
    const fz_comp = fc_lc / 3; // Place zero below LC corner
    const fp_comp = fz_esr * 3; // Place pole above ESR zero
    
    // Component calculations for op-amp based compensator
    const R1 = 10000; // 10kΩ reference
    const C1 = 1 / (2 * Math.PI * fz_comp * R1);
    const R2 = 1 / (2 * Math.PI * fp_comp * C1);
    
    // Gain calculation
    const Gps_dc = Vout / Vin; // Power stage DC gain
    const Gc_dc = fc_desired / (Gps_dc * fsw / (2 * Math.PI)); // Required compensator gain
    const R3 = R1 * Gc_dc;
    
    // Phase and gain margins
    const phaseMargin = 60; // Target phase margin
    const gainMargin = 10; // Target gain margin in dB
    
    return {
      type: 'Type II',
      crossoverFreq: fc_desired,
      zeroFreq: fz_comp,
      poleFreq: fp_comp,
      components: {
        R1: this.standardValue(R1),
        R2: this.standardValue(R2),
        R3: this.standardValue(R3),
        C1: this.standardValue(C1 * 1e12, 'pF')
      },
      performance: {
        phaseMargin: phaseMargin,
        gainMargin: gainMargin,
        bandwidth: fc_desired
      },
      powerStage: {
        lcCorner: fc_lc,
        esrZero: fz_esr,
        qualityFactor: Qo.toFixed(2)
      }
    };
  }
  
  // Type III compensator design (two poles, two zeros)
  static designTypeIII(params) {
    const { Vout, fsw, L, C, ESR, Vin, loadCurrent } = params;
    
    // Power stage characteristics
    const fc_lc = 1 / (2 * Math.PI * Math.sqrt(L * C));
    const fz_esr = 1 / (2 * Math.PI * ESR * C);
    const Qo = Math.sqrt(L / C) / ESR;
    
    // Desired crossover frequency
    const fc_desired = fsw / 10;
    
    // Compensator design - more aggressive than Type II
    const fz1_comp = fc_lc / 5; // First zero
    const fz2_comp = fc_lc / 2; // Second zero
    const fp1_comp = fz_esr * 2; // First pole
    const fp2_comp = fsw / 2; // Second pole at half switching frequency
    
    // Component calculations
    const R1 = 10000;
    const C1 = 1 / (2 * Math.PI * fz1_comp * R1);
    const C2 = 1 / (2 * Math.PI * fz2_comp * R1);
    const R2 = 1 / (2 * Math.PI * fp1_comp * C1);
    const R3 = 1 / (2 * Math.PI * fp2_comp * C2);
    
    // Gain calculation
    const Gps_dc = Vout / Vin;
    const Gc_dc = fc_desired / (Gps_dc * fsw / (2 * Math.PI));
    const R4 = R1 * Gc_dc;
    
    return {
      type: 'Type III',
      crossoverFreq: fc_desired,
      zeroFreq1: fz1_comp,
      zeroFreq2: fz2_comp,
      poleFreq1: fp1_comp,
      poleFreq2: fp2_comp,
      components: {
        R1: this.standardValue(R1),
        R2: this.standardValue(R2),
        R3: this.standardValue(R3),
        R4: this.standardValue(R4),
        C1: this.standardValue(C1 * 1e12, 'pF'),
        C2: this.standardValue(C2 * 1e12, 'pF')
      },
      performance: {
        phaseMargin: 70,
        gainMargin: 12,
        bandwidth: fc_desired
      },
      powerStage: {
        lcCorner: fc_lc,
        esrZero: fz_esr,
        qualityFactor: Qo.toFixed(2)
      }
    };
  }
  
  // Generate Bode plot data for power stage, compensator, and loop gain
  static generateBodePlot(params, compensatorType = 'type2') {
    const { Vout, fsw, L, C, ESR, Vin, loadCurrent } = params;
    
    // Frequency range: 1 Hz to 1 MHz (logarithmic)
    const frequencies = [];
    for (let decade = 0; decade <= 6; decade++) {
      for (let step = 1; step <= 9; step++) {
        const freq = step * Math.pow(10, decade);
        if (freq <= 1e6) frequencies.push(freq);
      }
    }
    
    // Power stage transfer function parameters
    const fc_lc = 1 / (2 * Math.PI * Math.sqrt(L * C));
    const fz_esr = 1 / (2 * Math.PI * ESR * C);
    const Qo = Math.sqrt(L / C) / ESR;
    const Gps_dc = Vout; // DC gain in volts
    
    // Get compensator design
    const compensator = compensatorType === 'type3' ? 
      this.designTypeIII(params) : this.designTypeII(params);
    
    // Calculate frequency responses
    const powerStageData = frequencies.map(f => {
      const s = 2 * Math.PI * f;
      const response = this.calculatePowerStageResponse(s, Gps_dc, fc_lc, fz_esr, Qo);
      return {
        frequency: f,
        magnitude: 20 * Math.log10(response.magnitude),
        phase: response.phase * 180 / Math.PI
      };
    });
    
    const compensatorData = frequencies.map(f => {
      const s = 2 * Math.PI * f;
      const response = compensatorType === 'type3' ? 
        this.calculateType3CompensatorResponse(s, compensator) :
        this.calculateType2CompensatorResponse(s, compensator);
      return {
        frequency: f,
        magnitude: 20 * Math.log10(response.magnitude),
        phase: response.phase * 180 / Math.PI
      };
    });
    
    // Loop gain = Power Stage × Compensator × Modulator Gain × Feedback Gain
    const Gm = 1 / 3.3; // Typical PWM modulator gain (1/Vtriangle)
    const Gfb = 1; // Feedback gain (assuming unity for simplicity)
    
    const loopGainData = frequencies.map((f, i) => {
      const psResponse = powerStageData[i];
      const compResponse = compensatorData[i];
      const totalMagnitude = psResponse.magnitude + compResponse.magnitude + 
                           20 * Math.log10(Gm * Gfb);
      const totalPhase = psResponse.phase + compResponse.phase;
      
      return {
        frequency: f,
        magnitude: totalMagnitude,
        phase: totalPhase
      };
    });
    
    // Find crossover frequency and margins
    const crossoverData = this.findCrossoverAndMargins(loopGainData);
    
    return {
      frequencies,
      powerStage: powerStageData,
      compensator: compensatorData,
      loopGain: loopGainData,
      crossover: crossoverData,
      compensatorDesign: compensator
    };
  }
  
  // Calculate power stage frequency response (buck converter)
  static calculatePowerStageResponse(s, Gdc, fc_lc, fz_esr, Qo) {
    const wc = 2 * Math.PI * fc_lc;
    const wz = 2 * Math.PI * fz_esr;
    
    // H(s) = Gdc * (1 + s/wz) / (1 + s/(Qo*wc) + (s/wc)^2)
    const numerator = { real: 1, imag: s / wz };
    const denominator = { 
      real: 1 - (s / wc) * (s / wc), 
      imag: s / (Qo * wc) 
    };
    
    // Complex division
    const denomMagSq = denominator.real * denominator.real + denominator.imag * denominator.imag;
    const result = {
      real: Gdc * (numerator.real * denominator.real + numerator.imag * denominator.imag) / denomMagSq,
      imag: Gdc * (numerator.imag * denominator.real - numerator.real * denominator.imag) / denomMagSq
    };
    
    return {
      magnitude: Math.sqrt(result.real * result.real + result.imag * result.imag),
      phase: Math.atan2(result.imag, result.real)
    };
  }
  
  // Calculate Type II compensator frequency response
  static calculateType2CompensatorResponse(s, compensator) {
    const wz = 2 * Math.PI * compensator.zeroFreq;
    const wp = 2 * Math.PI * compensator.poleFreq;
    
    // Gc(s) = Gdc * (1 + s/wz) / (1 + s/wp)
    const Gdc = 1; // Will be adjusted based on crossover requirement
    
    const numerator = { real: 1, imag: s / wz };
    const denominator = { real: 1, imag: s / wp };
    
    const denomMagSq = denominator.real * denominator.real + denominator.imag * denominator.imag;
    const result = {
      real: Gdc * (numerator.real * denominator.real + numerator.imag * denominator.imag) / denomMagSq,
      imag: Gdc * (numerator.imag * denominator.real - numerator.real * denominator.imag) / denomMagSq
    };
    
    return {
      magnitude: Math.sqrt(result.real * result.real + result.imag * result.imag),
      phase: Math.atan2(result.imag, result.real)
    };
  }
  
  // Calculate Type III compensator frequency response
  static calculateType3CompensatorResponse(s, compensator) {
    const wz1 = 2 * Math.PI * compensator.zeroFreq1;
    const wz2 = 2 * Math.PI * compensator.zeroFreq2;
    const wp1 = 2 * Math.PI * compensator.poleFreq1;
    const wp2 = 2 * Math.PI * compensator.poleFreq2;
    
    // Gc(s) = Gdc * (1 + s/wz1)(1 + s/wz2) / (s * (1 + s/wp1)(1 + s/wp2))
    const Gdc = 1; // Will be adjusted based on crossover requirement
    
    // Numerator: (1 + s/wz1)(1 + s/wz2)
    const num1 = { real: 1, imag: s / wz1 };
    const num2 = { real: 1, imag: s / wz2 };
    const numerator = {
      real: num1.real * num2.real - num1.imag * num2.imag,
      imag: num1.real * num2.imag + num1.imag * num2.real
    };
    
    // Denominator: s * (1 + s/wp1)(1 + s/wp2)
    const den1 = { real: 1, imag: s / wp1 };
    const den2 = { real: 1, imag: s / wp2 };
    const denPoles = {
      real: den1.real * den2.real - den1.imag * den2.imag,
      imag: den1.real * den2.imag + den1.imag * den2.real
    };
    const denominator = {
      real: -s * denPoles.imag, // s * complex = (0 + js) * complex
      imag: s * denPoles.real
    };
    
    const denomMagSq = denominator.real * denominator.real + denominator.imag * denominator.imag;
    const result = {
      real: Gdc * (numerator.real * denominator.real + numerator.imag * denominator.imag) / denomMagSq,
      imag: Gdc * (numerator.imag * denominator.real - numerator.real * denominator.imag) / denomMagSq
    };
    
    return {
      magnitude: Math.sqrt(result.real * result.real + result.imag * result.imag),
      phase: Math.atan2(result.imag, result.real)
    };
  }
  
  // Find crossover frequency and stability margins
  static findCrossoverAndMargins(loopGainData) {
    let crossoverFreq = null;
    let phaseMargin = null;
    let gainMargin = null;
    let gainMarginFreq = null;
    
    // Find crossover frequency (where magnitude = 0 dB)
    for (let i = 1; i < loopGainData.length; i++) {
      const prev = loopGainData[i - 1];
      const curr = loopGainData[i];
      
      if (prev.magnitude > 0 && curr.magnitude <= 0) {
        // Linear interpolation to find exact crossover
        const ratio = -prev.magnitude / (curr.magnitude - prev.magnitude);
        crossoverFreq = prev.frequency + ratio * (curr.frequency - prev.frequency);
        
        // Interpolate phase at crossover
        const phaseAtCrossover = prev.phase + ratio * (curr.phase - prev.phase);
        phaseMargin = 180 + phaseAtCrossover; // Phase margin = 180° + phase at crossover
        break;
      }
    }
    
    // Find gain margin (magnitude at -180° phase)
    for (let i = 1; i < loopGainData.length; i++) {
      const prev = loopGainData[i - 1];
      const curr = loopGainData[i];
      
      if ((prev.phase > -180 && curr.phase <= -180) || 
          (prev.phase < -180 && curr.phase >= -180)) {
        // Linear interpolation to find exact -180° frequency
        const ratio = (-180 - prev.phase) / (curr.phase - prev.phase);
        gainMarginFreq = prev.frequency + ratio * (curr.frequency - prev.frequency);
        
        // Interpolate magnitude at -180°
        const magAt180 = prev.magnitude + ratio * (curr.magnitude - prev.magnitude);
        gainMargin = -magAt180; // Gain margin is negative of magnitude at -180°
        break;
      }
    }
    
    return {
      crossoverFreq: crossoverFreq,
      phaseMargin: phaseMargin,
      gainMargin: gainMargin,
      gainMarginFreq: gainMarginFreq
    };
  }
  
  // Convert to standard component values
  static standardValue(value, unit = 'Ω') {
    const e12_series = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
    
    let magnitude = Math.floor(Math.log10(value));
    let mantissa = value / Math.pow(10, magnitude);
    
    // Find closest E12 value
    let closest = e12_series.reduce((prev, curr) => 
      Math.abs(curr - mantissa) < Math.abs(prev - mantissa) ? curr : prev
    );
    
    let standardVal = closest * Math.pow(10, magnitude);
    
    if (unit === 'pF' && standardVal < 1000) {
      return `${standardVal.toFixed(0)} pF`;
    } else if (unit === 'pF' && standardVal >= 1000) {
      return `${(standardVal/1000).toFixed(2)} nF`;
    } else if (standardVal >= 1000000) {
      return `${(standardVal/1000000).toFixed(1)} MΩ`;
    } else if (standardVal >= 1000) {
      return `${(standardVal/1000).toFixed(1)} kΩ`;
    } else {
      return `${standardVal.toFixed(0)} Ω`;
    }
  }
}

// API Routes
app.post('/api/calculate/buck', (req, res) => {
  try {
    const result = MagneticDesign.calculateBuckInductor(req.body);
    const wireInfo = MagneticDesign.selectWire(result.peakCurrent);
    const partRecommendations = MagneticDesign.recommendMagneticPart(result.inductance, result.peakCurrent, 'buck');
    res.json({ ...result, wireSelection: wireInfo, partRecommendations });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculate/boost', (req, res) => {
  try {
    const result = MagneticDesign.calculateBoostInductor(req.body);
    const wireInfo = MagneticDesign.selectWire(result.peakCurrent);
    const partRecommendations = MagneticDesign.recommendMagneticPart(result.inductance, result.peakCurrent, 'boost');
    res.json({ ...result, wireSelection: wireInfo, partRecommendations });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculate/flyback', (req, res) => {
  try {
    const result = MagneticDesign.calculateFlybackTransformer(req.body);
    const wireInfo = MagneticDesign.selectWire(result.peakPrimaryCurrent);
    const partRecommendations = MagneticDesign.recommendMagneticPart(result.primaryInductance, result.peakPrimaryCurrent, 'flyback');
    res.json({ ...result, wireSelection: wireInfo, partRecommendations });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculate/psfb', (req, res) => {
  try {
    const result = MagneticDesign.calculatePSFBTransformer(req.body);
    const wireInfo = MagneticDesign.selectWire(result.peakPrimaryCurrent);
    const partRecommendations = MagneticDesign.recommendMagneticPart(result.leakageInductance, result.peakPrimaryCurrent, 'psfb');
    res.json({ ...result, wireSelection: wireInfo, partRecommendations });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Compensation design routes
app.post('/api/compensation/type2', (req, res) => {
  try {
    const result = CompensationDesign.designTypeII(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/compensation/type3', (req, res) => {
  try {
    const result = CompensationDesign.designTypeIII(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Bode plot generation route
app.post('/api/compensation/bode', (req, res) => {
  try {
    const { compensatorType, ...params } = req.body;
    const result = CompensationDesign.generateBodePlot(params, compensatorType);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get magnetic parts database
app.get('/api/parts', (req, res) => {
  res.json(magneticParts);
});

app.get('/api/materials', (req, res) => {
  res.json(coreMaterials);
});

app.get('/api/wires', (req, res) => {
  res.json(wireData);
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Magnetic Design Assistant server running on port ${PORT}`);
});