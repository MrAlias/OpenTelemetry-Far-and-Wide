import { defineAppSetup } from '@slidev/types'
import ServiceTopology from '../components/presentation/ServiceTopology.vue'
import TraceEvidence from '../components/presentation/TraceEvidence.vue'
import DemoClip from '../components/presentation/DemoClip.vue'
import CustomerResult from '../components/presentation/CustomerResult.vue'
import SavingsExample from '../components/presentation/SavingsExample.vue'

export default defineAppSetup(({ app }) => {
  app.component('ServiceTopology', ServiceTopology)
  app.component('TraceEvidence', TraceEvidence)
  app.component('DemoClip', DemoClip)
  app.component('SavingsExample', SavingsExample)
  app.component('CustomerResult', CustomerResult)
})
