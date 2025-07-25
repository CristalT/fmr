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
      const settings = await Setting.getAll()

      return {
        companyAddress: settings.get('company_address'),
        companyCity: settings.get('company_city'),
        companyProvince: settings.get('company_province'),
        companyZipCode: settings.get('company_zip_code'),
        companyPhone: settings.get('company_phone'),
        companyEmail: settings.get('company_email'),
        whatsapp: settings.get('company_whatsapp'),
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
