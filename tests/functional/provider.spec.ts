import { AdministratorFactory } from '#database/factories/admin_factory'
import { ProviderFactory } from '#database/factories/provider_factory'
import Administrator from '#models/administrator'
import Provider from '#models/provider'
import { test } from '@japa/runner'

test.group('Provider', (group) => {
  let providers: Provider[]
  let admin: Administrator

  group.setup(async () => {
    providers = await ProviderFactory.createMany(10)
    admin = await AdministratorFactory.create()
  })

  test('get providers list', async ({ client }) => {
    const response = await client.get('/admin/providers').withGuard('admin').loginAs(admin)
    response.assertBodyContains(providers.map(({ alias, name }) => ({ alias, name })))
  })

  test('get providers list with pagination', async ({ client }) => {
    const response = await client
      .get('/admin/providers?page=1&size=5')
      .withGuard('admin')
      .loginAs(admin)
    response.assertBodyContains({ meta: { currentPage: 1, lastPage: 2, perPage: 5 } })
  })

  test('get providers list without pagination', async ({ client }) => {
    const response = await client.get('/admin/providers').withGuard('admin').loginAs(admin)
    response.assertBodyNotContains({ meta: { currentPage: 1, lastPage: 2, perPage: 5 } })
  })

  test('search provider by name', async ({ client }) => {
    ProviderFactory.merge({ name: 'test' }).create()
    const response = await client
      .get('/admin/providers?terms=test&page=1')
      .withGuard('admin')
      .loginAs(admin)
    response.assertBodyContains({ meta: { currentPage: 1, lastPage: 1 }, data: [{ name: 'test' }] })
  })

  test('search provider by alias', async ({ client }) => {
    ProviderFactory.merge({ alias: 'TES' }).create()
    const response = await client
      .get('/admin/providers?terms=TES&page=1')
      .withGuard('admin')
      .loginAs(admin)
    response.assertBodyContains({ meta: { currentPage: 1, lastPage: 1 }, data: [{ alias: 'TES' }] })
  })

  test('render provider edit form', async ({ client }) => {
    const provider = providers.at(0)!
    const response = await client
      .get(`/admin/providers/${provider.alias}/edit`)
      .withInertia()
      .withGuard('admin')
      .loginAs(admin)

    response.assertInertiaComponent('admin/providers/edit')
    response.assertInertiaPropsContains({
      provider: { alias: provider.alias, name: provider.name, email: provider.email },
    })
  })
})
