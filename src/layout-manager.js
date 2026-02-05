// layout-manager.js
// Handles dashboard layout classes and drag‑and‑drop ordering.

import Sortable from 'sortablejs';

/**
 * Apply a layout class to the dashboard container.
 * @param {HTMLElement} dashboard
 * @param {string} layout - one of 'auto', 'single', '2x2', '3x3'
 */
export function applyLayout(dashboard, layout) {
  const classMap = {
    auto: 'layout-auto',
    single: 'layout-single',
    '2x2': 'layout-2x2',
    '3x3': 'layout-3x3',
  };
  // Remove any existing layout-*
  dashboard.className = dashboard.className
    .split(' ')
    .filter((c) => !c.startsWith('layout-'))
    .join(' ')
    .trim();
  const newClass = classMap[layout] || classMap.auto;
  dashboard.classList.add(newClass);
}

/**
 * Initialize SortableJS on the dashboard to enable drag‑and‑drop.
 */
export function enableDrag(dashboard) {
  // Ensure Sortable is only instantiated once per element.
  if (dashboard._sortable) return;
  dashboard._sortable = Sortable.create(dashboard, {
    animation: 150,
    ghostClass: 'drag-ghost',
    draggable: '.figure',
  });
}
