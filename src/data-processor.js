// data-processor.js
// Responsible for loading CSV/JSON metric data and providing aggregation utilities.

import Papa from 'papaparse';

/**
 * Load CSV metrics from the given URL.
 * Returns a Promise that resolves to an array of objects where each column becomes a key.
 */
export async function loadCSV(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV at ${url}: ${response.status}`);
  }
  const text = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (err) => reject(err),
    });
  });
}

/**
 * Load metric descriptions JSON.
 */
export async function loadMetricsDesc(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch JSON at ${url}: ${response.status}`);
  }
  return response.json();
}

/**
 * Helper to group data by a time bucket.
 * `scale` can be 'daily', 'weekly', 'monthly', 'yearly'.
 */
function getBucket(date, scale) {
  const d = new Date(date);
  switch (scale) {
    case 'daily':
      return d.toISOString().slice(0, 10); // YYYY-MM-DD
    case 'weekly': {
      // Simple week bucket: week number starting from Jan 1 (Monday as first day of week)
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const dayOfYear = Math.floor((d - yearStart) / 86400000) + 1;
      const week = Math.ceil(dayOfYear / 7);
      return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
    }

    case 'monthly':
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    case 'yearly':
      return `${d.getFullYear()}`;
    default:
      return d.toISOString().slice(0, 10);
  }
}

/**
 * Aggregate raw data according to the requested time scale.
 * Returns an object: { bucketKey: { metricName: aggregatedValue, ... }, ... }
 */
export function aggregateData(rawData, scale = 'daily') {
  if (!Array.isArray(rawData) || rawData.length === 0) return {};
  const metricKeys = Object.keys(rawData[0]).filter((k) => k !== 'datetime');
  const buckets = {};
  rawData.forEach((row) => {
    const bucket = getBucket(row.datetime, scale);
    if (!buckets[bucket]) buckets[bucket] = { datetime: bucket };
    metricKeys.forEach((key) => {
      const val = row[key];
      if (typeof val === 'number' && !isNaN(val)) {
        if (!buckets[bucket][key]) buckets[bucket][key] = { sum: 0, count: 0 };
        buckets[bucket][key].sum += val;
        buckets[bucket][key].count += 1;
      }
    });
  });
  // Convert sums to averages
  const result = {};
  Object.entries(buckets).forEach(([bucket, data]) => {
    const out = { datetime: bucket };
    metricKeys.forEach((key) => {
      const entry = data[key];
      out[key] = entry ? entry.sum / entry.count : null;
    });
    result[bucket] = out;
  });
  // Return as an array sorted by datetime
  return Object.values(result).sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
}

/**
 * Load both CSV and description files and return processed data.
 */
export async function loadAndProcessData(csvPath = './metrics.csv', descPath = './metrics-descriptions.json', scale = 'daily') {
  const [raw, desc] = await Promise.all([loadCSV(csvPath), loadMetricsDesc(descPath)]);
  const aggregated = aggregateData(raw, scale);
  return { data: aggregated, descriptions: desc };
}
