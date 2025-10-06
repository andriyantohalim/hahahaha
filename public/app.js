// Magnetic Design Assistant Frontend Application

let fluxChart = null;
let lossChart = null;
let coreMaterials = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadCoreMaterials();
    updateInputFields();
    updateMaterialProperties();
});

// Load core materials from API
async function loadCoreMaterials() {
    try {
        const response = await fetch('/api/materials');
        coreMaterials = await response.json();
        updateMaterialProperties();
    } catch (error) {
        console.error('Error loading core materials:', error);
    }
}

// Update input fields based on converter type
function updateInputFields() {
    const converterType = document.getElementById('converterType').value;
    const inputFields = document.getElementById('inputFields');
    
    let fieldsHTML = '';
    
    switch (converterType) {
        case 'buck':
            fieldsHTML = `
                <div class="mb-3">
                    <label class="form-label">Input Voltage (V)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="Vin" value="12" step="0.1">
                        <span class="input-group-text">V</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Output Voltage (V)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="Vout" value="5" step="0.1">
                        <span class="input-group-text">V</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Output Current (A)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="Iout" value="2" step="0.1">
                        <span class="input-group-text">A</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Switching Frequency (kHz)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="fsw" value="100" step="1">
                        <span class="input-group-text">kHz</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Current Ripple Factor</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="rippleFactor" value="0.3" step="0.05" min="0.1" max="0.5">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
            `;
            break;
            
        case 'boost':
            fieldsHTML = `
                <div class="mb-3">
                    <label class="form-label">Input Voltage (V)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="Vin" value="5" step="0.1">
                        <span class="input-group-text">V</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Output Voltage (V)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="Vout" value="12" step="0.1">
                        <span class="input-group-text">V</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Output Current (A)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="Iout" value="1" step="0.1">
                        <span class="input-group-text">A</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Switching Frequency (kHz)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="fsw" value="100" step="1">
                        <span class="input-group-text">kHz</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Current Ripple Factor</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="rippleFactor" value="0.3" step="0.05" min="0.1" max="0.5">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
            `;
            break;
            
        case 'flyback':
            fieldsHTML = `
                <div class="mb-3">
                    <label class="form-label">Min Input Voltage (V)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="Vin_min" value="85" step="1">
                        <span class="input-group-text">V</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Max Input Voltage (V)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="Vin_max" value="265" step="1">
                        <span class="input-group-text">V</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Output Voltage (V)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="Vout" value="12" step="0.1">
                        <span class="input-group-text">V</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Output Current (A)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="Iout" value="2" step="0.1">
                        <span class="input-group-text">A</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Switching Frequency (kHz)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="fsw" value="65" step="1">
                        <span class="input-group-text">kHz</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Current Ripple Factor</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="rippleFactor" value="0.4" step="0.05" min="0.2" max="0.6">
                        <span class="input-group-text">%</span>
                    </div>
                </div>
            `;
            break;
            
        case 'psfb':
            fieldsHTML = `
                <div class="mb-3">
                    <label class="form-label">Input Voltage (V)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="Vin" value="48" step="1">
                        <span class="input-group-text">V</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Output Voltage (V)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="Vout" value="12" step="0.1">
                        <span class="input-group-text">V</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Output Current (A)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="Iout" value="10" step="0.1">
                        <span class="input-group-text">A</span>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">Switching Frequency (kHz)</label>
                    <div class="input-group">
                        <input type="number" class="form-control" id="fsw" value="100" step="1">
                        <span class="input-group-text">kHz</span>
                    </div>
                </div>
            `;
            break;
    }
    
    inputFields.innerHTML = fieldsHTML;
    updateMaterialProperties();
}

// Update material properties display
function updateMaterialProperties() {
    const materialSelect = document.getElementById('coreMaterial');
    const propertiesDiv = document.getElementById('materialProperties');
    
    if (!materialSelect || !coreMaterials) return;
    
    const selectedMaterial = materialSelect.value;
    const material = coreMaterials[selectedMaterial];
    
    if (material) {
        propertiesDiv.innerHTML = `
            <div class="material-property">
                <span class="property-label">Saturation Flux Density:</span>
                <span class="property-value">${material.Bsat} T</span>
            </div>
            <div class="material-property">
                <span class="property-label">Curie Temperature:</span>
                <span class="property-value">${material.Tc} °C</span>
            </div>
            <div class="material-property">
                <span class="property-label">Core Area:</span>
                <span class="property-value">${(material.Ae * 1e6).toFixed(1)} mm²</span>
            </div>
            <div class="material-property">
                <span class="property-label">Magnetic Path Length:</span>
                <span class="property-value">${(material.le * 1000).toFixed(1)} mm</span>
            </div>
        `;
    }
}

