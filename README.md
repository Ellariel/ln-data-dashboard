# Lightning Network Topology Data Dashboard

A responsive dashboard for visualizing timeseries data with support for multiple figures, time scales, and interactive charts.

It uses data from the paper "Topology and Network Dynamics of the Lightning Network: A Comprehensive Analysis", so please refer to https://github.com/ellariel/ln-comprehensive-analysis. There is also a proper citation there if you need it.

The project was created using OpenCode and the gpt-oss-120b model.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and smartphone devices
- **Multiple Figures**: Add and manage multiple chart figures with drag-and-drop arrangement
- **Time Series Visualization**: Supports daily, weekly, monthly, and yearly averages
- **Interactive Charts**: Built with Chart.js for smooth interactions and animations
- **Metric Management**: Select and display multiple metrics per figure with legends and descriptions
- **URL Link Support**: Clickable links in metric descriptions
- **GitHub Pages Ready**: Static build optimized for GitHub Pages deployment
- **Comprehensive Testing**: Full unit test suite with git hooks to ensure code quality

## Project Structure

```
├── src/
│   ├── index.html              # Main HTML file
│   ├── styles.css              # CSS styles
│   ├── index.js                # Main application entry point
│   ├── data-processor.js       # CSV/JSON data processing
│   ├── chart-manager.js        # Chart.js wrapper
│   ├── modal-manager.js        # Modal dialog management
│   ├── layout-manager.js       # Dashboard layout management
│   └── *.test.js              # Unit test files
├── results/
│   ├── metrics.csv             # Sample timeseries data
│   └── metrics-descriptions.json # Metric descriptions with links
├── package.json                # Node.js dependencies
├── jest.config.js              # Jest configuration
└── README.md                   # This file
```

## Data Format

### metrics.csv
The dashboard expects a CSV file with:
- `datetime`: Date column for the timeline
- Multiple metric columns with numeric values

### metrics-descriptions.json
JSON object where keys match metric names and values contain:
- `description`: Text description (can include URLs)
- `unit`: Measurement unit
- `type`: Data type (continuous/discrete)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd timeseries-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

### Building for Production

```bash
npm run build
```

This creates a `dist/` folder optimized for GitHub Pages deployment.

## Usage

1. **Add Figure**: Click the "Add Figure" button to create a new chart
2. **Select Metrics**: Choose one or more metrics to display in the figure
3. **Choose Time Scale**: Use the dropdown to switch between weekly/monthly/yearly views
4. **Arrange Figures**: Drag figures to rearrange them, or use the layout selector
5. **Interact**: Hover over charts for detailed information, click links in descriptions

## Testing

The project includes comprehensive unit tests:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Code Quality

Git hooks are configured to prevent commits with:
- Failing tests
- Linting errors

To temporarily bypass hooks (not recommended):
```bash
git commit --no-verify
```

## Deployment to GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/` folder to your GitHub Pages branch

3. Ensure your GitHub Pages settings point to the correct branch and folder

## Configuration

### Time Scales
The dashboard supports these time aggregation levels:
- **Weekly**: Weekly averages
- **Monthly**: Monthly averages  
- **Yearly**: Yearly averages

### Layout Options
- **Auto**: Responsive grid that adapts to screen size
- **Single Column**: Stacked vertical layout
- **2x2 Grid**: Fixed 2x2 grid layout
- **3x3 Grid**: Fixed 3x3 grid layout

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests as needed
5. Ensure all tests pass and linting is clean
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Troubleshooting

### Data Not Loading
- Ensure `data/metrics.csv` exists and is properly formatted
- Check that `data/metrics-descriptions.json` exists
- Verify your CSV has a `datetime` column

### Charts Not Displaying
- Check browser console for errors
- Ensure all metric data is numeric
- Verify Chart.js is loading correctly

### Mobile Issues
- Test on actual devices, not just browser simulation
- Check that touch events work for dragging figures

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Ensure you're using a supported Node.js version

## Integration with Lightning Network Data

This dashboard is designed to work with the Lightning Network topology data in this repository. The metrics available include:

- **Basic Network Structure**: nodes, edges, components, density, diameter
- **Connectivity & Resilience**: bridges, transitivity, average clustering
- **Function & Dynamics**: global efficiency, betweenness centrality, information centrality
- **Emergent Patterns**: community metrics, intersection rates
- **Statistical Measures**: degree distributions, entropy, Gini coefficients

All metrics are pre-calculated and available in `data/metrics.csv` with corresponding descriptions in `data/metrics-descriptions.json`.