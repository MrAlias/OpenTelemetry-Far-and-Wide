// Independent worked examples and accounting invariants for the economic model.
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { calculateSavings } from '../../presentation/savings-model.js'
const original = JSON.parse(await readFile(new URL('../../presentation/data/savings-assumptions.json', import.meta.url)))
const calculate = (mutate = () => {}, scenario = {}) => {
  const model = structuredClone(original)
  mutate(model)
  return calculateSavings(model, {...model.scenarios[0], ...scenario})
}
const demo = calculate()
assert.deepEqual([demo.initialBaselineHours, demo.initialSharedHours, demo.lifecycleBaselineHours, demo.lifecycleSharedHours, demo.investigationBaselineHours, demo.investigationSharedHours], [32.5, 8.5, 39, 6, 18, 6])
assert.deepEqual([demo.baselineHours, demo.sharedHours, demo.firstYearHours, demo.recurringHours], [89.5, 20.5, 69, 45])
assert.deepEqual(original.scenarios.map(s => {
  const r = calculateSavings(original, s)
  return [r.firstYearValue, r.recurringValue]
}), [[6900, 4500], [38400, 23600], [192500, 116100], [386000, 232800]])
assert.equal(calculate(() => {}, {qualifyingInvestigations: 0}).firstYearValue, 5700)
assert.equal(calculate(m => {m.shared.changePerDomainHours = 2}).firstYearValue, 6500)
assert.equal(calculate(() => {}, {exceptionsPerChange: 13}).firstYearValue, 4500)
assert.equal(calculate(m => {m.perService.initialBaselineHours = 1; m.perService.changeBaselineHours = .25}).firstYearValue, 2350)
assert.equal(calculate(() => {}, {extraSetupHours: 80}).firstYearValue, -1100)
assert.equal(calculate(() => {}, {extraSetupHours: 80}).recurringValue, 4500)
assert.equal(calculate(() => {}, {extraAnnualHours: 10}).firstYearValue, 5900)
assert.equal(calculate(() => {}, {extraAnnualHours: 10}).recurringValue, 3500)
assert.equal(calculate(() => {}, {additionalAnnualCost: 2000}).firstYearAfterAdditionalCosts, 4900)
assert.equal(calculate(m => {m.hourlyRate = 200}).firstYearValue, 13800)
// A capable, already centralized baseline with equally useful traces saves zero.
const equal = calculate(m => {
  m.perService.initialBaselineHours = m.perService.initialSharedHours
  m.baseline.initialPerDomainHours = m.shared.initialPerDomainHours
  m.perService.changeBaselineHours = 0
  m.baseline.changePerDomainHours = 1.5 // Same one shared hour + half-hour exception.
}, {qualifyingInvestigations: 0})
assert.equal(equal.firstYearValue, 0)
assert.equal(equal.recurringValue, 0)
// Moving routine work to another service does not duplicate the shared update.
const larger = calculate(() => {}, {services: 19, eligibleServices: 15})
assert.equal(larger.sharedUpdateHours, demo.sharedUpdateHours)
assert.equal(larger.exceptionHours, demo.exceptionHours)
assert.equal(larger.firstYearHours - demo.firstYearHours, 5) // 2 initial + 3 distributed upkeep.
for (const s of original.scenarios) {
  const r = calculateSavings(original, s)
  assert.equal(r.firstYearHours, r.baselineHours - r.sharedHours)
  assert.equal(r.firstYearHours - r.recurringHours, r.initialHours)
  assert.equal(r.lifecycleSharedHours, r.sharedUpdateHours + r.exceptionHours)
}
assert.throws(() => calculate(() => {}, {eligibleServices: 19}), /exceed/)
assert.throws(() => calculate(() => {}, {exceptionsPerChange: 14}), /Exception/)
assert.throws(() => calculate(() => {}, {exceptionsPerChange: .5}), /whole/)
assert.throws(() => calculate(m => {m.shared.changePerDomainHours = -1}), /nonnegative/)
assert.throws(() => calculate(m => {m.hourlyRate = NaN}), /nonnegative/)
console.log('Savings verified: ledgers, scale, centralized baseline, exceptions, sensitivity and cost accounting.')
