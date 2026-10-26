import { readFile, writeFile, copyFile } from 'node:fs/promises'
import { calculateSavings } from '../../presentation/savings-model.js'

const model = JSON.parse(await readFile(new URL('../../presentation/data/savings-assumptions.json', import.meta.url)))
const rows = model.scenarios.map(s => calculateSavings(model, s))
const result = { version: model.version, label: model.label, currency: model.currency, hourlyRate: model.hourlyRate, rows }
const out = new URL('../../public/presentation/', import.meta.url)
await writeFile(new URL('savings-results.json', out), JSON.stringify(result, null, 2) + '\n')
await copyFile(new URL('../../presentation/data/savings-assumptions.json', import.meta.url), new URL('savings-assumptions.json', out))
await copyFile(new URL('../../presentation/savings-model.js', import.meta.url), new URL('savings-model.js', out))
await writeFile(new URL('../../public/animation/savings-data.js', import.meta.url), 'window.SAVINGS = ' + JSON.stringify(result, null, 2) + ';\n')
for (const row of rows) console.log(`${row.services} services; ${row.remaining} remaining eligible; first year $${row.firstYearValue.toLocaleString('en-US')}; recurring $${row.recurringValue.toLocaleString('en-US')}`)
