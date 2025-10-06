# DC-DC Converter Magnetic Design Assistant

A professional web application for assisting with magnetic component design and sizing in DC-DC power converters. This tool provides comprehensive calculations for inductors and transformers used in various converter topologies.

## Features

### Supported Converter Types
- **Buck Converter** - Step-down inductor design
- **Boost Converter** - Step-up inductor design  
- **Flyback Converter** - Isolated transformer design
- **Phase-Shifted Full-Bridge** - High-power transformer design

### Core Capabilities
- **Magnetic Design Calculations**
  - Inductance/turns calculations
  - Core saturation analysis
  - Flux density optimization
  - Core loss estimation

- **Wire Selection**
  - Automatic AWG wire gauge selection
  - Current density analysis
  - Copper loss calculations
  - Thermal considerations

- **Core Material Database**
  - Ferrite materials (N87, N97, 3C90)
  - Powder cores (MPP, Kool Mµ)
  - Material property lookup

- **Interactive Visualizations**
  - Flux density analysis charts
  - Loss distribution graphs
  - Real-time parameter updates

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm package manager

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hahahaha
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:12000
   ```

## Usage

1. **Select Converter Type**: Choose from Buck, Boost, Flyback, or Phase-Shifted Full-Bridge
2. **Choose Core Material**: Select appropriate ferrite or powder core material
3. **Enter Parameters**: Input voltage, current, frequency, and ripple specifications
4. **Calculate Design**: Click "Calculate Design" to get comprehensive results
5. **Analyze Results**: Review magnetic parameters, wire selection, and visualizations

### Example Calculations

#### Buck Converter (12V → 5V, 2A)
- Input: 12V, Output: 5V, Current: 2A, Frequency: 100kHz
- Results: ~48µH inductor, 4 turns, 14 AWG wire

#### Flyback Converter (85-265V → 12V, 2A)
- Input: 85-265V, Output: 12V, Current: 2A, Frequency: 65kHz
- Results: ~375µH primary, turns ratio optimization

## Technical Details

### Calculation Methods
- **Inductor Design**: Based on energy storage and ripple current requirements
- **Transformer Design**: Considers turns ratio, flux density, and core utilization
- **Core Loss**: Simplified Steinmetz equation implementation
- **Wire Selection**: Current density optimization (2-6 A/mm²)

### Core Material Properties
- Saturation flux density (Bsat)
- Curie temperature (Tc)
- Core geometry (Ae, le, Ve)
- Resistivity and permeability

### Safety Margins
- Ferrite cores: 80% of saturation flux density
- Powder cores: 90% of saturation flux density
- Current density: Optimized for thermal performance

## API Endpoints

The application provides REST API endpoints for programmatic access:

- `GET /api/materials` - Get core material database
- `GET /api/wires` - Get wire gauge specifications
- `POST /api/calculate/buck` - Buck converter calculations
- `POST /api/calculate/boost` - Boost converter calculations
- `POST /api/calculate/flyback` - Flyback converter calculations
- `POST /api/calculate/psfb` - Phase-shifted full-bridge calculations

## Architecture

- **Frontend**: HTML5, CSS3, JavaScript with Chart.js
- **Backend**: Node.js with Express framework
- **Calculations**: Pure JavaScript mathematical implementations
- **Visualization**: Chart.js for interactive graphs
- **Styling**: Bootstrap 5 with custom CSS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Based on standard power electronics design principles
- Core material data from manufacturer specifications
- Wire gauge data from industry standards

## Support

For questions, issues, or feature requests, please open an issue on the repository.