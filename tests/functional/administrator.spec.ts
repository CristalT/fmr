import { AdministratorFactory } from '#database/factories/admin_factory'
import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'

test.group('Administrator', () => {
  test('user is saved with hashed password', async ({ assert }) => {
    const admin = await AdministratorFactory.merge({ password: 'secret' }).create()
    assert.isTrue(hash.isValidHash(admin.password))
    assert.isTrue(await hash.verify(admin.password, 'secret'))
  })

  test('admin user log in', async ({ client }) => {
    const password = 'secret'
    const { email } = await AdministratorFactory.merge({ password }).create()
    const response = await client.post('/auth/login').form({ email, password })

    response.assertRedirectsTo('/admin')
  })
})
