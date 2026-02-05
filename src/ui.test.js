/**
 * UI integration tests for the dashboard.
 * Uses Jest with jsdom to verify that the initial figure is created correctly
 * and that the metric list matches the metrics descriptions.
 */

// Mock fetch to provide CSV and metric descriptions without network requests.
import { jest } from '@jest/globals';
global.fetch = jest.fn((url) => {
  if (url.endsWith('metrics.csv')) {
    // Simple CSV content
    const csv = `timestamp,datetime,nodes,edges,density\n1,2020-01-01,1,2,0.5\n2,2020-01-02,3,4,0.7`;
    return Promise.resolve({ ok: true, text: async () => csv });
  }
  // For metrics-descriptions.json
  const desc = {
    nodes: { name: 'nodes', description: 'Node count', unit: 'count', type: 'discrete' },
    edges: { name: 'edges', description: 'Edge count', unit: 'count', type: 'discrete' },
    density: { name: 'density', description: 'Density', unit: 'ratio', type: 'continuous' },
  };
    return Promise.resolve({ ok: true, json: async () => desc });
});

// Mock chart-manager to avoid canvas context errors
jest.mock('./chart-manager.js', () => ({
  createChart: jest.fn(() => ({ destroy: jest.fn() })),
  updateChart: jest.fn(),
}));

// Provide minimal HTML structure required by index.js
beforeEach(async () => {
  document.body.innerHTML = `
    <header>
      <h1>Timeseries Dashboard</h1>
      <div class="header-controls">
        <select id="layout-select">
          <option value="auto">Auto Grid</option>
        </select>
        <button id="add-figure-btn">Add Figure</button>
      </div>
    </header>
    <main id="dashboard" class="layout-auto"></main>
  `;
});

// Import the module after the DOM is set up.
// Import index after DOM setup (dynamic import in beforeEach)

describe('Dashboard UI', () => {
  test('initial figure is created with left and right panels', async () => {
    await import('./index.js');
    // Wait for async init to finish (loadCSV & loadMetricsDesc).
    await new Promise((r) => setTimeout(r, 0));

    const dashboard = document.getElementById('dashboard');
    expect(dashboard).not.toBeNull();
    const figure = dashboard.querySelector('.figure');
    expect(figure).not.toBeNull();

    const left = figure.querySelector('.left-container');
    const right = figure.querySelector('.right-container');
    expect(left).not.toBeNull();
    expect(right).not.toBeNull();
  });

    test('metric list contains entries for all described metrics', async () => {
    await import('./index.js');
    await new Promise((r) => setTimeout(r, 0));
    const metricList = document.querySelector('.metric-list');
    expect(metricList).not.toBeNull();
    const items = metricList.querySelectorAll('li');
    // Should match number of keys in mocked metricDescriptions (3).
    expect(items.length).toBe(3);
  });
});
