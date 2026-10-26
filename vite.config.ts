import { defineConfig } from 'vite'

export default defineConfig({
  slidev: {
    components: {
      // The injector implementations share components/ with the slide widgets.
      // Keep their documentation and source out of Vue component discovery.
      globsExclude: ['**/components/otel-injector-*/**'],
    },
  },
})
