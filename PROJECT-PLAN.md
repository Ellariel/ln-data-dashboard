# Data Dashboard – Project Plan

## 📋 Overview

| Goal | Build a responsive, multi‑figure, interactive timeseries dashboard (Chart.js) that can be deployed on GitHub Pages and is fully tested. |
|------|------------------------------------------------------------------------------------------------------------------------|
| Primary Users | Data‑analysts, developers, anyone who wants to explore Lightning‑Network metrics (or any other CSV‑based timeseries). |
| Core Stack | • **Node.js** (v14+) <br>• **npm** for package management <br>• **Chart.js** for charts <br>• **Jest** for unit tests <br>• **GitHub Pages** for static hosting |
| Success Criteria | 1️⃣ All listed features work on desktop & mobile. <br>2️⃣ Test coverage ≥ 80 % and CI prevents bad commits. <br>3️⃣ One‑click production build that can be pushed to `gh‑pages`. |

---

## 🗂️ Project Phases & Milestones

| Phase | Rough Effort* | Main Deliverables | Target Milestone |
|-------|----------------|-------------------|------------------|
| **0️⃣ Kick‑off & Setup** | 0.5 d | Repo cloned, Node/NPM installed, baseline scripts (`dev`, `build`, `test`) runnable. | Day 1 |
| **1️⃣ Data Layer** | 1 d | `data-processor.js` can ingest `metrics.csv` & `metrics-descriptions.json`, output normalized objects, handle missing values, support aggregation (daily/weekly/monthly/yearly). | Day 2 |
| **2️⃣ Chart Wrapper** | 1 d | `chart-manager.js` abstracts Chart.js creation, updates data on time‑scale change, exposes API for multiple metrics/legends. | Day 3 |
| **3️⃣ Layout & UI** | 2 d | • `layout-manager.js` (auto grid, single‑column, 2×2, 3×3) <br>• Drag‑and‑drop reordering <br>• UI components (Add Figure button, metric selector, time‑scale dropdown). | Day 5 |
| **4️⃣ Modal & Metric Details** | 0.5 d | `modal-manager.js` shows metric description with clickable URLs. | Day 5.5 |
| **5️⃣ Responsive Styling** | 1 d | `styles.css` implements breakpoints for desktop, tablet, smartphone; touch support for drag. | Day 6.5 |
| **6️⃣ Testing & CI** | 1 d | Unit tests for each module, coverage report, pre‑commit hook enforcing tests & lint. | Day 7.5 |
| **7️⃣ Build & Deploy** | 0.5 d | Production build (`npm run build`) and GitHub‑Pages instructions automated (optional script). | Day 8 |
| **8️⃣ Documentation & Handoff** | 0.5 d | README updates, contribution guide, troubleshooting section refined, memory file with project‑wide notes. | Day 8.5 |

*Effort assumes a single developer familiar with JavaScript/Chart.js. Adjust for team size.*

---

## ✅ Detailed Todo List (Markdown)

```markdown
- [ ] **0️⃣ Project bootstrap** (pending)
  - Clone repo, verify `npm install` succeeds.
  - Validate `npm run dev` shows a blank page.

- [ ] **1️⃣ Data processing**
  - Implement CSV parsing (fallback to `d3-dsv` or `papaparse`).
  - Load metric descriptions JSON.
  - Add aggregation helpers for daily/weekly/monthly/yearly.
  - Write unit tests for parsing & aggregation.

- [ ] **2️⃣ Chart manager**
  - Wrap Chart.js creation (line, bar, etc.).
  - expose `updateData(metrics, timeScale)` method.
  - Support multiple metrics per figure, distinct colors, legends.
  - Unit test rendering via `jsdom` + `chartjs-node-canvas`.

- [ ] **3️⃣ Layout manager**
  - Implement responsive grid (CSS Grid + JS fallback).
  - Drag‑and‑drop via `SortableJS` or native HTML5 DnD.
  - Store layout state (`localStorage`) and restore on load.
  - Provide layout selector UI (auto, 1‑col, 2×2, 3×3).

- [ ] **4️⃣ Modal manager**
  - Build reusable modal component.
  - Show metric description, unit, type, and clickable URLs.
  - Accessibility (focus trap, ESC to close).

- [ ] **5️⃣ UI components**
  - “Add Figure” button → creates new figure container.
  - Metric multi‑select dropdown per figure.
  - Time‑scale dropdown (daily, weekly, monthly, yearly).
  - Hook UI events to Chart & Layout managers.

- [ ] **6️⃣ Responsive styling**
  - Media queries for breakpoints (≥ 1024 px, 768‑1023 px, < 768 px).
  - Touch‑friendly drag zones & button sizes.
  - Test on Chrome, Firefox, Safari, mobile emulators.

- [ ] **7️⃣ Testing & CI**
  - Jest config (already present) – add coverage thresholds.
  - Write tests for each module (data, chart, layout, modal).
  - Add pre‑commit hook (husky) to run `npm test` & lint.
  - Optional GitHub Actions workflow for CI.

- [ ] **8️⃣ Build & deployment**
  - Verify `npm run build` creates `dist/` with minified assets.
  - Provide `scripts/deploy.sh` (optional) that pushes `dist/` to `gh-pages` branch.
  - Update README with one‑click deploy guide.

- [ ] **9️⃣ Documentation**
  - Refresh README sections (Usage, Contributing, Troubleshooting) if needed.
  - Add a **Project Architecture** diagram (optional).
  - Create `.github/instructions/memory.instruction.md` with front‑matter for future notes.

- [ ] **🔟 Post‑release tasks**
  - Monitor GitHub Pages build.
  - Collect user feedback, plan next iteration (e.g., custom themes, export PNG).
```