// Calculate magnetic design
async function calculateDesign() {
    const converterType = document.getElementById('converterType').value;
    const coreMaterial = document.getElementById('coreMaterial').value;
    
    // Show loading
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="text-center"><div class="spinner"></div><p>Calculating design...</p></div>';
    
    try {
        // Collect input parameters
        const params = { coreMaterial };
        
        // Get all input values
        const inputs = document.querySelectorAll('#inputFields input');
        inputs.forEach(input => {
            const value = parseFloat(input.value);
            if (input.id === 'fsw') {
                params[input.id] = value * 1000; // Convert kHz to Hz
            } else {
                params[input.id] = value;
            }
        });
        
        // Make API call
        const response = await fetch(`/api/calculate/${converterType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        
        if (!response.ok) {
            throw new Error('Calculation failed');
        }
        
        const result = await response.json();
        displayResults(result, converterType);
        updateCharts(result, converterType);
        
    } catch (error) {
        resultsDiv.innerHTML = `
            <div class="error">
                <strong>Error:</strong> ${error.message}
            </div>
        `;
    }
}

// Display calculation results
function displayResults(result, converterType) {
    const resultsDiv = document.getElementById('results');
    let html = '';
    
    // Design summary
    html += '<div class="design-summary">';
    html += '<h6>Design Summary</h6>';
    html += '<div class="summary-grid">';
    
    switch (converterType) {
        case 'buck':
        case 'boost':
            html += `
                <div class="summary-item">
                    <div class="summary-value">${result.inductance.toFixed(1)}</div>
                    <div class="summary-label">Inductance (µH)</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${result.turns}</div>
                    <div class="summary-label">Turns</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${result.peakCurrent.toFixed(2)}</div>
                    <div class="summary-label">Peak Current (A)</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${result.coreLoss.toFixed(2)}</div>
                    <div class="summary-label">Core Loss (mW)</div>
                </div>
            `;
            break;
            
        case 'flyback':
        case 'psfb':
            html += `
                <div class="summary-item">
                    <div class="summary-value">${result.primaryTurns}</div>
                    <div class="summary-label">Primary Turns</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${result.secondaryTurns}</div>
                    <div class="summary-label">Secondary Turns</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${result.turnsRatio.toFixed(2)}</div>
                    <div class="summary-label">Turns Ratio</div>
                </div>
                <div class="summary-item">
                    <div class="summary-value">${result.coreLoss.toFixed(2)}</div>
                    <div class="summary-label">Core Loss (mW)</div>
                </div>
            `;
            break;
    }
    
    html += '</div></div>';
    
    // Detailed results
    html += '<div class="row">';
    
    // Magnetic parameters
    html += '<div class="col-md-6">';
    html += '<div class="result-item">';
    html += '<h6 class="mb-3">Magnetic Parameters</h6>';
    
    switch (converterType) {
        case 'buck':
        case 'boost':
            html += `
                <div class="mb-2">
                    <div class="result-label">Required Inductance</div>
                    <div class="result-value">${result.inductance.toFixed(2)}<span class="result-unit">µH</span></div>
                </div>
                <div class="mb-2">
                    <div class="result-label">Actual Inductance</div>
                    <div class="result-value">${result.actualInductance.toFixed(2)}<span class="result-unit">µH</span></div>
                </div>
                <div class="mb-2">
                    <div class="result-label">Number of Turns</div>
                    <div class="result-value">${result.turns}<span class="result-unit">turns</span></div>
                </div>
                <div class="mb-2">
                    <div class="result-label">Duty Cycle</div>
                    <div class="result-value">${(result.dutyCycle * 100).toFixed(1)}<span class="result-unit">%</span></div>
                </div>
            `;
            break;
            
        case 'flyback':
            html += `
                <div class="mb-2">
                    <div class="result-label">Primary Inductance</div>
                    <div class="result-value">${result.primaryInductance.toFixed(2)}<span class="result-unit">µH</span></div>
                </div>
                <div class="mb-2">
                    <div class="result-label">Actual Primary Inductance</div>
                    <div class="result-value">${result.actualPrimaryInductance.toFixed(2)}<span class="result-unit">µH</span></div>
                </div>
                <div class="mb-2">
                    <div class="result-label">Primary Turns</div>
                    <div class="result-value">${result.primaryTurns}<span class="result-unit">turns</span></div>
                </div>
                <div class="mb-2">
                    <div class="result-label">Secondary Turns</div>
                    <div class="result-value">${result.secondaryTurns}<span class="result-unit">turns</span></div>
                </div>
                <div class="mb-2">
                    <div class="result-label">Turns Ratio (Np:Ns)</div>
                    <div class="result-value">${result.turnsRatio.toFixed(2)}<span class="result-unit">:1</span></div>
                </div>
            `;
            break;
            
        case 'psfb':
            html += `
                <div class="mb-2">
                    <div class="result-label">Leakage Inductance</div>
                    <div class="result-value">${result.leakageInductance.toFixed(2)}<span class="result-unit">µH</span></div>
                </div>
                <div class="mb-2">
                    <div class="result-label">Primary Turns</div>
                    <div class="result-value">${result.primaryTurns}<span class="result-unit">turns</span></div>
                </div>
                <div class="mb-2">
                    <div class="result-label">Secondary Turns</div>
                    <div class="result-value">${result.secondaryTurns}<span class="result-unit">turns</span></div>
                </div>
                <div class="mb-2">
                    <div class="result-label">Turns Ratio (Np:Ns)</div>
                    <div class="result-value">${result.turnsRatio.toFixed(2)}<span class="result-unit">:1</span></div>
                </div>
            `;
            break;
    }
    
    html += '</div></div>';
    
    // Current and flux parameters
    html += '<div class="col-md-6">';
    html += '<div class="result-item">';
    html += '<h6 class="mb-3">Current & Flux</h6>';
    
    const peakCurrent = result.peakCurrent || result.peakPrimaryCurrent;
    html += `
        <div class="mb-2">
            <div class="result-label">Peak Current</div>
            <div class="result-value">${peakCurrent.toFixed(2)}<span class="result-unit">A</span></div>
        </div>
        <div class="mb-2">
            <div class="result-label">Max Flux Density</div>
            <div class="result-value">${(result.maxFluxDensity * 1000).toFixed(0)}<span class="result-unit">mT</span></div>
        </div>
    `;
    
    if (result.deltaI) {
        html += `
            <div class="mb-2">
                <div class="result-label">Current Ripple</div>
                <div class="result-value">${result.deltaI.toFixed(2)}<span class="result-unit">A</span></div>
            </div>
        `;
    }
    
    if (result.acFluxDensity) {
        html += `
            <div class="mb-2">
                <div class="result-label">AC Flux Density</div>
                <div class="result-value">${(result.acFluxDensity * 1000).toFixed(1)}<span class="result-unit">mT</span></div>
            </div>
        `;
    }
    
    html += `
        <div class="mb-2">
            <div class="result-label">Core Loss</div>
            <div class="result-value">${result.coreLoss.toFixed(2)}<span class="result-unit">mW</span></div>
        </div>
    `;
    
    html += '</div></div>';
    html += '</div>';
    
    // Wire selection
    if (result.wireSelection && !result.wireSelection.error) {
        html += '<div class="result-item">';
        html += '<h6 class="mb-3">Wire Selection</h6>';
        html += '<div class="row">';
        html += '<div class="col-md-6">';
        html += `
            <div class="mb-2">
                <div class="result-label">Recommended AWG</div>
                <div class="result-value">${result.wireSelection.awg}<span class="result-unit">AWG</span></div>
            </div>
            <div class="mb-2">
                <div class="result-label">Wire Diameter</div>
                <div class="result-value">${result.wireSelection.diameter.toFixed(2)}<span class="result-unit">mm</span></div>
            </div>
        `;
        html += '</div><div class="col-md-6">';
        html += `
            <div class="mb-2">
                <div class="result-label">Current Density</div>
                <div class="result-value">${result.wireSelection.actualCurrentDensity.toFixed(1)}<span class="result-unit">A/mm²</span></div>
            </div>
            <div class="mb-2">
                <div class="result-label">Power Loss</div>
                <div class="result-value">${(result.wireSelection.powerLossPerMeter * 1000).toFixed(1)}<span class="result-unit">mW/m</span></div>
            </div>
        `;
        html += '</div></div></div>';
    }
    
    resultsDiv.innerHTML = html;
    
    // Display part recommendations if available
    if (result.partRecommendations && result.partRecommendations.length > 0) {
        displayPartRecommendations(result.partRecommendations);
    }
}

// Update charts
function updateCharts(result, converterType) {
    updateFluxChart(result);
    updateLossChart(result);
}

// Update flux density chart
function updateFluxChart(result) {
    const ctx = document.getElementById('fluxChart').getContext('2d');
    
    if (fluxChart) {
        fluxChart.destroy();
    }
    
    const maxFlux = result.maxFluxDensity * 1000; // Convert to mT
    const acFlux = result.acFluxDensity ? result.acFluxDensity * 1000 : 0;
    const saturationFlux = 390; // N87 saturation flux in mT
    
    fluxChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Max Flux', 'AC Flux', 'Saturation Limit'],
            datasets: [{
                label: 'Flux Density (mT)',
                data: [maxFlux, acFlux, saturationFlux],
                backgroundColor: [
                    maxFlux > saturationFlux * 0.8 ? '#dc3545' : '#28a745',
                    '#17a2b8',
                    '#ffc107'
                ],
                borderColor: [
                    maxFlux > saturationFlux * 0.8 ? '#dc3545' : '#28a745',
                    '#17a2b8',
                    '#ffc107'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Flux Density Analysis'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Flux Density (mT)'
                    }
                }
            }
        }
    });
}

// Update loss analysis chart
function updateLossChart(result) {
    const ctx = document.getElementById('lossChart').getContext('2d');
    
    if (lossChart) {
        lossChart.destroy();
    }
    
    const coreLoss = result.coreLoss;
    const copperLoss = result.wireSelection ? result.wireSelection.powerLossPerMeter * 100 : 0; // Assume 10cm wire length
    
    lossChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Core Loss', 'Copper Loss'],
            datasets: [{
                data: [coreLoss, copperLoss],
                backgroundColor: ['#ff6384', '#36a2eb'],
                borderColor: ['#ff6384', '#36a2eb'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Loss Distribution'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Display part recommendations
function displayPartRecommendations(recommendations) {
    const partRecommendationsCard = document.getElementById('partRecommendationsCard');
    const partRecommendationsDiv = document.getElementById('partRecommendations');
    
    let html = '<div class="table-responsive">';
    html += '<table class="table table-sm table-hover">';
    html += '<thead class="table-dark">';
    html += '<tr>';
    html += '<th>Part Number</th>';
    html += '<th>Manufacturer</th>';
    html += '<th>Package</th>';
    html += '<th>Value</th>';
    html += '<th>Current</th>';
    html += '<th>DCR</th>';
    html += '<th>Score</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    
    recommendations.forEach((part, index) => {
        const rowClass = index === 0 ? 'table-success' : '';
        html += `<tr class="${rowClass}">`;
        html += `<td><strong>${part.partNumber}</strong></td>`;
        html += `<td>${part.manufacturer}</td>`;
        html += `<td>${part.package}</td>`;
        
        if (part.inductance) {
            html += `<td>${part.inductance} µH</td>`;
            html += `<td>${part.current} A</td>`;
            html += `<td>${part.dcr} Ω</td>`;
        } else {
            html += `<td>${part.primaryInductance} µH</td>`;
            html += `<td>${part.turnsRatio}:1</td>`;
            html += `<td>${part.leakageInductance} µH</td>`;
        }
        
        html += `<td><span class="badge bg-primary">${part.score}</span></td>`;
        html += '</tr>';
    });
    
    html += '</tbody>';
    html += '</table>';
    html += '</div>';
    
    if (recommendations.length > 0) {
        html += '<div class="alert alert-info mt-2">';
        html += '<small><i class="fas fa-info-circle"></i> ';
        html += 'Recommendations are sorted by suitability score. Green row shows the best match.';
        html += '</small>';
        html += '</div>';
    }
    
    partRecommendationsDiv.innerHTML = html;
    partRecommendationsCard.style.display = 'block';
}

// Calculate compensation design
async function calculateCompensation() {
    const compensatorType = document.getElementById('compensatorType').value;
    const resultsDiv = document.getElementById('compensationResults');
    
    // Show loading
    resultsDiv.innerHTML = '<div class="text-center"><div class="spinner"></div><p>Designing compensator...</p></div>';
    
    try {
        // Collect parameters
        const params = {
            Vin: parseFloat(document.getElementById('compVin').value),
            Vout: parseFloat(document.getElementById('compVout').value),
            fsw: parseFloat(document.getElementById('compFsw').value) * 1000, // Convert to Hz
            L: parseFloat(document.getElementById('compL').value) * 1e-6, // Convert to H
            C: parseFloat(document.getElementById('compC').value) * 1e-6, // Convert to F
            ESR: parseFloat(document.getElementById('compESR').value) * 1e-3, // Convert to Ω
            loadCurrent: parseFloat(document.getElementById('compLoadCurrent').value)
        };
        
        // Make API call
        const response = await fetch(`/api/compensation/${compensatorType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        
        if (!response.ok) {
            throw new Error('Compensation design failed');
        }
        
        const result = await response.json();
        displayCompensationResults(result);
        
    } catch (error) {
        resultsDiv.innerHTML = `
            <div class="alert alert-danger">
                <strong>Error:</strong> ${error.message}
            </div>
        `;
    }
}

// Display compensation results
function displayCompensationResults(result) {
    const resultsDiv = document.getElementById('compensationResults');
    
    let html = '<div class="row">';
    
    // Compensator summary
    html += '<div class="col-md-6">';
    html += '<div class="card border-success">';
    html += '<div class="card-header bg-success text-white">';
    html += `<h6 class="mb-0">${result.type} Compensator</h6>`;
    html += '</div>';
    html += '<div class="card-body">';
    
    html += '<div class="mb-2">';
    html += '<div class="result-label">Crossover Frequency</div>';
    html += `<div class="result-value">${(result.crossoverFreq / 1000).toFixed(1)}<span class="result-unit">kHz</span></div>`;
    html += '</div>';
    
    html += '<div class="mb-2">';
    html += '<div class="result-label">Phase Margin</div>';
    html += `<div class="result-value">${result.performance.phaseMargin}<span class="result-unit">°</span></div>`;
    html += '</div>';
    
    html += '<div class="mb-2">';
    html += '<div class="result-label">Gain Margin</div>';
    html += `<div class="result-value">${result.performance.gainMargin}<span class="result-unit">dB</span></div>`;
    html += '</div>';
    
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    // Component values
    html += '<div class="col-md-6">';
    html += '<div class="card border-primary">';
    html += '<div class="card-header bg-primary text-white">';
    html += '<h6 class="mb-0">Component Values</h6>';
    html += '</div>';
    html += '<div class="card-body">';
    
    Object.entries(result.components).forEach(([component, value]) => {
        html += '<div class="mb-2">';
        html += `<div class="result-label">${component}</div>`;
        html += `<div class="result-value">${value}</div>`;
        html += '</div>';
    });
    
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    
    // Power stage analysis
    html += '<div class="card mt-3 border-info">';
    html += '<div class="card-header bg-info text-white">';
    html += '<h6 class="mb-0">Power Stage Analysis</h6>';
    html += '</div>';
    html += '<div class="card-body">';
    html += '<div class="row">';
    
    html += '<div class="col-md-4">';
    html += '<div class="mb-2">';
    html += '<div class="result-label">LC Corner Frequency</div>';
    html += `<div class="result-value">${(result.powerStage.lcCorner / 1000).toFixed(1)}<span class="result-unit">kHz</span></div>`;
    html += '</div>';
    html += '</div>';
    
    html += '<div class="col-md-4">';
    html += '<div class="mb-2">';
    html += '<div class="result-label">ESR Zero Frequency</div>';
    html += `<div class="result-value">${(result.powerStage.esrZero / 1000).toFixed(1)}<span class="result-unit">kHz</span></div>`;
    html += '</div>';
    html += '</div>';
    
    html += '<div class="col-md-4">';
    html += '<div class="mb-2">';
    html += '<div class="result-label">Quality Factor</div>';
    html += `<div class="result-value">${result.powerStage.qualityFactor}</div>`;
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    html += '</div>';
    html += '</div>';
    
    // Frequency response information
    html += '<div class="alert alert-info mt-3">';
    html += '<h6><i class="fas fa-info-circle"></i> Design Notes</h6>';
    html += '<ul class="mb-0">';
    
    if (result.type === 'Type II') {
        html += '<li>Type II compensator provides adequate phase margin for most applications</li>';
        html += '<li>Zero placed below LC corner frequency to boost phase</li>';
        html += '<li>Pole placed above ESR zero to maintain stability</li>';
    } else {
        html += '<li>Type III compensator provides higher bandwidth and better transient response</li>';
        html += '<li>Two zeros provide more aggressive phase boost</li>';
        html += '<li>Second pole prevents high-frequency noise amplification</li>';
    }
    
    html += `<li>Crossover frequency set to ${(result.crossoverFreq / result.performance.bandwidth * 100).toFixed(0)}% of switching frequency</li>`;
    html += '</ul>';
    html += '</div>';
    
    resultsDiv.innerHTML = html;
}

// Event listeners
document.getElementById('coreMaterial').addEventListener('change', updateMaterialProperties);