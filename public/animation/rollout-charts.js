// Generated from presentation/rollout-charts.js; do not edit.
(() => {
// Compare complete work ledgers. Every activity is charged once to its workflow.
function calculateSavings(model, scenario) {
  const nonnegative = (v, name) => {
    if (!Number.isFinite(v) || v < 0) throw new Error(`${name} must be a nonnegative number`)
    return v
  }
  const integer = (v, name) => {
    nonnegative(v, name)
    if (!Number.isInteger(v)) throw new Error(`${name} must be a whole number`)
    return v
  }
  const services = integer(scenario.services, 'Services')
  const domains = integer(scenario.domains, 'Rollout domains')
  if (!services || !domains) throw new Error('Services and rollout domains must be positive')
  if (model.runtimeMix.total <= 0 || model.runtimeMix.eligible < 0 || model.runtimeMix.eligible > model.runtimeMix.total) throw new Error('Invalid supported-runtime mix')
  const eligible = integer(scenario.eligibleServices ?? Math.floor(services * model.runtimeMix.eligible / model.runtimeMix.total), 'Eligible services')
  if (eligible > services) throw new Error('Eligible services cannot exceed the fleet')
  const remaining = eligible - Math.min(eligible, integer(model.pilotServices, 'Common pilot services'))
  const p = model.perService, shared = model.shared, baseline = model.baseline
  for (const group of [p, shared, baseline]) for (const [name, value] of Object.entries(group)) nonnegative(value, name)
  integer(p.changesPerYear, 'Changes per year')
  const rate = nonnegative(model.hourlyRate, 'Hourly rate')
  const exceptions = integer(scenario.exceptionsPerChange, 'Exception services per change')
  if (exceptions > remaining) throw new Error('Exception services cannot exceed the remaining eligible services')
  const extraSetup = nonnegative(scenario.extraSetupHours ?? 0, 'Additional initial work')
  const extraAnnual = nonnegative(scenario.extraAnnualHours ?? 0, 'Additional annual work')
  const sharedSetupHours = domains * (shared.initialPerDomainHours + shared.obiSetupPerDomainHours)
  const sharedUpdateHours = domains * p.changesPerYear * shared.changePerDomainHours
  const exceptionHours = exceptions * p.changesPerYear * p.exceptionHours
  const initialBaselineHours = remaining * p.initialBaselineHours + domains * baseline.initialPerDomainHours
  const initialSharedHours = sharedSetupHours + extraSetup
  const lifecycleBaselineHours = p.changesPerYear * (remaining * p.changeBaselineHours + domains * baseline.changePerDomainHours)
  const lifecycleSharedHours = sharedUpdateHours + exceptionHours + extraAnnual
  const initialHours = initialBaselineHours - initialSharedHours
  const lifecycleHours = lifecycleBaselineHours - lifecycleSharedHours
  const baselineHours = initialBaselineHours + lifecycleBaselineHours
  const sharedHours = initialSharedHours + lifecycleSharedHours
  const firstYearHours = baselineHours - sharedHours
  const recurringHours = lifecycleHours
  const additionalAnnualCost = nonnegative(scenario.additionalAnnualCost ?? 0, 'Additional annual non-labor cost')
  return {...scenario, eligible, remaining, distributedUpdatesPerMonth: remaining, centralizedUpdatesPerMonth: domains, distributedAnnualUpdates: remaining * p.changesPerYear, centralizedAnnualUpdates: domains * p.changesPerYear, initialBaselineHours, initialSharedHours, lifecycleBaselineHours, lifecycleSharedHours,
    sharedSetupHours, sharedUpdateHours, exceptionHours,
    initialHours, lifecycleHours, baselineHours, sharedHours, firstYearHours, recurringHours,
    firstYearValue: firstYearHours * rate, recurringValue: recurringHours * rate,
    firstYearAfterAdditionalCosts: firstYearHours * rate - additionalAnnualCost,
    recurringAfterAdditionalCosts: recurringHours * rate - additionalAnnualCost}
}


// Conceptual adoption paths, not observed rollout data or a duration forecast.
// The denominator is eligible workloads within the selected policy scope.
const adoptionPaths = {
  centralized: [[0, 0], [2, 0], [2, 100], [100, 100]],
  distributed: [[0, 0], [8, 0], [8, 18], [20, 18], [20, 38], [35, 38], [35, 54], [50, 54], [50, 68], [65, 68], [65, 59], [78, 59], [78, 72], [87, 72], [87, 58], [100, 58]],
}

function costTimeline(model, scenario = model.scenarios[0], months = 24) {
  const row = calculateSavings(model, scenario)
  const points = Array.from({ length: months + 1 }, (_, month) => {
    const distributedHours = row.initialBaselineHours + row.lifecycleBaselineHours * month / 12
    const centralizedHours = row.initialSharedHours + row.lifecycleSharedHours * month / 12
    return { month, distributedHours, centralizedHours,
      distributed: distributedHours * model.hourlyRate,
      centralized: centralizedHours * model.hourlyRate }
  })
  // Updates are discrete monthly work, not continuously accruing effort.
  const steps = points.flatMap((point, index) => index
    ? [{ ...points[index - 1], month: point.month }, point]
    : [point])
  const last = points.at(-1)
  const saved = last.distributed - last.centralized
  const savedHours = row.initialBaselineHours - row.initialSharedHours
    + (row.lifecycleBaselineHours - row.lifecycleSharedHours) * months / 12
  return { scenario: row, points, steps, months, saved, savedHours }
}

const light = { ink: '#16182b', muted: '#5f6475', grid: '#dce0e8', central: '#087b6a', distributed: '#5b5bd6', emphasis: '#9d5410' }
const escape = value => String(value).replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const text = (x, y, value, size = 25, color, extra = '') => `<text x="${x}" y="${y}" fill="${color}" style="font-size:${size}px" ${extra}>${escape(value)}</text>`
const path = (points, x, y) => points.map(([a, b], i) => `${i ? 'L' : 'M'}${x(a).toFixed(2)},${y(b).toFixed(2)}`).join(' ')
const svg = (label, body, p) => `<svg viewBox="0 0 1152 470" role="img" aria-label="${escape(label)}" xmlns="http://www.w3.org/2000/svg" style="font-family:DejaVu Sans,sans-serif;color:${p.ink}">${body}</svg>`

function renderAdoptionChart(palette = {}) {
  const p = { ...light, ...palette }, x = t => 95 + t * 8.45, y = percent => 390 - percent * 2.9
  let body = text(95, 33, 'Eligible services covered', 25, p.muted)
  for (const value of [0, 50, 100]) {
    body += `<path d="M95 ${y(value)}H940" stroke="${p.grid}" stroke-width="1.5"/>`
    body += text(76, y(value) + 8, value + '%', 24, p.muted, 'text-anchor="end"')
  }
  body += `<path d="M95 100V390H940" fill="none" stroke="${p.muted}" stroke-width="1.5"/>`
  body += `<path data-adoption-series="centralized" d="${path(adoptionPaths.centralized, x, y)}" fill="none" stroke="${p.central}" stroke-width="5"/>`
  body += `<path data-adoption-series="distributed" d="${path(adoptionPaths.distributed, x, y)}" fill="none" stroke="${p.distributed}" stroke-width="5"/>`
  body += text(315, 82, 'Centralized control', 29, p.central)
  body += text(957, 229, 'Team-by-team', 25, p.distributed)
  body += text(420, 330, 'New services', 23, p.muted)+text(760, 330, 'Language rewrite', 23, p.muted)
  body += `<path d="M570 310L${x(65)} ${y(59) + 10}" fill="none" stroke="${p.muted}" stroke-width="1.5"/>`
  body += `<path d="M820 310L${x(87)} ${y(58) + 10}" fill="none" stroke="${p.muted}" stroke-width="1.5"/>`
  body += text(517.5, 430, 'time', 24, p.muted, 'text-anchor="middle"')
  return svg('Eligible service coverage over time: centralized rollout reaches full coverage; team-by-team adoption has a long tail and can lose coverage as services change.', body, p)
}

function renderCostChart(model, palette = {}) {
  const p = { ...light, ...palette }, data = costTimeline(model)
  const last = data.points.at(-1)
  const shortMoney = value => '$' + (value >= 1000000 ? (value / 1000000).toFixed(2) + 'M' : value.toLocaleString('en-US'))
  const x = month => 125 + month / data.months * 560
  const y = hours => 390 - hours / 300 * 320
  let body = ''
  for (const value of [0, 150, 300]) {
    body += `<path d="M125 ${y(value)}H685" stroke="${p.grid}" stroke-width="1.5"/>`
    body += text(110, y(value) + 8, value + ' h', 24, p.muted, 'text-anchor="end"')
  }
  body += `<path d="M125 70V390H685" fill="none" stroke="${p.muted}" stroke-width="1.5"/>`
  for (const month of [0, 6, 12, 18, 24]) body += text(x(month), 428, month, 24, p.muted, 'text-anchor="middle"')
  body += text(405, 462, 'Months', 23, p.muted, 'text-anchor="middle"')
  for (const [key, color] of [['distributed', p.distributed], ['centralized', p.central]]) {
    body += `<path data-cost-series="${key}" d="${path(data.steps.map(row => [row.month, row[key + 'Hours']]), x, y)}" fill="none" stroke="${color}" stroke-width="5"/>`
  }
  body += text(711, 78, 'Distributed ownership', 26, p.distributed)
  body += text(711, 113, last.distributedHours.toLocaleString('en-US') + ' hours', 24, p.distributed)
  body += text(711, 385, 'Centralized control', 26, p.central)
  body += text(711, 420, last.centralizedHours.toLocaleString('en-US') + ' hours', 24, p.central)
  body += text(800, 213, data.savedHours.toLocaleString('en-US') + ' hours', 64, p.emphasis, 'font-weight="600" letter-spacing="-2" data-capacity-hours="' + data.savedHours + '"')
  body += text(807, 263, 'freed over two years', 25, p.ink)
  body += text(807, 310, shortMoney(data.saved) + ' at $' + model.hourlyRate.toLocaleString('en-US') + '/hour', 24, p.muted)
  return svg('Cumulative instrumentation hours for the 18-service demo, stepping up with each monthly update over 24 months: distributed ownership takes 266.5 hours; centralized control takes 19.5 hours. This frees 247 engineering hours, valued at $24,700 at $100 per hour.', body, p)
}

const model = {"version":"2026-10-27-monthly-centralized-ownership","currency":"USD","label":"Illustrative labor-capacity model; not measured savings or an industry average","hourlyRate":100,"runtimeMix":{"eligible":14,"total":18},"pilotServices":1,"perService":{"initialBaselineHours":2.5,"changesPerYear":12,"changeBaselineHours":0.75,"exceptionHours":0.5},"scenarios":[{"label":"Demo","services":18,"domains":1,"exceptionsPerChange":0},{"label":"100 services","services":100,"domains":2,"exceptionsPerChange":0},{"label":"500 services","services":500,"domains":5,"exceptionsPerChange":0},{"label":"1,000 services","services":1000,"domains":10,"exceptionsPerChange":0}],"sources":[{"url":"https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm","fact":"May 2025 U.S. software-developer median wage: $135,980 per year. Checked October 26, 2026."},{"url":"https://www.bls.gov/opub/ted/2026/compensation-costs-for-private-industry-workers-averaged-46-89-per-hour-worked-in-june-2026.htm","fact":"June 2026 private-industry wages were 70.0% of total employer compensation; this is a broad workforce ratio, not a developer-specific estimate."},{"url":"https://sre.google/workbook/eliminating-toil/","fact":"Compare automation's implementation and maintenance effort with the repetitive work it removes."}],"scope":"One year; distributed responsibility for instrumentation versus centralized injector/operator. Fourteen of eighteen demo services support the payload; exclude one common direct pilot. Initial centralized enrollment is one policy operation per independent rollout domain, with no per-service setup allowance. OBI deployment is a one-time 30-minute planning assumption supplied by the presenter, not a measured result. Agent releases occur monthly (12/year); each distributed service owner performs one update, while the centralized platform performs one shared update per domain. Shared release qualification common to both approaches cancels; any different compatibility or exception effort must be entered separately. All labor durations and domain counts are hypothetical planning inputs. No per-investigation saving is credited once equivalent instrumentation exists. No telemetry-volume, dynamic enable/disable, waiting-time, outage-revenue or cash-saving credit is assumed. RIO is a talk-specific demo; prototype development/hardening and extra support/telemetry costs need explicit estimates.","baseline":{"initialPerDomainHours":0,"changePerDomainHours":0},"shared":{"obiSetupPerDomainHours":0.5,"initialPerDomainHours":1,"changePerDomainHours":0.75}};
window.renderRolloutChart = (kind, palette) => kind === 'adoption' ? renderAdoptionChart(palette) : renderCostChart(model, palette);
})();
