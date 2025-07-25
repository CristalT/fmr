import factory from '@adonisjs/lucid/factories'
import Customer from '#models/customer'

export const CustomerFactory = factory
  .define(Customer, async ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .build()
