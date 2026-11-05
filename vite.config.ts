import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    watch: {
      // Generated demo output and build caches can exhaust Linux file watchers.
      ignored: ['**/.artifacts/**'],
    },
  },
  slidev: {
    components: {
      // The injector implementations share components/ with the slide widgets.
      // Keep their documentation and source out of Vue component discovery.
      globsExclude: ['**/components/otel-injector-*/**'],
    },
  },
})
