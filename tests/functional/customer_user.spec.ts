import { CustomerUserFactory } from '#database/factories/customer_user_factory'
import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'
import { DateTime } from 'luxon'

test.group('Customer users create', () => {
  test('user is saved with hashed password', async ({ assert }) => {
    const user = await CustomerUserFactory.merge({ password: 'secret' }).create()
    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'secret'))
  })

  test('user login success', async ({ client, assert }) => {
    const user = await CustomerUserFactory.merge({ password: 'secret' }).create()

    const loginResult = await client.post('/auth/customers').withInertia().form({
      email: user.email,
      password: 'secret',
    })

    assert.notExists(loginResult.inertiaProps.errors)
  })

  test('user login fails', async ({ client, assert }) => {
    const user = await CustomerUserFactory.merge({ password: 'secret' }).create()

    const loginResult = await client.post('/auth/customers').withInertia().form({
      email: user.email,
      password: 'wrongpassword',
    })

    assert.exists(loginResult.inertiaProps.errors)
  })

  test('user login fails with non-existing user', async ({ client, assert }) => {
    const loginResult = await client.post('/auth/customers').withInertia().form({
      email: 'adssad@adsa.com',
      password: 'wrongpassword',
    })

    assert.exists(loginResult.inertiaProps.errors)
  })

  test('deleted user cannot log in', async ({ client, assert }) => {
    const user = await CustomerUserFactory.merge({ password: 'secret' }).create()
    user.deletedAt = DateTime.now()
    await user.save()

    const loginResult = await client.post('/auth/customers').withInertia().form({
      email: user.email,
      password: 'secret',
    })
    assert.exists(loginResult.inertiaProps.errors)
  })
})
