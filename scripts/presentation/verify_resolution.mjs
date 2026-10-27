// Check measured evidence, independently recomputing summaries and story controls.
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const root = new URL('../../', import.meta.url)
const data = JSON.parse(await readFile(new URL('presentation/data/resolution.json', root)))
const median = list => { const x=[...list].sort((a,b)=>a-b); return (x[14]+x[15])/2 }
const ids = new Set()
for (const phase of ['before','after']) {
  const p=data[phase]
  assert.equal(p.sampleCount,30);assert.equal(p.warmupCount,20);assert.equal(p.samples.length,30)
  for (const s of p.samples) {
    assert.equal(s.status,200);assert.equal(s.price,42)
    assert.match(s.traceId,/^[a-f0-9]{32}$/);assert(!ids.has(s.traceId));ids.add(s.traceId)
    assert(Number.isFinite(s.requestMs)&&s.requestMs>0)
    assert(Number.isFinite(s.pricingMs)&&s.pricingMs>=0&&s.pricingMs<s.requestMs)
  }
  assert.equal(p.requestMedianMs,median(p.samples.map(s=>s.requestMs)))
  assert.equal(p.pricingMedianMs,median(p.samples.map(s=>s.pricingMs)))
  assert(p.samples.some(s=>s.traceId===p.exemplarTraceId&&s.requestMs===p.exemplarRequestMs))
}
assert(data.controls.sameInstrumentation&&data.controls.fullResponseFlowValidated)
assert(data.controls.noConcurrentBuildRecordingOrNarration)
assert.deepEqual(data.controls.sdkServices,['checkout'])
assert.equal(data.controls.applicationServices,18)
assert.equal(data.controls.concurrency,1)
assert(data.before.requestMedianMs>data.after.requestMedianMs)
assert(data.before.pricingMedianMs>=150&&data.after.pricingMedianMs<1)
const baseline=await readFile(new URL('demo/proof/apps/checkout/PricingEngine.java',root),'utf8')
const fixed=await readFile(new URL('demo/apps/checkout/fixes/PricingEngine.java',root),'utf8')
assert(baseline.includes('Thread.sleep(150)'))
assert(!fixed.includes('Thread.sleep'))
assert(baseline.includes('return 42;')&&fixed.includes('return 42;'))
const patch=await readFile(new URL('demo/k8s/checkout-pricing-fixed.patch.yaml',root),'utf8')
assert(patch.includes('far-wide-demo-checkout:pricing-fixed'))
assert(!patch.includes('OTEL_')&&!patch.includes('JAVA_TOOL_OPTIONS'))
const talk=JSON.parse(await readFile(new URL('scripts/animation/talk.json',root)))
const index=id=>talk.chapters.findIndex(c=>c.id===id)
assert(index('08-new-detail')<index('08-fix-pricing'))
assert(index('08-fix-pricing')<index('08-customer-result'))
assert(index('08-customer-result')<index('09-the-rest'))
assert.equal(talk.chapters.reduce((sum,c)=>sum+c.plannedDuration,0),1260)
assert(!JSON.stringify(talk).includes('RESULT_PENDING'))
assert.equal(data.fleetAfterFix.sdkServices.length,14)
assert.equal(data.fleetAfterFix.obiOnlyServices.length,4)
assert(data.fleetAfterFix.pricingMs<1)
assert(data.fleetAfterFix.catalogDatabaseSpans.some(n=>n.includes('products')))
assert.equal(data.fleetAfterFix.price,42)
console.log('Customer resolution verified: 60 successful matched requests, unchanged instrumentation, deliberate wait removed, and complete story sequence.')