---

## 🧭 Decision Points & Trade‑offs

| Decision | Options | Recommendation | Why |
|----------|---------|----------------|-----|
| **CSV parser library** | `d3-dsv`, `papaparse`, native `fs` + split | **`papaparse`** – battle‑tested, async, decent error messages. | Handles large files, built‑in type‑conversion, works in browser. |
| **Drag‑and‑drop lib** | native HTML5 DnD, `SortableJS`, `interactjs` | **`SortableJS`** – lightweight, no extra CSS, works on touch. | Simpler API, good documentation. |
| **State persistence** | `localStorage`, `IndexedDB`, URL hash | **`localStorage`** – sufficient for layout/figure config, easy to implement. | No external dependency, quick to prototype. |
| **Testing environment** | `jsdom` + Jest, `vitest`, `cypress` (E2E) | **Jest + jsdom** for unit; consider **Cypress** later for full UI regression. | Already in repo, fast feedback loop. |
| **CI provider** | GitHub Actions (free), Travis, CircleCI | **GitHub Actions** – native, no extra billing. | Simple YAML, integrates with PR checks. |

---

## 📅 Suggested Timeline (Calendar)

| Day | Focus |
|-----|-------|
| 1   | Repo setup, confirm dev server |
| 2   | Data processor (parsing + aggregation) |
| 3   | Chart manager implementation |
| 4‑5 | Layout manager, drag‑and‑drop, UI glue |
| 5.5 | Modal manager & metric detail view |
| 6‑7 | Styling, responsive breakpoints |
| 7.5 | Unit tests, coverage, pre‑commit hook |
| 8   | Production build & GitHub‑Pages deployment script |
| 8.5 | Final docs, memory file, hand‑off |

*If you run into blockers (e.g., Chart.js loading issues on mobile), insert a buffer day after the affected phase.*

---

## 📦 Deliverables Checklist

- ✅ **Working dev server** (`npm run dev`) showing an empty dashboard.
- ✅ **Data ingestion** that reads CSV + JSON, provides aggregated series.
- ✅ **Chart component** that can plot any selected metric(s) with correct time scale.
- ✅ **Figure management** – add, remove, drag, layout selector.
- ✅ **Responsive UI** on desktop, tablet, phone.
- ✅ **Unit test suite** (≥ 80 % coverage) with CI pre‑commit guard.
- ✅ **One‑click production build** (`npm run build`) ready for GitHub Pages.
- ✅ **Complete README** (install, usage, testing, deployment, contribution).
- ✅ **Memory instruction file** for future notes.

---

## 📌 Next Steps for You

1. **Confirm the timeline** – does the 8‑day sprint align with your expectations?
2. **Pick any libraries** you prefer for CSV parsing or drag‑and‑drop (if you have a different choice, let me know).
3. **Set up CI** – do you want a sample GitHub Actions workflow now, or prefer to add it later?
4. **Tell me if you need any additional artifacts** (e.g., architecture diagram, example data generator).

Once you give the go‑ahead (or clarify the points above), the implementation phase can start. Let me know how you’d like to proceed!
