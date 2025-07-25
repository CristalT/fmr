import factory from '@adonisjs/lucid/factories'
import Administrator from '#models/administrator'

export const AdministratorFactory = factory
  .define(Administrator, async ({ faker }) => {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  })
  .build()
