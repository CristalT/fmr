import { defineConfig } from '@adonisjs/auth'
import { InferAuthEvents, Authenticators } from '@adonisjs/auth/types'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'

const authConfig = defineConfig({
  default: 'customer',
  guards: {
    api: tokensGuard({
      provider: tokensUserProvider({
        tokens: 'accessTokens',
        model: () => import('#models/customer'),
      }),
    }),
    customer: sessionGuard({
      useRememberMeTokens: false,
      provider: sessionUserProvider({
        model: () => import('#models/customer'),
      }),
    }),
    admin: sessionGuard({
      useRememberMeTokens: false,
      provider: sessionUserProvider({
        model: () => import('#models/administrator'),
      }),
    }),
  },
})

export default authConfig

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
  interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
