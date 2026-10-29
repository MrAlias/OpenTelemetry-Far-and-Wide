// Package the same reviewed chart renderer for the standalone review player.
import { readFile, writeFile } from 'node:fs/promises'
const model = JSON.parse(await readFile('presentation/data/savings-assumptions.json', 'utf8'))
const calculator = (await readFile('presentation/savings-model.js', 'utf8')).replaceAll('export function ', 'function ')
const charts = (await readFile('presentation/rollout-charts.js', 'utf8')).replace(/^import[^\n]+\n/, '').replaceAll('export function ', 'function ').replaceAll('export const ', 'const ')
await writeFile('public/animation/rollout-charts.js', `// Generated from presentation/rollout-charts.js; do not edit.\n(() => {\n${calculator}\n${charts}\nconst model = ${JSON.stringify(model)};\nwindow.renderRolloutChart = (kind, palette) => kind === 'adoption' ? renderAdoptionChart(palette) : renderCostChart(model, palette);\n})();\n`)
console.log('Packaged the shared adoption and cost renderer for the review player')
