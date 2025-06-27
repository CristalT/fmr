import Setting from '#models/setting'
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
    settings: async () => {
      return {
        companyAddress: await Setting.get('company_address'),
        companyCity: await Setting.get('company_city'),
        companyProvince: await Setting.get('company_province'),
        companyZipCode: await Setting.get('company_zip_code'),
        companyPhone: await Setting.get('company_phone'),
        companyEmail: await Setting.get('company_email'),
        whatsapp: await Setting.get('company_whatsapp')
      }
    },
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
