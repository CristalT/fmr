import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      setupFiles: './vitest.setup.ts',
      include: ['**/*.test.{js,ts}'],
      silent: false,
      environment: 'jsdom',
      reporters: 'verbose',
      coverage: {
        reporter: ['text'],
      },
    },
  })
)
