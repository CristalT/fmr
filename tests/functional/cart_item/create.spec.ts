import { CustomerUserFactory } from '#database/factories/customer_user_factory'
import { ProductFactory } from '#database/factories/product_factory'
import { test } from '@japa/runner'

test.group('Cart item create', () => {
  test('customer user adds an item to its cart', async ({ client }) => {
    const customer = await CustomerUserFactory.create()

    const product = await ProductFactory.create()

    const response = await client
      .post('/cart-items')
      .withGuard('customer')
      .loginAs(customer)
      .form({
        id: product.id,
        quantity: 1,
      })

    response.assertCreated()
  })
})
