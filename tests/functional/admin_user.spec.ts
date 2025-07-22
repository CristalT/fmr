import { AdminUserFactory } from '#database/factories/admin_user_factory'
import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'

test.group('Customer users create', () => {
  test('user is saved with hashed password', async ({ assert }) => {
    const user = await AdminUserFactory.merge({ password: 'secret' }).create()
    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'secret'))
  })
})
