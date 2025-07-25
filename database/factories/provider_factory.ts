import factory from '@adonisjs/lucid/factories'
import Provider from '#models/provider'

export const ProviderFactory = factory
  .define(Provider, async ({ faker }) => {
    return {
      alias: faker.string.alpha({ length: 3 }),
      name: faker.company.name(),
      email: faker.internet.email(),
    }
  })
  .build()
