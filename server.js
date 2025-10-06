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
}

// API Routes
app.post('/api/calculate/buck', (req, res) => {
  try {
    const result = MagneticDesign.calculateBuckInductor(req.body);
    const wireInfo = MagneticDesign.selectWire(result.peakCurrent);
    res.json({ ...result, wireSelection: wireInfo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculate/boost', (req, res) => {
  try {
    const result = MagneticDesign.calculateBoostInductor(req.body);
    const wireInfo = MagneticDesign.selectWire(result.peakCurrent);
    res.json({ ...result, wireSelection: wireInfo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculate/flyback', (req, res) => {
  try {
    const result = MagneticDesign.calculateFlybackTransformer(req.body);
    const wireInfo = MagneticDesign.selectWire(result.peakPrimaryCurrent);
    res.json({ ...result, wireSelection: wireInfo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculate/psfb', (req, res) => {
  try {
    const result = MagneticDesign.calculatePSFBTransformer(req.body);
    const wireInfo = MagneticDesign.selectWire(result.peakPrimaryCurrent);
    res.json({ ...result, wireSelection: wireInfo });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
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