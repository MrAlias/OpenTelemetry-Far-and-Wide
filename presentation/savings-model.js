// Compare complete work ledgers. Every activity is charged once to its workflow.
export function calculateSavings(model, scenario) {
  const nonnegative = (v, name) => {
    if (!Number.isFinite(v) || v < 0) throw new Error(`${name} must be a nonnegative number`)
    return v
  }
  const integer = (v, name) => {
    nonnegative(v, name)
    if (!Number.isInteger(v)) throw new Error(`${name} must be a whole number`)
    return v
  }
  const services = integer(scenario.services, 'Services')
  const domains = integer(scenario.domains, 'Rollout domains')
  if (!services || !domains) throw new Error('Services and rollout domains must be positive')
  if (model.runtimeMix.total <= 0 || model.runtimeMix.eligible < 0 || model.runtimeMix.eligible > model.runtimeMix.total) throw new Error('Invalid supported-runtime mix')
  const eligible = integer(scenario.eligibleServices ?? Math.floor(services * model.runtimeMix.eligible / model.runtimeMix.total), 'Eligible services')
  if (eligible > services) throw new Error('Eligible services cannot exceed the fleet')
  const remaining = eligible - Math.min(eligible, integer(model.pilotServices, 'Common pilot services'))
  const p = model.perService, shared = model.shared, baseline = model.baseline
  for (const group of [p, shared, baseline]) for (const [name, value] of Object.entries(group)) nonnegative(value, name)
  integer(p.changesPerYear, 'Changes per year')
  const rate = nonnegative(model.hourlyRate, 'Hourly rate')
  const exceptions = integer(scenario.exceptionsPerChange, 'Exception services per change')
  if (exceptions > remaining) throw new Error('Exception services cannot exceed the remaining eligible services')
  const extraSetup = nonnegative(scenario.extraSetupHours ?? 0, 'Additional initial work')
  const extraAnnual = nonnegative(scenario.extraAnnualHours ?? 0, 'Additional annual work')
  const sharedSetupHours = domains * (shared.initialPerDomainHours + shared.obiSetupPerDomainHours)
  const sharedUpdateHours = domains * p.changesPerYear * shared.changePerDomainHours
  const exceptionHours = exceptions * p.changesPerYear * p.exceptionHours
  const initialBaselineHours = remaining * p.initialBaselineHours + domains * baseline.initialPerDomainHours
  const initialSharedHours = sharedSetupHours + extraSetup
  const lifecycleBaselineHours = p.changesPerYear * (remaining * p.changeBaselineHours + domains * baseline.changePerDomainHours)
  const lifecycleSharedHours = sharedUpdateHours + exceptionHours + extraAnnual
  const initialHours = initialBaselineHours - initialSharedHours
  const lifecycleHours = lifecycleBaselineHours - lifecycleSharedHours
  const baselineHours = initialBaselineHours + lifecycleBaselineHours
  const sharedHours = initialSharedHours + lifecycleSharedHours
  const firstYearHours = baselineHours - sharedHours
  const recurringHours = lifecycleHours
  const additionalAnnualCost = nonnegative(scenario.additionalAnnualCost ?? 0, 'Additional annual non-labor cost')
  return {...scenario, eligible, remaining, distributedUpdatesPerMonth: remaining, centralizedUpdatesPerMonth: domains, distributedAnnualUpdates: remaining * p.changesPerYear, centralizedAnnualUpdates: domains * p.changesPerYear, initialBaselineHours, initialSharedHours, lifecycleBaselineHours, lifecycleSharedHours,
    sharedSetupHours, sharedUpdateHours, exceptionHours,
    initialHours, lifecycleHours, baselineHours, sharedHours, firstYearHours, recurringHours,
    firstYearValue: firstYearHours * rate, recurringValue: recurringHours * rate,
    firstYearAfterAdditionalCosts: firstYearHours * rate - additionalAnnualCost,
    recurringAfterAdditionalCosts: recurringHours * rate - additionalAnnualCost}
}
