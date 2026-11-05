import { calculateSavings } from './savings-model.js'

// Conceptual adoption paths, not observed rollout data or a duration forecast.
// The denominator is eligible workloads within the selected policy scope.
export const adoptionPaths = {
  centralized: [[0, 0], [2, 0], [2, 100], [100, 100]],
  distributed: [[0, 0], [8, 0], [8, 18], [20, 18], [20, 38], [35, 38], [35, 54], [50, 54], [50, 68], [65, 68], [65, 59], [78, 59], [78, 72], [87, 72], [87, 58], [100, 58]],
}

export function costTimeline(model, scenario = model.scenarios[0], months = 24) {
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

export function renderAdoptionChart(palette = {}) {
  const p = { ...light, ...palette }, x = t => 95 + t * 8.45, y = percent => 390 - percent * 2.9
  let body = text(95, 33, 'Language-agent adoption', 25, p.muted)
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
  return svg('Language-agent adoption among eligible services over time: centralized rollout reaches full coverage; team-by-team adoption has a long tail and can lose coverage as services change.', body, p)
}

export function renderCostChart(model, palette = {}) {
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
