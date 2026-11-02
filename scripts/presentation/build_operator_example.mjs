// Share the upstream-only worked example with the portable review artwork.
import assert from 'node:assert/strict'
import {readFile, writeFile} from 'node:fs/promises'
const root = new URL('../../', import.meta.url)
const example = JSON.parse(await readFile(new URL('presentation/data/operator-complexity.json', root)))
assert.equal(example.scope, 'Upstream OpenTelemetry Operator')
assert.equal(example.steps.length, 6)
assert.equal(example.annotations.length, 6)
assert(example.annotations.every(row => Number.isInteger(row.at) && row.at >= 0 && row.at < 3))
await writeFile(new URL('public/animation/operator-data.js', root),
  '// Generated from presentation/data/operator-complexity.json.\nwindow.OPERATOR_CONFIGURATION = '+JSON.stringify(example,null,2)+';\n')
console.log('Prepared the upstream Operator example and its six presentation states.')
