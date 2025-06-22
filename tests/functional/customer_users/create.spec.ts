import CustomerUser from '#models/customer_user'
import hash from '@adonisjs/core/services/hash'
import { test } from '@japa/runner'

const userFakeData = {
  firstName: 'test',
  lastName: 'user',
  email: 'test@email.com',
  password: 'secret',
}

test.group('Customer users create', () => {
  test('user is saved with hashed password', async ({ assert }) => {
    const user = new CustomerUser()
    user.fill(userFakeData)
    await user.save()
    assert.isTrue(hash.isValidHash(user.password))
    assert.isTrue(await hash.verify(user.password, 'secret'))
  })
})
