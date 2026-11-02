// Validate the recorded timeout and package native dashboard screenshot views.
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
const root = new URL('../../', import.meta.url)
const source = 'public/demo-capture/java-trace-evidence.json'
const trace = JSON.parse(await readFile(new URL(source, root)))
const spans = trace.batches.flatMap(b => b.scopeSpans.flatMap(s => s.spans))
const attributes = (list = []) => Object.fromEntries(list.map(a => [a.key, Object.values(a.value)[0]]))
const failed = spans.filter(s => attributes(s.attributes)['error.type'] === 'java.net.SocketTimeoutException')
assert.equal(failed.length, 1)
const span = failed[0]
const event = span.events.find(e => e.name === 'exception')
const attrs = attributes(span.attributes), exception = attributes(event.attributes)
const resource = trace.batches.find(batch => batch.scopeSpans.some(group => group.spans.includes(span))).resource
const environmentKey = 'process.environment_variable.LEGACY_PRICING_URL'
const environmentValue = attributes(resource.attributes)[environmentKey]
assert.equal(environmentValue, attrs['url.full'], 'Captured setting must match the failed destination')
assert.equal(exception['exception.message'], 'Connect timed out')
assert.equal(exception['exception.type'], attrs['error.type'])
assert.equal(span.status.code, 'STATUS_CODE_ERROR')
const data = {
  source, traceId: Buffer.from(span.traceId, 'base64').toString('hex'),
  spanId: Buffer.from(span.spanId, 'base64').toString('hex'),
  name: span.name, durationMs: Number(BigInt(span.endTimeUnixNano) - BigInt(span.startTimeUnixNano)) / 1e6,
  errorType: attrs['error.type'], url: attrs['url.full'],
  exceptionType: exception['exception.type'], exceptionMessage: exception['exception.message'],
  environmentKey, environmentValue,
  provenance: 'Literal fields from the captured HTTP client span and its exception event. The screenshot shows the same span.'
}
await writeFile(new URL('presentation/data/timeout-evidence.json', root), JSON.stringify(data, null, 2) + '\n')
const captures = JSON.parse(await readFile(new URL('presentation/data/attribute-captures.json', root)))
assert.equal(captures.traceId, data.traceId)
assert.equal(captures.spanId, data.spanId)
for (const capture of [captures.timeout, captures.configuration]) {
  for (const folder of ['public/demo-capture/', 'public/presentation/images/']) {
    const png = await readFile(new URL(folder + capture.image, root))
    assert.equal(createHash('sha256').update(png).digest('hex'), capture.sha256)
    assert.equal(png.readUInt32BE(16), capture.width * capture.deviceScaleFactor)
    assert.equal(png.readUInt32BE(20), capture.height * capture.deviceScaleFactor)
  }
}
await writeFile(new URL('public/animation/timeout-data.js', root),
  'window.TIMEOUT_EVIDENCE = ' + JSON.stringify(data, null, 2) + ';\n'
  + 'window.ATTRIBUTE_CAPTURES = ' + JSON.stringify(captures, null, 2) + ';\n')
console.log(`Captured timeout: ${data.durationMs.toFixed(2)} ms; ${data.errorType}; ${data.exceptionMessage}`)
