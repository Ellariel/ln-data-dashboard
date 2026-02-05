// chart-manager.js
// Wrapper around Chart.js to simplify creation and updating of time‑series charts.

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

/**
 * Generate a color palette for metrics.
 */
function getColor(idx) {
  const colors = [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f',
    '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab',
  ];
  return colors[idx % colors.length];
}

/**
 * Create a new Chart.js instance inside the given canvas element.
 * @param {HTMLCanvasElement} canvas
 * @param {Array<string>} labels - x‑axis labels (datetime strings)
 * @param {Object} dataMap - { metricName: [values] }
 * @param {Object} descriptions - metric descriptions (optional, for legend titles)
 * @returns {Chart}
 */
function computeYScale(dataMap) {
  // Flatten all data values, ignore null/undefined
  const allValues = Object.values(dataMap).flat().filter(v => v != null && !isNaN(v));
  if (allValues.length === 0) return {};
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  // Add a small padding (5% of range or 1 unit if range is 0)
  const range = max - min;
  const padding = range === 0 ? 1 : range * 0.05;
  return { min: min - padding, max: max + padding };
}

export function createChart(canvas, labels, dataMap, descriptions = {}) {
  const datasets = Object.entries(dataMap).map(([metric, values], idx) => ({
    label: metric,
    data: values,
    borderColor: getColor(idx),
    backgroundColor: getColor(idx),
    fill: false,
    tension: 0.1,
    pointRadius: 2,
  }));
  const ctx = canvas.getContext('2d');
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        tooltip: { mode: 'index', intersect: false },
      },
      scales: {
        x: { display: true, title: { display: true, text: 'Date' } },
        y: { display: true, title: { display: true, text: 'Value' }, ...computeYScale(dataMap) },
      },
    },
  });
}

/**
 * Update an existing chart with new data.
 */
export function updateChart(chart, labels, dataMap) {
  // Recompute Y axis scaling based on new data
  const newYScale = computeYScale(dataMap);
  if (chart.options && chart.options.scales && chart.options.scales.y) {
    Object.assign(chart.options.scales.y, newYScale);
  }
  chart.data.labels = labels;
  chart.data.datasets.forEach((ds) => {
    const metric = ds.label;
    ds.data = dataMap[metric] || [];
  });
  chart.update();
}
