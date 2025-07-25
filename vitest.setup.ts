import { afterEach } from 'vitest'
import { config } from '@vue/test-utils'

import { QueryClient, VUE_QUERY_CLIENT } from '@tanstack/vue-query'
config.global.provide = {
  [VUE_QUERY_CLIENT]: new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  }),
}

afterEach(() => {
  // clear query client cache
  config.global.provide[VUE_QUERY_CLIENT].clear()
})
