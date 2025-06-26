import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    appName: 'FMR Site',
    auth: async ({ auth }) => {
      const isCustomerLoggedIn = await auth.use('customer').check()
      const isAdminLoggedIn = await auth.use('admin').check()
      const { fullName: userFullName, id: userId } = auth.use('customer').user ?? {}
      return { isCustomerLoggedIn, isAdminLoggedIn, userFullName, userId }
    },
    errors: (ctx) => ctx.session?.flashMessages.get('errors'),
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: false,
    entrypoint: 'inertia/app/ssr.ts',
  },
})
