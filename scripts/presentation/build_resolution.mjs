// Publish measured resolution evidence to the native deck and narrated review.
import { readFile, writeFile, copyFile } from 'node:fs/promises'
const input = new URL('../../presentation/data/resolution.json', import.meta.url)
const data = JSON.parse(await readFile(input))
for (const phase of ['before','after']) {
  const d = data[phase]
  if (d.samples.length !== d.sampleCount || d.samples.some(s => s.status !== 200 || s.price !== 42)) throw Error('Unvalidated request samples')
  const median = values => { const x = values.toSorted((a,b)=>a-b); return (x[Math.floor((x.length-1)/2)]+x[Math.ceil((x.length-1)/2)])/2 }
  for (const [field,key] of [['requestMs','requestMedianMs'],['pricingMs','pricingMedianMs']]) if (Math.abs(median(d.samples.map(s=>s[field]))-d[key])>1e-6) throw Error('Summary differs from actual samples')
}
if (!data.controls.sameInstrumentation || data.after.requestMedianMs >= data.before.requestMedianMs) throw Error('No matched customer resolution')
await copyFile(input,new URL('../../public/presentation/resolution.json',import.meta.url))
await writeFile(new URL('../../public/animation/resolution-data.js',import.meta.url),'window.RESOLUTION = '+JSON.stringify(data,null,2)+';\n')
console.log(`Measured customer result: ${data.before.requestMedianMs.toFixed(1)} → ${data.after.requestMedianMs.toFixed(1)} ms; ${data.before.sampleCount} requests/version`)
