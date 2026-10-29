// Independently check ownership, monthly update frequency and accounting.
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {calculateSavings} from '../../presentation/savings-model.js'
import {costTimeline, adoptionPaths} from '../../presentation/rollout-charts.js'
const original=JSON.parse(await readFile(new URL('../../presentation/data/savings-assumptions.json',import.meta.url)))
const calc=(edit=()=>{},scenario={})=>{const m=structuredClone(original);edit(m);return calculateSavings(m,{...m.scenarios[0],...scenario})}
const d=calc()
assert.deepEqual([d.initialBaselineHours,d.initialSharedHours,d.lifecycleBaselineHours,d.lifecycleSharedHours],[32.5,1.5,117,9])
assert.deepEqual([d.distributedUpdatesPerMonth,d.centralizedUpdatesPerMonth,d.distributedAnnualUpdates,d.centralizedAnnualUpdates],[13,1,156,12])
assert.deepEqual([d.firstYearHours,d.recurringHours,d.firstYearValue,d.recurringValue],[139,108,13900,10800])
assert(!Object.keys(d).some(key=>key.startsWith('investigation')))
assert.deepEqual(original.scenarios.map(s=>{const r=calculateSavings(original,s);return[r.firstYearValue,r.recurringValue]}),[[13900,10800],[85300,66600],[439800,343800],[881900,689400]])
// Central setup and updates do not grow when another compatible service arrives.
const more=calc(()=>{},{services:19,eligibleServices:15})
assert.equal(more.initialSharedHours,d.initialSharedHours);assert.equal(more.lifecycleSharedHours,d.lifecycleSharedHours)
assert.equal(more.firstYearHours-d.firstYearHours,11.5)
// A quarterly cadence changes both workflows to four releases, once each.
assert.equal(calc(m=>{m.perService.changesPerYear=4}).recurringHours,36)
// An equivalent already-centralized baseline saves zero.
const equal=calc(m=>{m.perService.initialBaselineHours=0;m.perService.changeBaselineHours=0;m.baseline.initialPerDomainHours=1.5;m.baseline.changePerDomainHours=.75})
assert.equal(equal.firstYearValue,0);assert.equal(equal.recurringValue,0)
assert.equal(calc(m=>{m.hourlyRate=200}).firstYearValue,27800)
assert.equal(calc(()=>{},{extraSetupHours:160}).firstYearValue,-2100)
assert.equal(calc(()=>{},{extraAnnualHours:10}).recurringValue,9800)
assert.equal(calc(()=>{},{additionalAnnualCost:2000}).firstYearAfterAdditionalCosts,11900)
assert.equal(calc(()=>{},{exceptionsPerChange:1}).recurringValue,10200)
for(const scenario of original.scenarios){const r=calculateSavings(original,scenario);assert.equal(r.firstYearHours,r.baselineHours-r.sharedHours);assert.equal(r.firstYearHours-r.recurringHours,r.initialHours)}
assert.throws(()=>calc(()=>{},{eligibleServices:19}),/exceed/)
assert.throws(()=>calc(()=>{},{exceptionsPerChange:14}),/Exception/)
assert.throws(()=>calc(m=>{m.shared.changePerDomainHours=-1}),/nonnegative/)
const timeline=costTimeline(original), yearOne=timeline.points[12], yearTwo=timeline.points[24]
assert.equal(yearOne.distributed-yearOne.centralized,13900)
assert.deepEqual([yearTwo.distributed,yearTwo.centralized,timeline.saved],[26650,1950,24700])
assert.equal(timeline.saved,13900+10800)
assert.equal(adoptionPaths.centralized.at(-1)[1],100)
assert.deepEqual(adoptionPaths.centralized[2],[2,100])
assert(adoptionPaths.centralized[2][0]<adoptionPaths.distributed.find(p=>p[1]>0)[0])
assert(adoptionPaths.distributed.some((p,i,a)=>i&&p[1]<a[i-1][1]))
console.log('Savings verified: one central setup, 12 monthly releases, 156 versus 12 update operations, no investigation credit, centralized baseline and negative outcomes.')
