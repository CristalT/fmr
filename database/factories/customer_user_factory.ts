import factory from '@adonisjs/lucid/factories'
import CustomerUser from '#models/customer_user'

export const CustomerUserFactory = factory
  .define(CustomerUser, async ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .build()
