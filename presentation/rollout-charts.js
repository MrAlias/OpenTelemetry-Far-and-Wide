import { calculateSavings } from './savings-model.js'

// Conceptual adoption paths, not observed rollout data or a duration forecast.
// The denominator is eligible workloads within the selected policy scope.
export const adoptionPaths = {
  centralized: [[0, 0], [12, 0], [12, 100], [100, 100]],
  distributed: [[0, 0], [8, 0], [8, 18], [20, 18], [20, 38], [35, 38], [35, 54], [50, 54], [50, 68], [65, 68], [65, 59], [78, 59], [78, 72], [100, 72]],
}

export function costTimeline(model, scenario = model.scenarios.at(-1), months = 24) {
  const row = calculateSavings(model, scenario)
  const points = Array.from({ length: months + 1 }, (_, month) => ({
    month,
    distributed: (row.initialBaselineHours + row.lifecycleBaselineHours * month / 12) * model.hourlyRate,
    centralized: (row.initialSharedHours + row.lifecycleSharedHours * month / 12) * model.hourlyRate,
  }))
  const last = points.at(-1)
  return { scenario: row, points, months, saved: last.distributed - last.centralized }
}

const light = { ink: '#16182b', muted: '#5f6475', grid: '#dce0e8', central: '#087b6a', distributed: '#5b5bd6', emphasis: '#9d5410' }
const escape = value => String(value).replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const text = (x, y, value, size = 25, color, extra = '') => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${extra}>${escape(value)}</text>`
const path = (points, x, y) => points.map(([a, b], i) => `${i ? 'L' : 'M'}${x(a).toFixed(2)},${y(b).toFixed(2)}`).join(' ')
const svg = (label, body, p) => `<svg viewBox="0 0 1152 470" role="img" aria-label="${escape(label)}" xmlns="http://www.w3.org/2000/svg" style="font-family:DejaVu Sans,sans-serif;color:${p.ink}">${body}</svg>`

export function renderAdoptionChart(palette = {}) {
  const p = { ...light, ...palette }, x = t => 95 + t * 8.45, y = percent => 390 - percent * 2.9
  let body = text(95, 33, 'Eligible services covered', 25, p.muted)
  for (const value of [0, 50, 100]) {
    body += `<path d="M95 ${y(value)}H940" stroke="${p.grid}" stroke-width="1.5"/>`
    body += text(76, y(value) + 8, value + '%', 24, p.muted, 'text-anchor="end"')
  }
  body += `<path d="M95 100V390H940" fill="none" stroke="${p.muted}" stroke-width="1.5"/>`
  body += `<path data-adoption-series="centralized" d="${path(adoptionPaths.centralized, x, y)}" fill="none" stroke="${p.central}" stroke-width="5"/>`
  body += `<path data-adoption-series="distributed" d="${path(adoptionPaths.distributed, x, y)}" fill="none" stroke="${p.distributed}" stroke-width="5" stroke-dasharray="12 6"/>`
  body += text(315, 82, 'Centralized control', 29, p.central)
  body += text(315, 127, 'One rollout; new services inherit the policy', 23, p.central)
  body += text(957, 189, 'Team-by-team', 25, p.distributed)
  body += text(566, 320, 'New services can reopen the gap', 23, p.muted)
  body += `<path d="M672 301L${x(65)} ${y(59) + 10}" fill="none" stroke="${p.muted}" stroke-width="1.5"/>`
  body += text(95, 430, 'Start', 24, p.muted)
  body += text(940, 430, 'Over time →', 24, p.muted, 'text-anchor="end"')
  return svg('Eligible service coverage over time: centralized rollout reaches full coverage; team-by-team adoption has a long tail and can lose coverage as services change.', body, p)
}

export function renderCostChart(model, palette = {}) {
  const p = { ...light, ...palette }, data = costTimeline(model)
  const last = data.points.at(-1)
  const shortMoney = value => '$' + (value >= 1000000 ? (value / 1000000).toFixed(2) + 'M' : (value / 1000).toFixed(1) + 'k')
  const x = month => 125 + month / data.months * 560
  const y = dollars => 390 - dollars / 1600000 * 320
  let body = text(125, 33, 'Cumulative instrumentation labor', 25, p.muted)
  for (const value of [0, 800000, 1600000]) {
    body += `<path d="M125 ${y(value)}H685" stroke="${p.grid}" stroke-width="1.5"/>`
    body += text(110, y(value) + 8, value ? '$' + (value / 1000000).toFixed(1) + 'M' : '$0', 24, p.muted, 'text-anchor="end"')
  }
  body += `<path d="M125 70V390H685" fill="none" stroke="${p.muted}" stroke-width="1.5"/>`
  for (const month of [0, 6, 12, 18, 24]) body += text(x(month), 428, month, 24, p.muted, 'text-anchor="middle"')
  body += text(405, 462, 'Months', 23, p.muted, 'text-anchor="middle"')
  for (const [key, color] of [['distributed', p.distributed], ['centralized', p.central]]) {
    body += `<path data-cost-series="${key}" d="${path(data.points.map(row => [row.month, row[key]]), x, y)}" fill="none" stroke="${color}" stroke-width="5" ${key === 'distributed' ? 'stroke-dasharray="12 6"' : ''}/>`
  }
  body += text(711, 78, 'Distributed ownership', 26, p.distributed)
  body += text(711, 113, shortMoney(last.distributed), 24, p.distributed)
  body += text(711, 385, 'Centralized control', 26, p.central)
  body += text(711, 420, shortMoney(last.centralized), 24, p.central)
  body += text(800, 213, '$' + (data.saved / 1000000).toFixed(2) + 'M', 79, p.emphasis, 'font-weight="600" letter-spacing="-3" data-capacity-saved="' + data.saved + '"')
  body += text(807, 258, 'Engineering capacity', 25, p.ink)
  body += text(807, 293, 'freed over two years', 25, p.ink)
  return svg('Cumulative instrumentation labor for 1,000 services over 24 months: distributed ownership costs $1,590,800; centralized control costs $19,500, a difference of $1,571,300 in engineering capacity.', body, p)
}
