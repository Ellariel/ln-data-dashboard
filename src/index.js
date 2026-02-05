// index.js – main entry point

import { loadCSV, loadMetricsDesc, aggregateData, loadAndProcessData } from './data-processor.js';
import { createChart, updateChart } from './chart-manager.js';
import { applyLayout, enableDrag } from './layout-manager.js';
import { showModal } from './modal-manager.js';

// Global state
let rawCSVData = [];
let metricDescriptions = {};

// UI elements
const dashboard = document.getElementById('dashboard');
const addFigureBtn = document.getElementById('add-figure-btn');
const layoutSelect = document.getElementById('layout-select');

// Initialize app
async function init() {
  try {
    // Load raw CSV and descriptions (store for later aggregation)
    rawCSVData = await loadCSV('./data/metrics.csv');
    metricDescriptions = await loadMetricsDesc('./data/metrics-descriptions.json');
  } catch (e) {
    console.error('Failed to load data:', e);
    return;
  }
  // Set default layout
  applyLayout(dashboard, layoutSelect.value);
  enableDrag(dashboard);
  // Wire UI events
  addFigureBtn.addEventListener('click', () => createFigure());
  layoutSelect.addEventListener('change', (e) => {
    applyLayout(dashboard, e.target.value);
    if (e.target.value === 'auto') {
      // reset grid columns based on current figure count
      const count = dashboard.children.length;
      dashboard.style.gridTemplateColumns = `repeat(${Math.max(count, 1)}, 1fr)`;
    } else {
      // clear inline style so class rules apply
      dashboard.style.gridTemplateColumns = '';
    }
  });
  // Start with one figure
  createFigure();
}

// Helper to get metric names from raw data (excluding datetime)
function getMetricNames() {
  if (rawCSVData.length === 0) return [];
  const all = Object.keys(rawCSVData[0]).filter((k) => k !== 'datetime');
  // Only keep metrics that have a description entry
  if (!metricDescriptions) return all;
  return all.filter((name) => Object.prototype.hasOwnProperty.call(metricDescriptions, name));
}

function createFigure() {
  // Helper to adjust grid columns when in auto layout
  function adjustColumns() {
    if (layoutSelect.value === 'auto') {
      const count = dashboard.children.length;
      // Ensure at least 1 column
      const cols = Math.max(count, 1);
      dashboard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    }
  }
  const figure = document.createElement('div');
  figure.className = 'figure';

  const canvas = document.createElement('canvas');



  // Left container for scaling control, info button, and metric list
  const leftContainer = document.createElement('div');
  leftContainer.className = 'left-container';
  leftContainer.style.display = 'flex';
  leftContainer.style.flexDirection = 'column';
  leftContainer.style.flex = '0 0 auto';
  // Set default width for left panel
  leftContainer.style.width = '30%';

  // Metric list with checkboxes (will be placed on left side)
  const metricList = document.createElement('ul');
  metricList.className = 'metric-list';
  metricList.style.listStyle = 'none';
  metricList.style.padding = '0';
  metricList.style.margin = '0';
  metricList.style.display = 'flex';
  metricList.style.flexDirection = 'column';
  metricList.style.gap = '0.3rem';
  getMetricNames().forEach((name, idx) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = name;
    if (idx === 0) checkbox.checked = true; // select first metric by default
    const label = document.createElement('label');
    label.textContent = name;
    label.style.marginLeft = '0.3rem';
    li.appendChild(checkbox);
    li.appendChild(label);
    metricList.appendChild(li);
  });

  // Time‑scale select (averaging control)
  const scaleSelect = document.createElement('select');
  ['weekly', 'monthly', 'yearly'].forEach((s) => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s.charAt(0).toUpperCase() + s.slice(1);
    scaleSelect.appendChild(opt);
  });

  // Info button
  const infoBtn = document.createElement('button');
  infoBtn.textContent = 'Info';

  // Assemble left container: scale select, info button, then metric list
  leftContainer.appendChild(scaleSelect);
  leftContainer.appendChild(infoBtn);
  leftContainer.appendChild(metricList);

  // Right container for canvas only
  const rightContainer = document.createElement('div');
  rightContainer.className = 'right-container';
  rightContainer.style.display = 'flex';
  rightContainer.style.flexDirection = 'column';
  rightContainer.style.flex = '1';
  rightContainer.appendChild(canvas);

  // Divider between left and right containers for resizing
  const divider = document.createElement('div');
  divider.className = 'divider';
  divider.style.width = '5px';
  divider.style.cursor = 'col-resize';
  divider.style.background = '#ccc';

  let isResizing = false;
  divider.addEventListener('mousedown', (e) => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const rect = figure.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const total = rect.width;
    let leftPct = (offsetX / total) * 100;
    // constrain between 10% and 90%
    leftPct = Math.max(10, Math.min(90, leftPct));
    leftContainer.style.width = leftPct + '%';
  });
  window.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      document.body.style.cursor = '';
    }
  });

  // Append left container, divider, and right container to figure
  figure.appendChild(leftContainer);
  figure.appendChild(divider);
  figure.appendChild(rightContainer);

  // Helper to get selected metrics from checkboxes
  const selectedMetrics = () => {
    const checked = Array.from(metricList.querySelectorAll('input:checked'));
    return checked.map((cb) => cb.value);
  };

  // Trigger initial render for default selection
  metricList.addEventListener('change', renderChart);



  // Append figure to dashboard and adjust layout
  dashboard.appendChild(figure);
  // Adjust column widths for auto layout
  adjustColumns();
  // Initialize chart with current selections

  const currentScale = () => scaleSelect.value;

  function renderChart() {
    const metrics = selectedMetrics();
    const scale = currentScale();
    const aggregated = aggregateData(rawCSVData, scale);
    // Keep rows with recognizable datetime formats (date, week, month, year)
    const isValidDate = (d) => {
      if (!d) return false;
      // ISO date (YYYY-MM-DD)
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return true;
      // ISO week (YYYY-W##)
      if (/^\d{4}-W\d{2}$/.test(d)) return true;
      // Monthly (YYYY-MM)
      if (/^\d{4}-\d{2}$/.test(d)) return true;
      // Yearly (YYYY)
      if (/^\d{4}$/.test(d)) return true;
      return false;
    };
    const filtered = aggregated.filter((row) => isValidDate(row.datetime));
    const labels = filtered.map((row) => row.datetime);
    const dataMap = {};
    metrics.forEach((m) => {
      dataMap[m] = filtered.map((row) => row[m]);
    });
    // Recreate chart to handle changed metric list (add/remove datasets)
    if (figure._chart) {
      figure._chart.destroy();
    }
    figure._chart = createChart(canvas, labels, dataMap, metricDescriptions);
  }

  // Event listeners to re‑render on change

  scaleSelect.addEventListener('change', renderChart);
  infoBtn.addEventListener('click', () => {
    const metrics = selectedMetrics();
    let html = '<h3>Metric Descriptions</h3><ul>';
    metrics.forEach((m) => {
      const desc = metricDescriptions[m] || {};
      const description = desc.description || 'No description';
      const unit = desc.unit ? ` (unit: ${desc.unit})` : '';
      // Detect URLs in description and turn into links
      const linked = description.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
      html += `<li><strong>${m}</strong>: ${linked}${unit}</li>`;
    });
    html += '</ul>';
    showModal(html);
  });

  // Initial render
  renderChart();
}

// Kick off
init();
