import factory from '@adonisjs/lucid/factories'
import AdminUser from '#models/admin_user'

export const AdminUserFactory = factory
  .define(AdminUser, async ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .build()