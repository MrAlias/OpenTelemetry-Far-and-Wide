// Shared arithmetic for the slides, recorded review and editable calculator.
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
  const p = model.perService, platform = model.platform, triage = model.investigation
  for (const [name, value] of Object.entries({...p, ...platform, ...triage})) nonnegative(value, name)
  const rate = nonnegative(model.hourlyRate, 'Hourly rate')
  const cases = integer(scenario.qualifyingInvestigations, 'Qualifying investigations')
  const initialSaved = p.initialBaselineHours - p.initialAssistedHours
  const changeSaved = p.changeBaselineHours - p.changeAssistedHours
  const initialHours = remaining * initialSaved
  const lifecycleHours = remaining * p.changesPerYear * changeSaved
  const investigationHours = cases * (triage.peopleBefore - triage.peopleAfter) * triage.minutes / 60
  const extraSetup = nonnegative(scenario.extraSetupHours ?? 0, 'Extra adoption or prototype-hardening hours')
  const extraAnnual = nonnegative(scenario.extraAnnualHours ?? 0, 'Extra annual platform hours')
  const setupHours = platform.setupHours + (domains - 1) * platform.setupPerExtraDomainHours + extraSetup
  const upkeepHours = platform.annualMaintenanceHours + (domains - 1) * platform.annualPerExtraDomainHours + extraAnnual
  const firstYearHours = initialHours + lifecycleHours + investigationHours - setupHours - upkeepHours
  const recurringHours = lifecycleHours + investigationHours - upkeepHours
  const additionalAnnualCost = nonnegative(scenario.additionalAnnualCost ?? 0, 'Additional annual non-labor cost')
  return {...scenario, eligible, remaining, initialHours, lifecycleHours, investigationHours, setupHours, upkeepHours,
    firstYearHours, recurringHours, firstYearValue: firstYearHours * rate, recurringValue: recurringHours * rate,
    firstYearAfterAdditionalCosts: firstYearHours * rate - additionalAnnualCost,
    recurringAfterAdditionalCosts: recurringHours * rate - additionalAnnualCost}
}
